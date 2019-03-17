const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const webpack = require('webpack');

const bundles = require('./webpack.bundles');

module.exports = {
    entry: bundles,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build/'),
        publicPath: 'build/',
        libraryTarget: 'var',
        // `library` determines the name of the global variable
        library: '[name]'
    },    
    devtool: 'inline-source-map', // Disable For Production
    devServer: {
        contentBase: './',
    },
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
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        }
    },
    plugins: [
        //new MinifyPlugin(), // Enable For Production
        //new webpack.optimize.AggressiveMergingPlugin(), // Enable For Production,
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};