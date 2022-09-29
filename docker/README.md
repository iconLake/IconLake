# iconLake Docker

## 开发环境

- 启动全部服务：
`
docker compose -f docker-compose.dev.yml up --build
`

- 启动center服务：
`
docker compose -f docker-compose.dev.yml up center --build
`

- 启动service服务：
`
docker compose -f docker-compose.dev.yml up service --build
`

- 启动mongo服务：
`
docker compose -f docker-compose.dev.yml up mongo
`

## 测试环境

1. 配置service/config/test.json；
2. 设置service/security/certs目录下的证书，以便开启https，如果不想开启https，修改service/config/test.json里的https.port为0；
3. 执行启动命令：
`
docker compose -f docker-compose.test.yml up --build -d
`

## 生产环境

1. 配置service/config/production.json；
2. 设置service/security/certs目录下的证书，以便开启https；
3. 执行启动命令：
`
docker compose -f docker-compose.yml up --build -d
`

## 修改MongoDB用户名密码

### 修改数据管理员用户名密码
修改docker-compose.yml文件里的MONGO_INITDB_ROOT_USERNAME、MONGO_INITDB_ROOT_PASSWORD。

### 修改iconlake数据库用户名密码
1. 修改mongo-init.js文件里的user、pwd。
2. 修改center/config/production.json文件里的mongdb.uri。
3. 修改service/config/production.json文件里的mongdb.uri。

注：仅以production环境为例。
