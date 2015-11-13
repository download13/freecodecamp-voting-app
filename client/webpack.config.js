var path = require('path');


module.exports = {
    entry: __dirname + '/index.js',
    output: {
        path: __dirname + '/../public',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [
                        'syntax-object-rest-spread',
                        'transform-object-rest-spread'
                    ],
                    cacheDirectory: true
                }
            }
        ]
    }
};