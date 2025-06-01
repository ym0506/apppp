const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
            chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
            publicPath: '/',
            clean: true  // 이전 빌드 파일 정리
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            cacheDirectory: true  // 빌드 성능 향상
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[hash][ext]'
                    }
                }
            ]
        },
        devServer: {
            historyApiFallback: true,
            port: process.env.PORT || 3000,
            host: '0.0.0.0',
            allowedHosts: 'all',
            open: false,  // Railway에서는 자동 오픈 비활성화
            hot: true,
            compress: true,  // gzip 압축
            client: {
                logging: 'info',
                overlay: true,
                progress: true
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                } : false
            })
        ],
        optimization: isProduction ? {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    }
                }
            }
        } : undefined,
        devtool: isProduction ? 'source-map' : 'eval-source-map'
    };
}; 