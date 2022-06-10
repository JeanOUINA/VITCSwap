import React from "react"

export default function useWindowSize(){
    const [sizes, setSizes] = React.useState([window.innerWidth, window.innerHeight])

    React.useEffect(() => {
        const listener = () => {
            setSizes([window.innerWidth, window.innerHeight])
        }
        window.addEventListener("resize", listener)
        return () => {
            window.removeEventListener("resize", listener)
        }
    }, [])

    return sizes
}