var path = require('path'),
    paths = {
        context: path.join(__dirname, '..'),
        entry: path.join(__dirname, '..', 'src', 'index.js'),
        build: path.join(__dirname, '..', '..', 'build')
    };

module.exports = {
    context: paths.context,
    devtool: 'source-map',
    entry: [paths.entry],

    output: {
        filename: 'bundle.js',
        path: paths.build
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    }
};
