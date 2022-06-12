import events from "../events"

export default new class SlippageStore {
    cache:number
    static default = 0.5;
    getSlippage():number{
        if(this.cache)return this.cache
        // put mashed keyboard at the end, because `null`
        // is understood by Number as 0.
        const raw = Number(localStorage.getItem("slippage") || "asdsdjnfskjn")
        if(!this.isValidSlippage(raw))return this.cache = SlippageStore.default
        return this.cache = raw
    }
    setSlippage(slippage: number){
        this.cache = slippage
        events.emit("SLIPPAGE_CHANGE", slippage)
        return localStorage.setItem("slippage", JSON.stringify(slippage))
    }
    isValidSlippage(raw:number){
        return !isNaN(raw) && raw <= 100 && raw >= 0
    }
}