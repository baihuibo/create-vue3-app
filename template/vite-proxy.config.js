const envArg = process.argv.slice(-1)[0] || '';
const env = envArg.startsWith('--env=') ? envArg.slice(6) : 'dev';
module.exports = {
    base: '/[basename]',
    sourcemap: true,
    proxy: {
        // 代理转发
        '/[basename]': {
            target: `http://${env}.cbs.bacic5i5j.com`,
            changeOrigin: true,
        },
        '/base': {
            target: `http://${env}.cbs.bacic5i5j.com`,
            changeOrigin: true,
        }
    }
}
