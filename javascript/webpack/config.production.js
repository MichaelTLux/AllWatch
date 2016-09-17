var defaultConfig = require('./config');
var webpack = require('webpack');

module.exports = Object.assign({}, defaultConfig, {
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});
