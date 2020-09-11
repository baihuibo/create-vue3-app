Vue3 前端项目种子
===

相关项目资源，请看这里

- 点击这里查看YAPI
- 原型图
- 产品文档

如何开始？
---
clone 下载项目到本地 `/path/to/<project-name>`
```bash
$ cd <project-name>
$ npm install
$ npm run dev
```

访问 `http://localhost:3000/` 即可开始开发

构建生成环境代码
---
```bash
$ npm run build
```
即可产出生成环境代码在 `/dist` 目录中

本地 Mock 代理开发
---
打开 `vite.config.js` 编辑 `proxy` 即可指向接口代理服务
```js
module.exports = {
    proxy: {
        // yApi 接口代理
        // 将所有 /[template] 开始的接口，指向 mock 服务器
        '/[basename]': 'http://yapi.cbs.bacic5i5j.com/mock/20',
    }
}
```

测试环境 联调 模式
---

通过设置，可以将本地接口请求映射到测试环境，方便调试代码
> 此开发模式中，需使用`80`端口，如果有程序占用`80`端口，请先将它停止

 - 1 设置电脑 hosts `local.cbs.bacic5i5j.com 127.0.0.1`
 - 2 在项目根目录中命令行运行 `npm run proxy`
   > 通过参数可控制指向的测试环境如：`npm run proxy -- --env=dev` <br>
   > --env 是测试/生产环境的名称，可选有 dev、sit-cbs、uat、sut、beijing 等 <br/>
   > 此参数可忽略，默认指向 dev 环境
 - 3 登录到对应环境
   > 如 `--env=dev` 则需要登录到 `http://dev.cbs.bacic5i5j.com/base` <br>
   > 如 `--env=sit-cbs` 则需要登录到 `http://sit-cbs.cbs.bacic5i5j.com/base` <br>
 - 4 打开浏览器访问 `http://local.cbs.bacic5i5j.com/` 即可访问本地代码
   > 而所有接口请求都将根据`vite-proxy.config.js` 的配置映射到对应测试环境中
