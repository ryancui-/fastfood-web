# 哪有饭友 Web 端

哪有饭友 Web 端，基于 Angular 4 + NG-ZORRO-ANTD 开发。

## Quick Start

- 安装依赖

```bash
$ npm i
```

- 从 `src/environments/environment.example.ts` 复制出 `environment.conf.ts` 并按需修改配置

```bash
$ cp src/environments/environment.example.ts src/environments/environment.conf.ts
```

- 本地开发，查看 localhost:4400

```bash
$ npm start
```

## Deployment

使用 Docker 进行部署，先安装依赖再进行 docker build

```bash
$ docker build -t fastfood-web .
```

