/*
 * utils.ts
 * 
 * Various Utilities for use throughout the library.
 */

/**
 * JSON.parse without full-stack exception
 * @param json - JSON to parse
 * @return {T} - Object with specified Generic Type.
 */
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
/**
 * Updates Object old with properties in Object new
 * @param old - Old Object containing properties to update
 * @param newO - New Object with data to update old object with
 * @return {any} - Object old
 */
export function shallowUpdate<T>(old: T, newO: any): T
{
    let n: T = Object.create(newO);

    for(let prop in n)
        old[prop] = n[prop];

    return old as T;
}

/**
 * Updates an object without breaking sub-object references, using Object new as the source
 * @param old - Old Object to Update
 * @param newO - New object containing updated properties
 * @return {any} - Object old
 */
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

/**
 * Returns an object with no sub-objects that containing the full path and value of any SubObjects in the given Object
 * @param obj - Object to Get properties of
 * @param curP - Current Parent Property (For Recursive Use Only)
 * @param retO - Contains a list of full property paths and the value they contained
 */
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