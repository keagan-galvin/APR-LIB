const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const webpack = require('webpack');

const bundles = require('./webpack.bundles');

module.exports = {
    entry: bundles,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'scripts/'),
        publicPath: 'scripts/',
        libraryTarget: 'var',
        // `library` determines the name of the global variable
        library: '[name]'
    },    
    //devtool: 'inline-source-map', // Disable For Production
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {
                    loader: 'html-loader'
                }
            }
        ]
    },
    plugins: [
        new MinifyPlugin(), // Enable For Production
        new webpack.optimize.AggressiveMergingPlugin(), // Enable For Production
    ]
};