import * as fs from 'fs';

export class Logger 
{
    private logDir: string;
    private logInConsole: boolean;

    private logTypes: typeof LogType[];

    public logs: object = {};

    constructor(logDir: string, logTypes: typeof LogType[], logInConsole: boolean = true)
    {
        this.logDir = logDir;
        this.logTypes = logTypes;
        this.logInConsole = logInConsole;
    }

    start()
    {
        for(let Log of this.logTypes)
            this.logs[Log.logType] = new Log(this);
    }

    log(str: string, serv: string)
    {
        
    }
}

export default Logger;

export class LogType 
{
    public static logType: string = "log";

    private logger: Logger;

    constructor(log: Logger)
    {
        this.logger = log;
    }

    public onLog()
    {

    }

    public getLog()
    {
        return (log)=>{this.onLog()}
    }
}