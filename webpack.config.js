const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({

    mode: argv.mode === 'production' ? 'production' : 'development',
    devtool: argv.mode === 'production' ? false : 'inline-source-map',

    entry: {
        ui: './src/code.js', 
        code: './src/code.ts',
        styles: './src/ui.css',
    },

    module: {
        rules: [
            {
                test: /\.ts$/, 
                exclude: /node_modules/, 
                use: 'ts-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/, 
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    
    output: {
        filename: (pathData) => {
            return pathData.chunk.name === 'code'
            ? 'code.js'
            : '[name].js';
        },
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    plugins: [
        new webpack.DefinePlugin({
          global: {},
        }),
        new HtmlWebpackPlugin({
          inject: 'body',
          template: './src/ui.html',
          filename: 'ui.html',
          chunks: ['ui', 'styles'],
        }),
        new HtmlInlineScriptPlugin({
            htmlMatchPattern: [/ui.html/],
            scriptMatchPattern: [/.js$/],
        }),
      ],
});