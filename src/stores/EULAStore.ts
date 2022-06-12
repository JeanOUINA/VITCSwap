import events from "../events"

export default new class EULAStore {
    cache:boolean
    getAccept():boolean{
        if(this.cache !== undefined)return this.cache
        return this.cache = localStorage.getItem("eula_accept") === "true"
    }
    setAccept(accept: boolean){
        this.cache = accept
        events.emit("EULA_CHANGE", accept)
        return localStorage.setItem("eula_accept", accept + "")
    }
}