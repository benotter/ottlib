import {DataConnection, DataGetter, DataResponse} from '../index';
import * as mysql from 'mysql';

export class MySQLConnection extends DataConnection implements DataConnection 
{
    public serviceName = "MySQL Connection";

    public connection: mysql.Connection;

    constructor(private cfg: object)
    {
        super();
        this.connection = mysql.createConnection(cfg);
    }
    
    public open(): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            this.connection.connect((err)=>
            {
                if(!err)
                    resolve({success: true});
                else
                    reject({success: false, err});
            });
        });
    }

    public close(): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            this.connection.end((err)=>
            {
                if(!err)
                    resolve({success: true});
                else    
                    reject({success: false, err});
            });
        });
    }
}

export class MySQLDataGetter extends DataGetter implements DataGetter 
{
    protected table: string;

    constructor(protected dataCon: MySQLConnection)
    {
        super(dataCon);
    }

    private query(qu, cb)
    {
        let db = this.dataCon.connection;
        db.query(qu, cb);
    }

    private formSQL(sql: any, dil: string = ','): string
    {
        let whA: string[] = [];
        
        for(let col in sql)
            whA.push(`${col}=${sql[col]}`);

        return whA.join(dil);
    }

    protected insert(data: any, cb)
    {
        let cols = [],
            vals = [];

        for(let col in data)
        {
            cols.push(col);
            vals.push(data[col]);
        }
        
        let qu = `INSERT INTO ${this.table} (${cols.join(',')}) VALUES (${vals.join(',')});`;
        this.query(qu, cb);
    }

    protected select(select: string | string[], where: any,  whereOvrd: string = " AND ", cb: Function)
    {
        select = Array.isArray(select) ? select.join(',') : select;
        
        let qu = `SELECT ${select} FROM ${this.table} WHERE ${this.formSQL(where, whereOvrd)};`;

        this.query(qu, cb);
    }

    protected update(update: any, where: any, whereOvrd: string = " AND ", cb: Function)
    {
        let qu = `UPDATE ${this.table} SET ${this.formSQL(update)} WHERE ${this.formSQL(where, whereOvrd)};`;
        this.query(qu, cb);
    }

    protected delete(where: any, cb: Function)
    {
        let qu = `DELETE FROM ${this.table} WHERE ${this.formSQL(where)};`;
        this.query(qu, cb);
    }

    protected escape<T>(vals: string | string[] | object | T)
    {
        let db = this.dataCon.connection;

        let ret: string | string[] | object | any;

        if (typeof vals == "object")
        {
            ret = {};
            for(let pr in vals)
            {
                if(pr === 'undefined')
                {
                    delete ret[pr];
                    continue;
                }
                    
                let v = vals[pr];

                if(typeof v == "object")
                    ret[pr] = this.escape(vals[pr]);
                else
                    ret[pr] = db.escape(vals[pr]);
            }
        }
        else
            ret = db.escape(vals);

        return ret as T;
    }
}