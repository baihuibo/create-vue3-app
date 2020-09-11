module.exports = {
    base: '/[basename]',
    sourcemap: true,
    proxy: {
        // 开发 yapi 接口代理
        // 将所有 /bdc 开始的接口，指向 mock 服务器

        '/[basename]': 'http://yapi.cbs.bacic5i5j.com/',
    }
}
