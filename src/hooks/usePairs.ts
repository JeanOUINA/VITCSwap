import { pairs } from "../vite";
import useEvent from "./useEvent";

export default function usePairs(){
    return useEvent("PAIRS_UPDATE", pairs)
}