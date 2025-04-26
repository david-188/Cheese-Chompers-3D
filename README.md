# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```


## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
|   |--games
|      |___2-3-4-player-games.png # 游戏图片
|   |--comments
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
|       content/
│       └── games/
│           └── 2-3-4-player-games.md // 
├── comments-api/
│   └── src/
│       └── comments.ts // 评论功能
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


## 修改必读

### 游戏数据存放
/src/content/games


游戏数据结构在markdown头部

```md

---
slug: '2-3-4-player-games' // 游戏页面地址
isHot: true // 是否热门
title: '2-3-4 Player Games' // 游戏标题
description: 'Play 2-3-4 Player Games on your browser for free. No download required. Play now!' // 游戏描述
pubDate: 'Feb 11 2025' // 发布时间
heroImage: '/games/2-3-4-player-games.jpg' // 游戏图片
category: 'car' // 游戏分类
embed: 'https://www.twoplayergames.org/embed/2-3-4-player-games' // Iframe嵌入地址
tags: ["car game"]
---

```

## 分类数据存放
/src/content/categories

## 游戏图片存放
/public/games


### 二次开发:
修改`astro.config.mjs`

```js
// https://astro.build/config
export default defineConfig({
  site: 'https://domain.com', // 你的域名

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), icon(), sitemap()],
});
```


### 评论功能所需要配置,以及如何发布服务,如果不需要评论功能,可以直接注释掉评论组件`src/components/Comments.astro`
> 注意评论功能需要发布之后再线上测试,本地测试有不同的协议,会导致跨域问题
1. 登录cloudflare
```shell
npx wrangler login
```
2. 创建数据库

```shell
npx wrangler d1 create comments-db
```

3. 初始化db

```shell
npx wrangler d1 execute comments-db --remote --command "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, content_id TEXT, content TEXT, created_at TEXT)"
```
4. 部署workers(API)
```shell
cd comments-api

npm install

wrangler deploy src/index.ts --name comments-api
```



3. 修改代码中的配置 `src/components/Comments.astro`
查找`const workerUrl = 'https://worker.domain.com';`








## 部署到 Cloudflare Pages

```bash
npx wrangler login

#打包
npm run build

npx wrangler pages deploy dist
```
