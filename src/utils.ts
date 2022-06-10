export function getTokenSymbolFull(symbol:string, index:number){
    if(index === 0)return symbol
    return `${symbol}-${"0".repeat(3-index.toString().length)+index}`
}

export const AMOUNT_REGEXP = /^\d+(\.\d+)?$/

export function wait(ms:number){
    return new Promise(r=>setTimeout(r,ms))
}