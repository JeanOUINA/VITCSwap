import DataEncodingStore from "../stores/DataEncodingStore"
import useEvent from "./useEvent"

export default function useDataEncoding(){
    return useEvent("ENCODING_CHANGE", DataEncodingStore.getEncoding())
}