export function safeJSON<T>(json: string): T
{
    let ret : T = null;
    try{ret = JSON.parse(json)}catch(e){};
    return ret;
}

export function updateShallowObj<T>(old: T, newO: any): T
{
    let n: T = Object.create(newO);

    for(let prop in n)
        old[prop] = n[prop];

    return old;
}