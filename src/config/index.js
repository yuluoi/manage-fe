// 环境配置封装 是否开发环境 接口是否mock

// 获取环境变量
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/28e72f10b2a3d3fa5ad0756a4e1d7ecf/api'
    },
    test: {
        baseApi: '//test.futurefe.com/api',
        mockApi: 'https://www.fastmock.site/mock/28e72f10b2a3d3fa5ad0756a4e1d7ecf/api'
    },
    prod: {
        baseApi: '//futurefe.com/api',
        mockApi: 'https://www.fastmock.site/mock/28e72f10b2a3d3fa5ad0756a4e1d7ecf/api'
    }
}

export default {
    env,
    mock: false,
    // 接口调用地址
    namespace: 'manager',
    ...EnvConfig[env]
}