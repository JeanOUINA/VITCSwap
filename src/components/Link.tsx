import * as React from "react";
import {
  Link as RouterLink
} from "react-router-dom";
import LinkMUI from "@mui/material/Link";

export default function Link({
    href,
    children,
    nocolor
}:{
    href: string,
    children: React.ReactNode,
    nocolor?: boolean
}){
    return <LinkMUI
        component={RouterLink}
        to={href}
        color={nocolor ? "inherit" : "primary"}
        underline={nocolor ? "none" : "hover"}
    >
        {children}
    </LinkMUI>
}

export function ExternalLink({
    href,
    children
}:{
    href: string,
    children: React.ReactNode
}){
    return <LinkMUI component={RouterLink} to={href} target="_blank" rel="noreferrer">
        {children}
    </LinkMUI>
}