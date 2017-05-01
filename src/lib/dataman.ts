export class DataManager
{
    public dataGetters: DataGetters = {};

    constructor(public dataCon: DataConnection)
    {

    }

    addDataGetter(Getter: typeof DataGetter)
    {
        let a = new Getter(this.dataCon);
        this.dataGetters[a.serviceName] = a;
    }
}
export default DataManager;

export interface DataGetters 
{
    [index: string]: DataGetter;
}

export class DataConnection
{
    public serviceName: string = "data_connection";

    public connection: any;

    public open(): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({})});
    }
    public close(): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({})});
    }
}

export class DataGetter
{
    public serviceName: string = "data_getter";

    constructor(protected dataCon: DataConnection)
    {

    }
    public add(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{return resolve({success: true, data} as DataResponse);});
    }
    public get(id: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{return resolve({success: true, data: id} as DataResponse)});
    }
    public set(id: any, data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{return resolve({success: true, data} as DataResponse)});
    }
    public rid(id: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({success: true, data: id} as DataResponse);});
    }
}

export interface DataResponse
{
    success: boolean;
    data?: any;
    error?: any;
}