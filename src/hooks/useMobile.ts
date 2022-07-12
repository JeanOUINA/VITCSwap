import React from "react"

export default function useMobile(){
    const [isMobile, setMobile] = React.useState(window.innerWidth <= 768)

    React.useEffect(() => {
        const listener = () => {
            setMobile(window.innerWidth <= 768)
        }
        window.addEventListener("resize", listener)
        return () => {
            window.removeEventListener("resize", listener)
        }
    }, [])

    return isMobile
}