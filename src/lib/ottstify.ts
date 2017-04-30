import * as restify from 'restify';
import * as restCookies from 'restify-cookies';

import * as ottil from './utils';
import DataManager from './dataman';

export default class RestServer 
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

    public start(): Promise<object>
    {
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

        for(let Url of this.urls)
        {
            let url = new Url(this, this.dm)
            switch(Url.type)
            {
                case 'post':
                    server.post(Url.url, (req: any, res, next)=>
                    {
                        let data = req.params || req.body && (typeof req.body === 'string') ? ottil.safeJSON(req.body) : req.body;
                        url.onLoad({req: req as restify.Request, res, next} as RestObj, data, req.cookies);
                    });
                break;

                case 'get':
                case 'put':
                case 'delete':
                break;
            }
        }
    }

    public addURL(urlC: typeof RestURL)
    {
        return this.urls.add(urlC);
    }
}

export class RestURL 
{
    public static url: string = "";
    public static type: string = "get";

    constructor(private parent: RestServer, private dm: DataManager)
    {
        
    }

    public onLoad(rest: RestObj, data: any = null, cookies: any = null)
    {
        this.end(rest, {success: true} );
    }

    public end(rest: RestObj, data: any)
    {
        let {res, req, next} = rest;

        res.end(data);
        next();
    }
}

interface RestObj
{
    req: restify.Request;
    res: restify.Response;
    next: restify.Next;
}