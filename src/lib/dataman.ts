export default class DataManager
{
    public dataGetters: object = {};

    constructor(
        public dataCon: DataConnection
        )
    {

    }

    addDataGetter(Getter: new (DataConnection)=>{serviceName: string })
    {
        let a = new Getter(this.dataCon);
        this.dataGetters[a.serviceName] = a;
    }
}

export class DataConnection
{
    public serviceName: string = "data_connection";

    public connection: any;

    public open(): Promise<object>
    {
        return new Promise((resolve, reject)=>{resolve({})});
    }
    public close(): Promise<object>
    {
        return new Promise((resolve, reject)=>{resolve({})});
    }
}

export class DataGetter
{
    public serviceName: string = "data_getter";

    constructor(private dataCon: DataConnection)
    {

    }

    public get(id: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({success: true, data: id} as DataResponse)});
    }
    public set(id: any, data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({success: true, data} as DataResponse)});
    }
}

export interface DataResponse
{
    success: boolean;
    data?: any;
    error?: any;
}