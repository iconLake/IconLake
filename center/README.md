# iconLake Center

## 介绍

iconLake中心服务，用于承载任务队列、调度、监控等。

## 警告

此服务为内部服务，仅可内网调用。

## 环境要求
1. nodejs >= 16
2. pnpm >= 7

## 开发

### 配置
修改`config/index.js`文件里的配置项。
### 安装
```
pnpm i
```
### 启动
```
pnpm run dev
```

## 部署

### 配置
修改`config/index.js`文件里的配置项。
### 安装
```
pnpm i -P
```
### 测试环境启动
```
pnpm run test
```
### 生产环境启动
```
pnpm run pro
```
