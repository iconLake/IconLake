# iconLake Service

## 开发

### 环境要求：
1. nodejs >= 16
2. pnpm >= 6

#### 安装
> pnpm i
#### 开发环境启动
> pnpm run dev
#### 测试环境启动
> pnpm run test
#### 生产环境启动
> pnpm run pro


### 框架问题

1. windows系统下无法启动service服务，是因为pm2对esmodule支持得不太好导致的，解决方案：找到node_modules\pm2\lib\ProcessContainer.js:301，修改为“import(`file://${process.env.pm_exec_path}`);”。
