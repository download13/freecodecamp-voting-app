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
                query: {
                    stage: 0,
                    plugins: [path.join(__dirname, 'babel-relay-plugin')]
                }
            }
        ]
    }
};