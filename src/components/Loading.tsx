import React from "react"
import ReactLoading from "react-loading"
import darkTheme from "../themes/dark"

export default function Loading(){
    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: "200px"
    }}>
        <ReactLoading type="spin" color={darkTheme.palette.primary.main} className="margin-auto" />
    </div>
}