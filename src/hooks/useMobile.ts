import React from "react"

export default function useMobile(){
    const [isMobile, setMobile] = React.useState(window.innerWidth < 600)

    React.useEffect(() => {
        const listener = () => {
            setMobile(window.innerWidth < 600)
        }
        window.addEventListener("resize", listener)
        return () => {
            window.removeEventListener("resize", listener)
        }
    }, [])

    return isMobile
}