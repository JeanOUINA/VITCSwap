import BigNumber from "bignumber.js"

export function rawToReadable(amount:string, network:string):string{
    return new BigNumber(amount).shiftedBy(18).toFixed()    
}

export function readableToRaw(amount:string, network:string):string{
    return new BigNumber(amount).shiftedBy(-18).toFixed() 
}

export function validateEmail(email:string):boolean{
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
}

export function getTokenSymbolFull(symbol:string, index:number){
    if(index === 0)return symbol
    return `${symbol}-${"0".repeat(3-index.toString().length)+index}`
}

export const AMOUNT_REGEXP = /^\d+(\.\d+)?$/

export function wait(ms:number){
    return new Promise(r=>setTimeout(r,ms))
}