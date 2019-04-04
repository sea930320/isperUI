module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // target: 'http://39.107.122.234:8000',
                target: 'http://localhost:8000',
                ws: true,
                changeOrigin: true
            },
            '/media': {
                // target: 'http://39.107.122.234:8000',
                target: 'http://localhost:8000',
                changeOrigin: true
            }
        }
    }
}