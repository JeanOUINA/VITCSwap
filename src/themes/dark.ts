import {
    createTheme,
    responsiveFontSizes
} from "@mui/material/styles";

export const colors = {
    logo: "#FF6729",
    secondaryLogo: "#C8440C",
    secondaryBackground: "#2A2A2A",
    background: "#1A1A1A"
}

const darkTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: colors.logo
        },
        secondary: {
            main: colors.secondaryBackground
        },
        background: {
            default: colors.background
        }
    }
}))

export default darkTheme