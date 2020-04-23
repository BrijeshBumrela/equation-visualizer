const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "../src/main.js"),
    mode: "development",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "../dist"),
        publicPath: '/'
    },
    devServer: {
        // Shows error in the browser instead of just showing it in the console
        overlay: true,
        contentBase: "dist"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    "babel-loader"
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "MY Custom webpack generated HTML",
            template: path.join(__dirname, "../src/index.html")
        })
    ]
}