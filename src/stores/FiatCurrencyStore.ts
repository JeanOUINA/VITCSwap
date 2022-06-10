import events from "../events"

export enum FiatCurrencies {
    USD = "USD",
    EUR = "EUR"
}

export const fiatTickerToSymbol = {
    USD: "$",
    EUR: "€",
    CHF: "CHF",
    GBP: "£",
    ILS: "₪",
    CNY: "¥",
    JPY: "¥",
    INR: "₹",
    BTC: "₿",
    ETH: "Ξ",
    VITE: "Vite"
}

export default new class FiatCurrencyStore {
    cache:FiatCurrencies
    getCurrency():FiatCurrencies{
        if(this.cache)return this.cache
        const fiat = localStorage.getItem("fiat")
        if(!fiat || !Object.keys(FiatCurrencies).includes(fiat))return this.cache = FiatCurrencies.USD
        return this.cache = fiat as FiatCurrencies
    }
    setCurrency(currency: FiatCurrencies){
        this.cache = currency
        events.emit("FIAT_CHANGE", currency)
        return localStorage.setItem("fiat", currency)
    }
}