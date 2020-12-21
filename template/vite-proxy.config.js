const envArg = process.argv.slice(-1)[0] || '';
const env = envArg.startsWith('--env=') ? envArg.slice(6) : 'dev';

console.log('current env=' + env);
module.exports = {
    base: '/[basename]',
    sourcemap: true,
    proxy: {
        // 代理转发
        // 'bdc': {
        //     target: `http://${env}.cbs.bacic5i5j.com`,
        //     changeOrigin: true,
        // },
        '/base': {
            target: `http://${env}.cbs.bacic5i5j.com`,
            changeOrigin: true,
        }
    }
}
