const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:{
        'js/app':['./src/App.jsx'],
    },
    output:{
        path:path.resolve(__dirname,'dist/'),
        publicPath:'/'
    },
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                use:['babel-loader'],
                exclude:/node_modules/,
            },
            {
                test:/\.png$/,
                use:['url-loader']
            },
        ],
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename:'index.html'
        })
    ]
}