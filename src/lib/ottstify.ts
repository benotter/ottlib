import * as restify from 'restify';
import * as restCookies from 'restify-cookies';

import DataManager from './dataman';

export default class RestServer 
{
    private domain: string;
    private server: restify.Server;

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

    }
}

export class RestURL 
{
    public static url = "";
    public static type = "get";

    
}