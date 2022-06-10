import { fiatTickerToSymbol } from "./stores/FiatCurrencyStore"

export function rawFormatNumber(number:string, separator:string = ","){
    if(!/^\d+(\.\d+)?$/.test(number))throw new Error("Invalid Number")
    const decimals = number.split(".")[1]
    const mainNumber = number.split(".")[0]
    let offset = mainNumber.length % 3
    let output = mainNumber.slice(0, offset)

    if(offset && offset !== mainNumber.length){
        output += separator
    }

    for(let i = 0; offset+i*3 < mainNumber.length; i++){
        if(i !== 0){
            output += separator
        }
        output += mainNumber.slice(offset+i*3, offset+i*3+3)
    }

    if(decimals){
        return [output, decimals]
    }

    return [output]
}

export function formatNumber(number:string, separator:string = ","){
    return rawFormatNumber(number, separator).join(".")
}

export function formatFiatCurrency(number:string, currency: string){
    switch(currency){
        case "USD":
            return `${fiatTickerToSymbol.USD}${formatNumber(number)}`
        case "EUR":
        case "GBP":
        case "ILS":
        case "CNY":
        case "JPY":
        case "INR":
        case "BTC":
        case "ETH":
            return `${formatNumber(number)}${fiatTickerToSymbol[currency]}`
        case "CHF":
            return `${formatNumber(number, "'")} ${fiatTickerToSymbol[currency]}`
        case "VITE":
            return `${formatNumber(number)} ${fiatTickerToSymbol[currency]}`
    }
}

export function formatAddress(address:string){
    return address.slice(0, 12)+"..."+address.slice(-7)
}