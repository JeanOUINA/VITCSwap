import NetworkStore, { Network } from "./stores/NetworkStore"

export async function callApi(url:string, method = "GET", body?: any){
    const resp = await fetch("/api"+url, {
        method,
        body: body || null
    })
    let text = await resp.text()
    let json:any = {
        error: {
            name: "ServerError",
            message: "The json returned by the server couldn't be parsed."
        }
    }
    try{
        json = JSON.parse(text)
    }catch{}
    if(typeof json === "object" && json !== null && "error" in json){
        const err = new Error(json.error.message)
        err.name = json.error.name
        throw err
    }else {
        return json
    }
}

export async function callViteApi(url:string, method = "GET", body?: any){
    // ${NetworkStore.getNetwork() === Network.TESTNET ? "-testnet" : ""}
    const resp = await fetch(`https://vite-api.thomiz.dev/${url.slice(1)}`, {
        method,
        body: body || null,
        headers: method === "POST" ? {
            "Content-Type": "application/json"
        } : {}
    })
    let text = await resp.text()
    let json:any = {
        error: {
            name: "ServerError",
            message: "The json returned by the server couldn't be parsed."
        }
    }
    try{
        json = JSON.parse(text)
    }catch{}
    if(typeof json === "object" && json !== null && "error" in json){
        const err = new Error(json.error.message)
        err.name = json.error.name
        throw err
    }else {
        return json
    }
}