// we need to fix the fucking accountBlock error that has been here for life
const fs = require("fs")
const {join} = require("path")

const main = require.resolve("@vite/vitejs")
const filepath = join(main, "../..", "distSrc/viteAPI/index.ts")

if(fs.existsSync(filepath+".patched")){
    console.log(`ViteJS is already patched.`)
    process.exit(0)
}

fs.writeFileSync(
    filepath,
    fs.readFileSync(filepath, "utf-8")
    .replace(/accountblock\/utils/g, "accountBlock/utils")
)
fs.writeFileSync(
    filepath+".patched",
    "true"
)