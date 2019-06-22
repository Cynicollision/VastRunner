const env = (process.env.NODE_ENV || 'development');
const path = require('path');

module.exports = {
    devtool: env === 'development' ? 'inline-source-map' : false,
    entry: './src/demo/game.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
};