/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@emotion/react"
import Typography  from "@mui/material/Typography"

export default function NotFound(){
    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: "100px"
    }}>
        <Typography variant="h1" css={{
            fontFamily: "poppins-semibold, poppins, sans-serif"
        }}>
            
            404 Not Found
        </Typography>
        <div style={{marginTop:"10px"}}></div>
        <Typography variant="h4">
            You likely clicked on an invalid link.
        </Typography>
    </div>
}