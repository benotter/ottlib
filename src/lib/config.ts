import * as fs from 'fs';

import * as otil from './utils.js';

export default class ConfigHandler
{
    public config: object;

    private liveReload: boolean;
    private cfgPath: string;

    constructor(cfgPath: string, defCfg, liveReload: boolean = false)
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
        else
            this.updateConfig();
    }
    
    private updateConfig()
    {
        fs.readFile(this.cfgPath, (err, data)=>
        {
            if(!err && data)
            {
                let newCfg: object = otil.safeJSON(data.toString());
                otil.updateShallowObj(this.config, newCfg);
            }
        });
    }
}