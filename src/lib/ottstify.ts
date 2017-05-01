import * as restify from 'restify';
import * as restCookies from 'restify-cookies';

import * as otil from './utils';
import {DataManager, DataGetters, DataResponse} from './dataman';

export class RestServer 
{
    private domain: string;
    private server: restify.Server;

    private urls: Set<typeof RestURL> = new Set();

    constructor(private cfg: any, private dm: DataManager)
    {
        this.domain = cfg.domain || "";

        let server = this.server = restify.createServer(cfg);

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

    public start(): Promise<DataResponse>
    {
        this.setup();
        return new Promise((resolve, reject)=>
        {
            this.server.listen(this.cfg.port, (err)=>
            {
                if(!err)
                    resolve({success: true});
                else
                    reject(err);
            });
        });
    }

    public setup()
    {
        let server = this.server;

        for(let UrlC of this.urls)
        {
            let url = new UrlC(this, this.dm, this.cfg)
            switch(UrlC.type)
            {
                case 'get':
                case 'put':
                case 'delete':
                case 'post':
                server.post(UrlC.url, (req: any, res, next)=>
                {
                    let data = req.params;

                    if(!data && req.body) 
                        data = (typeof req.body === 'string') ? otil.safeJSON(req.body) : req.body;
                    url.onLoad({req: req as restify.Request, res, next} as RestObj, data, req.cookies);
                });
                break;
            }
        }
    }

    public addURL(urlC: typeof RestURL)
    {
        return this.urls.add(urlC);
    }
}

export default RestServer;

export class RestURL 
{
    public static url: string = "";
    public static type: string = "get";

    protected dataG: DataGetters;
    
    constructor(protected parent: RestServer, protected dm: DataManager, protected cfg: any)
    {
        this.dataG = dm.dataGetters;
    }

    public async onLoad(rest: RestObj, data: any = null, cookies: any = null)
    {
        this.end(rest, {success: true} );
    }

    public end(rest: RestObj, data: string | any)
    {
        let {res, req, next} = rest;
        let resP = typeof data == 'object' ? JSON.stringify(data) : data;
        res.end(resP);
        next();
    }
}

export interface RestObj
{
    req: restify.Request;
    res: restify.Response;
    next: restify.Next;
}
