const path = require('path');

module.exports = {
    // publicPath: './', // 基本路径
    // outputDir: 'dist', // 输出文件目录
    // lintOnSave: false, // eslint-loader 是否在保存的时候检查
    // // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    // // webpack配置
    // // eslint-disable-next-line no-unused-vars
    // chainWebpack: (config) => {
    // },
    //     rules: [{
    //         test: /\.scss$/,
    //         use: [{
    //             loader: "style-loader" // 将 JS 字符串生成为 style 节点
    //         }, {
    //             loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
    //         }, {
    //             loader: "sass-loader" // 将 Sass 编译成 CSS
    //         }]
    //     }],
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
        } else {
            // 为开发环境修改配置...
            config.mode = 'development'
        }
        Object.assign(config, {
            // 开发生产共同配置
            resolve: {
                extensions: ['.js', '.vue', '.json'],
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@c': path.resolve(__dirname, './src/components'),
                    '@p': path.resolve(__dirname, './src/views'),
                    '@static': path.resolve(__dirname, './static'),
                } // 别名配置
            }
        })
    },
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    // css相关配置
    css: {
        extract: true, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false, // 开启 CSS source maps?
        loaderOptions: {
            css: {}, // 这里的选项会传递给 css-loader
            postcss: {},// 这里的选项会传递给 postcss-loader
            sass: {},  // 这里的选项会传递给 sass-loader
        }, // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
        modules: false // 启用 CSS modules for all css / pre-processor files.
    },
    // webpack-dev-server 相关配置
    devServer: {
        open: true,
        host: 'localhost', // 允许外部ip访问
        port: 10086, // 端口
        https: false, // 启用https
        overlay: {
            warnings: true,
            errors: true
        }, // 错误、警告在页面弹出
        proxy: {
            '/api': {
                target: 'http://api.avatardata.cn',
                changeOrigin: true, // 允许websockets跨域
                // ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        } // 代理转发配置，用于调试环境
    },
    // 第三方插件配置
    pluginOptions: {

    },
    // module:{
    //     rules: [{
    //         test: /\.scss$/,
    //         use: [{
    //             loader: "style-loader" // 将 JS 字符串生成为 style 节点
    //         }, {
    //             loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
    //         }, {
    //             loader: "sass-loader" // 将 Sass 编译成 CSS
    //         }]
    //     }],
    // },
}
