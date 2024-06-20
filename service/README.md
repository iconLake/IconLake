# iconLake Service

## 环境要求

1. nodejs >= 16
2. pnpm >= 7

## 开发

### 配置

修改`config/development.json`文件里的配置项。

### 安装

```shell
pnpm i
```

### 启动

```shell
pnpm run dev
```

## 部署

### 配置

修改`config/production.json`文件里的配置项。

### 安装

```shell
pnpm i -P
```

### 测试环境启动

```shell
pnpm run test
```

### 生产环境启动

```shell
pnpm run pro
```

## 注意事项

1. windows系统下无法启动服务，是因为pm2对esmodule支持得不太好导致的，解决方案：找到node_modules\pm2\lib\ProcessContainer.js:301，修改为“import(\`file://${process.env.pm_exec_path}\`);”。
