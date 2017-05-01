import * as fs from 'fs';

import * as otil from './utils.js';

export class ConfigHandler
{
    public config: object;

    private liveReload: boolean;
    private cfgPath: string;

    constructor(cfgPath: string, defCfg = {}, liveReload: boolean = false)
    {
        this.cfgPath = cfgPath;
        this.liveReload = liveReload;

        this.config = Object.create(defCfg);
    }

    public start()
    {
        if(this.liveReload)
            fs.watchFile(this.cfgPath, (curr, prev)=>
            {
                this.updateConfig();
            });

        return this.updateConfig();
    }
    
    private updateConfig(): Promise<any>
    {
        return new Promise((resolve, reject)=>{
            fs.readFile(this.cfgPath, (err, data)=>
            {
                if(!err && data)
                {
                    let newCfg: object = otil.safeJSON(data.toString());
                    otil.deepUpdate(this.config, newCfg);
                    resolve(this.config);
                }
                    
                else
                    reject(err);
            });
        });
    }
}

export default ConfigHandler;