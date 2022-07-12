import ChartDisableStore from "../stores/ChartDisableStore";
import useEvent from "./useEvent";
import useMobile from "./useMobile";

export function useChartDisabled(){
    const isMobile = useMobile()
    return useEvent(
        "CHART_DISABLED_CHANGE",
        ChartDisableStore.getDisabled()
    ) || isMobile
}