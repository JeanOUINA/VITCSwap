import ChartDisableStore from "../stores/ChartDisableStore";
import useEvent from "./useEvent";

export function useChartDisabled(){
    return useEvent("CHART_DISABLED_CHANGE", ChartDisableStore.getDisabled())
}