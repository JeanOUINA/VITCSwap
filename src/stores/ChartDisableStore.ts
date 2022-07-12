import events from "../events"

export default new class ChartDisableStore {
    cache:boolean
    getDisabled():boolean{
        if(this.cache !== undefined)return this.cache
        return this.cache = localStorage.getItem("chart_disabled") === "true"
    }
    setDisabled(disabled: boolean){
        this.cache = disabled
        events.emit("CHART_DISABLED_CHANGE", disabled)
        return localStorage.setItem("chart_disabled", disabled + "")
    }
}