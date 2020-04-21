var path = require('path');
var webpack = require('webpack');
var miniCSSExtractPlugIn = require('mini-css-extract-plugin');
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var CopyPlugin = require('copy-webpack-plugin');

module.exports = function (env) {
    env = env || {};
    var isProd = env.NODE_ENV == 'production';

    var config = {
        mode: isProd ? 'production' : 'development',
        entry: {
            main: './wwwroot/js/main',
            site: './wwwroot/scss/site.scss'
        },
        output: {
            path: path.join(__dirname, 'wwwroot/dist'),
            filename: '[name].js'
        },
        devtool: 'eval-source-map',
        resolve: {
            extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
        },
        plugins: [
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
            new FixStyleOnlyEntriesPlugin(),
            new miniCSSExtractPlugIn({
                filename: !isProd ? '../css/[name].css' : '../css/[name].[hash].css',
                chunkFilename: !isProd ? '../css/[id].css' : '../css/[id].[hash].css'
            }),
            new CopyPlugin([
                { from: './node_modules/jquery/dist/jquery.min.js', to: '../lib/jquery/js' },
                { from: './node_modules/jquery-ajax-unobtrusive/dist/jquery.unobtrusive-ajax.min.js', to: '../lib/jquery/js' },
                { from: './node_modules/bootstrap/dist/css/bootstrap.min.css', to: '../lib/bootstrap/css' },
                { from: './node_modules/bootstrap/dist/css/bootstrap.min.css.map', to: '../lib/bootstrap/css' },
                { from: './node_modules/bootstrap/dist/js/bootstrap.min.js', to: '../lib/bootstrap/js' },
                { from: './node_modules/@fortawesome/fontawesome-free/css/all.css', to: '../lib/fortawesome/css' },
                { from: './node_modules/@fortawesome/fontawesome-free/js/all.js', to: '../lib/fortawesome/js' },
                { from: './node_modules/@progress/kendo-theme-bootstrap/dist/all.css', to: '../lib/progress/css' },
                { from: './node_modules/@progress/kendo-ui/js/kendo.all.min.js', to: '../lib/progress/js' },
                { from: './node_modules/@progress/kendo-ui/js/kendo.aspnetmvc.min.js', to: '../lib/progress/js' }
            ]),
        ],
        module: {
            rules: [
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        miniCSSExtractPlugIn.loader,
                        { loader: 'css-loader', options: { url: false, sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ],
                },
                { test: /\.css?$/, use: ['style-loader', 'css-loader'] },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
                {
                    test: require.resolve('jquery'),
                    use: [
                        { loader: 'expose-loader', options: 'jQuery' },
                        { loader: 'expose-loader', options: '$' }
                    ]
                }
            ]
        }
    }

    // Alter config for prod environment
    if (isProd) {
        config.devtool = 'source-map';
        config.plugins = config.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            })
        ]);
    }

    return config;
}