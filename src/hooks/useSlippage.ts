import SlippageStore from "../stores/SlippageStore"
import useEvent from "./useEvent"

export default function useSlippage(){
    return useEvent("SLIPPAGE_CHANGE", SlippageStore.getSlippage())
}