import events from "../events"

export enum DataEncoding {
    base64 = "base64",
    hex = "hex"
}

export default new class DataEncodingStore {
    cache:DataEncoding
    getEncoding():DataEncoding{
        if(this.cache)return this.cache
        const network = localStorage.getItem("encoding")
        if(!network || !Object.keys(DataEncoding).includes(network))return this.cache = DataEncoding.base64
        return this.cache = network as DataEncoding
    }
    setNetwork(encoding: DataEncoding){
        this.cache = encoding
        events.emit("ENCODING_CHANGE", encoding)
        return localStorage.setItem("encoding", encoding)
    }
}

export function displayEncoding(encoding: DataEncoding){
    return ({
        "base64": "Base64",
        "hex": "Hexadecimal"
    })[encoding] || encoding
}