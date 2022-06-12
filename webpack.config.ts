import * as path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { join } from "path";

export default (env, argv) => {
    const mode = argv.mode || "development"
    const config: webpack.Configuration = {
        mode: mode,
        entry: {
            index: "./src/index.ts"
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js",
            publicPath: "./",
            chunkLoadingGlobal: "webpackJsonp"
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            configFile: "tsconfig.webpack.json"
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.css$/i,
                    use: [
                        "style-loader",
                        "css-loader"
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf)$/i,
                    use: [
                        {
                            loader: "file-loader"
                        }
                    ]
                }
            ]
        },
        devtool: (mode === "production" ? "nosources-" : "") + "source-map",
        resolve: {
            extensions: [
                /** Basic */
                ".json",
                ".js",
    
                /** Typescript Support */
                ".ts",
                ".tsx",
    
                /** Stylesheet */
                ".scss",
                ".sass",
                ".css",
    
                /** Assets */
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".svg",
                ".woff",
                ".woff2",
                ".eot",
                ".ttf"
            ],
            fallback: {
                buffer: require.resolve("buffer/"),
                events: require.resolve("events/"),
                stream: require.resolve("stream-browserify"),
                crypto: require.resolve("crypto-browserify"),
                constants: require.resolve("constants-browserify"),
                assert: require.resolve("assert/"),
                worker_threads: false,
                fs: false,
                perf_hooks: join(__dirname, "src/client/perf_hooks.ts"),
                path: require.resolve("path-browserify")
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
            }),
            new webpack.DefinePlugin({
                "process": "({\"browser\": null})",
                "webpack.mode": JSON.stringify(mode)
            }),
            new ForkTsCheckerWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: "VITCSwap",
                templateContent: ({htmlWebpackPlugin}) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="shortcut icon" href="./favicon.ico">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Overpass+Mono&family=Poppins:wght@600&display=swap" rel="stylesheet">
        <title>VITCSwap</title>
        ${htmlWebpackPlugin.tags.headTags}
    </head>
    <body>
        <div id="app-mount"></div>
        ${htmlWebpackPlugin.tags.bodyTags}
    </body>
</html>`,
                inject: false
            })
        ],
        target: "web",
        optimization: {
          splitChunks: {
            chunks: "all",
          }
        }
    }
    
    return config
}