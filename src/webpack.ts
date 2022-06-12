// this file contains declaration for webpack DefinePlugin
// specified in webpack.config.ts. Using this, we can remove
// unnecessary part of the code at compilation
// for example, if you have `if(webpack.mode === "production"){}`
// and it's not production, this code will be removed automatically
// by webpack
declare global {
    const webpack:{
        mode: "development"|"production"
    }
}

export {}