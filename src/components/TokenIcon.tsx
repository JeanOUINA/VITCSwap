/** @jsx jsx */
import { jsx } from "@emotion/react"

export default function TokenIcon(props:{
    iconURL: string
}){
    if(props.iconURL){
        return <img src={props.iconURL} css={{
            width: 56,
            height: 56,
            borderRadius: "50%"
        }} height={56} width={56} draggable={false} />
    }
    return null
}