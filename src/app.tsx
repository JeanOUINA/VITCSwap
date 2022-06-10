import React, { useEffect } from "react"
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading"
import darkTheme from "./themes/dark"
import {
    ThemeProvider
} from "@mui/material/styles"
/*import useMediaQuery from "@mui/material/useMediaQuery"
import lightTheme from "./themes/light"*/
import CssBaseline from "@mui/material/CssBaseline"
import AppLayers from "./layers";
import useNetwork from "./hooks/useNetwork"; 
import { setNetwork } from "./vite";

const hasInitBefore = false
export default function App():JSX.Element {
    const network = useNetwork()
    useEffect(() => {
        if(hasInitBefore){
            setNetwork(network)
        }
    }, [network])
    /*const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
    const theme = prefersDarkMode ? darkTheme : lightTheme*/

    return <ErrorBoundary>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AppLayers/>
        </ThemeProvider>
    </ErrorBoundary>
}

const pagesCache:{
    [page:string]: Promise<()=>JSX.Element>|(()=>JSX.Element)
} = {}
export function PageFetcher(props:{page: string}):JSX.Element{
    const [error, setError] = React.useState<Error>(null)
    const [hasLoaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        setLoaded(false)
        setError(null)
        let promise = pagesCache[props.page]
        if(promise){
            if(promise instanceof Promise){
                promise
                .then(() => {
                    setLoaded(true)
                }).catch(err => {
                    setError(err)
                })
            }else{
                setLoaded(true)
            }
        }else{
            promise = (async () => {
                let mod = await import("./pages/"+props.page)
                if(mod?.__esModule && mod?.default){
                    mod = mod.default
                }
                pagesCache[props.page] = mod
                setLoaded(true)
                return mod
            })()
            pagesCache[props.page] = promise
            promise.catch(err => {
                setError(err)
            })
        }
    }, [props.page])
    React.useEffect(() => {
        if(error)console.error(error)
    }, [error])
    if(error)return <>Errors loading the page.</>
    if(!hasLoaded || !pagesCache[props.page])return <Loading />

    return React.createElement(pagesCache[props.page] as ()=>JSX.Element)
}