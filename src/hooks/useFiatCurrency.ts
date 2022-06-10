import FiatCurrencyStore from "../stores/FiatCurrencyStore"
import useEvent from "./useEvent"

export default function useFiatCurrency(){
    return useEvent("FIAT_CHANGE", FiatCurrencyStore.getCurrency())
}