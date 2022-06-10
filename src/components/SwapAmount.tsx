/** @jsx jsx */
import { jsx } from "@emotion/react"
import { InputAdornment, TextField } from "@mui/material"
import { AMOUNT_REGEXP } from "../utils"

export function SwapAmount(props:{
    amount:string,
    setAmount(amount:string):void,
    ticker:string,
    disabled?:boolean
}){
    const error = props.amount && !AMOUNT_REGEXP.test(props.amount)
    return <div>
        <TextField variant="outlined" value={props.amount || ""} onChange={(ev) => {
            const value = ev.target.value.replace(/[^\d\.]/g, "")
            props.setAmount(value || null)
        }} label="Amount" css={{
            width: "100%"
        }} placeholder="0.0" error={error} helperText={
            error ? "Invalid Amount" : null
        } InputProps={{
            endAdornment: <InputAdornment position="end">{props.ticker}</InputAdornment>
        }} inputProps={{
            style: {
                textAlign: "right"
            }
        }} disabled={props.disabled}/>
    </div>
}