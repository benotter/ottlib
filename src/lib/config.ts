/**
 * config.ts
 * 
 * Otter's 'simple' Configuration Loader
 */

import * as fs from 'fs';
import * as otil from './utils.js';

/**
 * @class ConfigHandler - Handles the loading of a configuration file
 */
export class ConfigHandler
{
    public config: object;

    private liveReload: boolean;
    private cfgPath: string;

    /**
     * 
     * @param cfgPath - Path to config File
     * @param defCfg - Default Configuration Object
     * @param liveReload - If True, config will be reloaded dynamically on change
     */
    constructor(cfgPath: string, defCfg = {}, liveReload: boolean = false)
    {
        this.cfgPath = cfgPath;
        this.liveReload = liveReload;

        this.config = Object.create(defCfg);
    }

    /**
     * @function start - Starts the Configuration Loader, and Loads the file.
     */
    public start()
    {
        if(this.liveReload)
            fs.watchFile(this.cfgPath, (curr, prev)=>
            {
                this.updateConfig();
            });

        return this.updateConfig();
    }

    /**
     * @function updateConfig - Reloads and updates the configuration object with a deep update to preserve references.
     */
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