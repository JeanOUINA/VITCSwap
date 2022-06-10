import NetworkStore from "../stores/NetworkStore"
import useEvent from "./useEvent"

export default function useNetwork(){
    return useEvent("NETWORK_CHANGE", NetworkStore.getNetwork())
}