import { useEffect, useState } from "react";
import { getCurrentCycle } from "../cycle";

export default function useCycle():number{
    const [cycle, setCycle] = useState(getCurrentCycle())
    useEffect(() => {
        setInterval(() => {
            setCycle(getCurrentCycle())
        }, 60000)
    }, [])
    return cycle
}