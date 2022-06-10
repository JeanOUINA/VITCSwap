import "whatwg-fetch"
import "setimmediate"
import React from "react"
import ReactDOM from "react-dom"
import App from "./app"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "./toasts.scss"
import "./scrollbar.scss"
import "./websocket"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// stupid typescript loader error
import favicon from "./assets/logo/favicon.png"

ReactDOM.render(React.createElement(App), document.querySelector("#app-mount"))

let link:HTMLLinkElement = document.querySelector("link[rel~=\"icon\"]")
if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    document.getElementsByTagName("head")[0].appendChild(link)
}
link.href = favicon