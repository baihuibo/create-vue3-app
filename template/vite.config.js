module.exports = {
    base: '/[basename]',
    sourcemap: true,
    proxy: {
        // yApi 接口代理
        // 将所有 /bdir 开始的接口，指向 mock 服务器
        // @see http://yapi.cbs.bacic5i5j.com/project/20/interface/api
        '/bdc': 'http://yapi.cbs.bacic5i5j.com/mock/20',
    }
}
