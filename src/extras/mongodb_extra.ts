import {DataConnection, DataGetter, DataResponse} from '../index';
import * as mongo from 'mongodb';
import * as otil from '../lib/utils';

export class MongoDBConnection extends DataConnection implements DataConnection
{
    public serviceName = "MongoDB Connection";

    public connection: mongo.Db;

    constructor(private cfg: any)
    {
        super();
    }

    public open(): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>
        {
            let cfg = this.cfg;

            //Yea, this is kinda a monster, hardcoding in creds-required and all that, but Oh Well, need it done asap.
            let addr = `mongodb://${cfg.user}:${cfg.password}@${cfg.host}:${cfg.port}/${cfg.database}?authSource=admin`;

            mongo.MongoClient.connect(addr, (err, db)=>
            {
                if(!err)
                {
                    resolve({success: true});
                    this.connection = db;
                }
                else
                    reject({success: false, data: err});
            });
        });
    }

    public close(): Promise<DataResponse> 
    {
        return new Promise((resolve, reject)=>{
            let err = null;
            try
            {
                this.connection.close();
            }
            catch(e)
            {
                err = e;
            }

            if(err)
                reject({success: false, data: err});
            else
                resolve({success: true});
        });
    }
}

export class MongoDBDataGetter extends DataGetter implements DataGetter 
{
    public table: string;

    private collection: mongo.Collection;

    constructor(protected dataCon: MongoDBConnection)
    {
        super(dataCon);
    }

    private getCollection()
    {
        if(!this.collection)
            this.collection = this.dataCon.connection.collection(this.table);
    }

    protected insert(data: any, cb: Function)
    {
        if(!this.collection)
            this.getCollection();

        this.collection.insert(data, cb);
    };
    protected select(select: string | string[], where: any,  whereOvrd: string = " AND ", cb: Function)
    {
        if(!this.collection)
            this.getCollection();
            
        this.collection.find(where, cb);
    };
    protected update(update: any, where: any, whereOvrd: string = " AND ", cb: Function)
    {
        if(!this.collection)
            this.getCollection();
            
        this.collection.update(where, { '$set': otil.getObjPropList(update) }, cb);
    };
    protected delete(where: any, cb: Function)
    {
        if(!this.collection)
            this.getCollection();
            
        this.collection.deleteOne(where, cb);
    };

    protected escape<T>(vals: string | string[] | object | T): T
    {
        return <T>vals;
    };
}