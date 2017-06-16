export function safeJSON<T>(json: string): T
{
    let ret : T = null;
    try 
    { 
        ret = JSON.parse(json); 
    }
    catch(e) {};

    return ret;
}

export function shallowUpdate<T>(old: T, newO: any): T
{
    let n: T = Object.create(newO);

    for(let prop in n)
        old[prop] = n[prop];

    return old as T;
}

export function deepUpdate<T>(old: any, newO: any): T
{
    for(let pr in newO)
    {
        switch(typeof newO[pr])
        {
            case 'number':
            case 'string':
                old[pr] = newO[pr];
            break;

            case 'object':
                if(!old[pr]) old[pr] = (Array.isArray(newO[pr]) ? [] : {});
                deepUpdate(old[pr], newO[pr]);
            break;
        }
    }

    return old as T;
}

export function getObjPropList(obj, curP = "", retO = {})
    {
        for(let prop in obj)
            if(obj.hasOwnProperty(prop))
            {
                let val = obj[prop];
                if(typeof val === "object")
                    getObjPropList(val, curP + prop + '.', retO);
                else
                    retO[curP + prop] = val;
            };

        return retO;
    };