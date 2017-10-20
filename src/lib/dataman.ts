/**
 * dataman.ts
 * 
 * Otter's Generic Data Manager
 * You must Extend the DataConnection and DataGetter classes for a specific source of Data!
 */

 /**
  * @class DataManager - Manages Custom DataConnections and DataGetters
  */
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

/**
 * @class DataConnection - Base DataConnection Class, Extend to use with DataManager
 */
export class DataConnection
{
    public serviceName: string = "data_connection";

    public connection: any;
    /**
     * @func open - Opens Data Connection
     */
    public open(): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({success: true})});
    }
    /**
     * @func close - Closes Data Connection
     */
    public close(): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({success: true})});
    }
}
/**
 * @class DataGetter - Base DataGetter Class, Extend to use with DataManager
 */
export class DataGetter
{
    public serviceName: string = "data_getter";

    constructor(protected dataCon: DataConnection){}
    
    /**
     * Gets data from Collection In an Aggregated Way
     * @param {any} data - Data for Aggregation Search
     */
    public aggregate(data: any): any
    {
        return new Promise((resolve, reject)=>{return resolve({success: true, data: {data}} as DataResponse);});
    }
    /**
     * See aggregate
     * @param {any} data - See aggregate
     */
    public agg(data: any): any
    {
        return this.aggregate(data);
    }

    /**
     * Adds Data to Collection
     * @param data - Data to Add
     */
    public add(data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{return resolve({success: true, data} as DataResponse);});
    }
    /**
     * Gets Data From Collection
     * @param id - ID of Data To Get
     */
    public get(id: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{return resolve({success: true, data: id} as DataResponse)});
    }
    /**
     * Sets Data in Collection
     * @param id - ID of data to Set
     * @param data - Data to set ID to
     */
    public set(id: any, data: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{return resolve({success: true, data} as DataResponse)});
    }
    /**
     * Deletes Data in Collection
     * @param id - ID of data to Delete
     */
    public rid(id: any): Promise<DataResponse>
    {
        return new Promise((resolve, reject)=>{resolve({success: true, data: id} as DataResponse);});
    }
}
/**
 * @interface DataResponse
 * @prop {boolean} success - True if no errors, False if Error
 * @prop {any} data - If Successful, will contain Requested Data.
 * @prop {any} error - If UnSuccessful, will contain Error Data.
 */
export interface DataResponse
{
    success: boolean;
    data?: any;
    error?: any;
}