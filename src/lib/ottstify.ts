/**
 * ottstify.ts
 * 
 * Otter's RestifyJS Library Abstractor
 * 
 * Restify (C) to its authors, awesome simple library.
 */

import * as restify from 'restify';
import * as restCookies from 'restify-cookies';

import * as otil from './utils';
import {DataManager, DataGetters, DataResponse} from './dataman';

/**
 * @class RestServer - Hosts an HTTP connection and responds based on loaded URL templates.
 */
export class RestServer 
{
    private domain: string;
    private server: restify.Server;

    private urls: Set<typeof RestURL> = new Set();

    private restConf: any;

    /**
     * @constructor
     * @param cfg - REST server configuration
     * @param dm - DataManager to use for loaded URLs
     */
    constructor(private cfg: any, private dm: DataManager)
    {
        let restConf = this.restConf = cfg.restConf || cfg;
        this.domain = restConf.domain || "";

        let server = this.server = restify.createServer(restConf);

        let serverPlugs = [
            restify.bodyParser({mapFiles: true}),
            restify.fullResponse(),
            restify.queryParser(),
            restCookies.parse,
            restify.CORS({headers: ['Content-Type'], credentials: true})
        ];

        for(let plug of serverPlugs)
            server.use(plug);
    }

    /**
     * @func start - Starts Up the REST Server
     */
    public start(): Promise<DataResponse>
    {
        this.setup();
        return new Promise((resolve, reject)=>
        {
            this.server.listen(this.restConf.port, (err)=>
            {
                if(!err)
                    resolve({success: true});
                else
                    reject(err);
            });
        });
    }

    /**
     * @func setup - Sets up the loaded URL templates, getting them Ready for Start
     */
    public setup()
    {
        let server = this.server;

        for(let UrlC of this.urls)
        {
            let url = new UrlC(this, this.dm, this.cfg);
            
            switch(UrlC.type)
            {
                case 'get':
                case 'put':
                case 'delete':
                case 'post':
                server.post(UrlC.url, (req: any, res, next)=>
                {
                    let rest = {req: req as restify.Request, res, next} as RestObj;
                    let data = this.getParams(req);

                    if(!data && url.reqs & RestURL.reqs.dataReq)
                        return url.onError(RestURL.reqs.dataReq, rest, data, req.cookies);
                    
                    url.onLoad(rest, data, req.cookies);
                });
                break;
            }
        }
    }

    /**
     * Adds a URL Template to the REST Server
     * @param {RestURL} urlC - Template to Add
     */
    public addURL(urlC: typeof RestURL)
    {
        return this.urls.add(urlC);
    }

    /**
     * Formats a Restify Request's Paramters.
     * @param req - Restify Request Object
     */
    private getParams(req)
    {
        let data = req.params;

        if(!data && req.body)
            data = (typeof req.body === 'string') ? otil.safeJSON(req.body) : req.body;
        else if(!req.body)
            data = null;

        return data;
    }
}

export default RestServer;

/**
 * @class RestURL - Base Class for Creating a REST URL
 */
export class RestURL 
{
    public static url: string = "";
    public static type: string = "get";
    public reqs: number = 0;

    protected dataG: DataGetters;

    public static reqs = {
        dataReq: 1,
    }
    /**
     * @constructor
     * @param parent - Containing RestServer Object
     * @param dm - RestServers DataManager Object
     * @param cfg - Configuration File for RestServer
     */
    constructor(protected parent: RestServer, protected dm: DataManager, protected cfg: any)
    {
        this.dataG = dm.dataGetters;
    }
    /**
     * Called when a URL gets a request on the RestServer.
     * @param rest - Restify Object containg Request, Response, and Next
     * @param data - Data Object that holds any data Sent with the Request
     * @param cookies - An object containing cookies sent, if any
     */
    public async onLoad(rest: RestObj, data: any = null, cookies: any = null)
    {
        this.end(rest, {success: true} );
    }

    /**
     * Called when a URL's requirements are not met.
     * @param reason - Error Number
     * @param rest - Rest Object
     * @param data - Data sent with the Request, if any
     * @param cookies - Cookies sent with the Request, if any
     */
    public async onError(reason: number, rest: RestObj, data: any = null, cookies: any = null)
    {
        let res;
        switch(reason)
        {
            case RestURL.reqs.dataReq:
            res = "No Params.";
            break;
        }
        this.end(rest, {success: false, data: res});
    }

    /**
     * Ends a Resify URL Interaction, and sends a final data message.
     * @param rest - Rest Object containing Request, Response, Next
     * @param data - Ending Response Data
     */
    public end(rest: RestObj, data: string | any)
    {
        let {res, req, next} = rest;
        let resP = typeof data == 'object' ? JSON.stringify(data) : data;
        res.end(resP);
        next();
    }
}

/**
 * @interface RestObj - Restify Object
 * @prop {Restify.Request} req - Restify Request Object
 * @prop {Restify.Response} res - Restify Response Object
 * @prop {Restify.Next} next - Restify Next Function
 */
export interface RestObj
{
    req: restify.Request;
    res: restify.Response;
    next: restify.Next;
}
