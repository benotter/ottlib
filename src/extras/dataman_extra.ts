import {DataConnection, DataGetter} from '../index';
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
    
    public open(): Promise<object>
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

    public close(): Promise<object>
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