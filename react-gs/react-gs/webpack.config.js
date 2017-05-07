var webpack = require('webpack');
module.exports = {
    entry: './src/admin.jsx',
    output: {
        path: __dirname,
        filename: './public/js/admin.js'
    },
    module: {
        loaders: [
            {
                test:/\.jsx?$/,
                exclude:/node_modules/,//排除node-modules
                loader:'babel',
                query:{presets:['react','es2015']}
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
}