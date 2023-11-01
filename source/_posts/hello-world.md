---
title: Hello World
abbrlink: 16107
date: 2022-08-26 16:07:23
tags:
  - 博客搭建
cover: http://qiniu.hanvon.top/blog_cover/helloworld_cover.png
copyright_author: wild-civil
copyright_author_href: https://github.com/wild-civil
copyright_url: https://wild-civil.github.io
copyright_info: 此文章版权归wild-civil所有，如有转载，请注明来自原作者
---
# Hexo+github搭建个人博客

## 一、搭建

### 1、视频教程：

### 2、简易文本教程：

- #### 安装并配置Node.js

- #### 安装并配置Git

- #### 生成SSH Keys 

  a. 空白处右击，打开Git Bash，输入`ssh-keygen -t rsa -C "你的邮箱地址"` (将邮箱改为自己的) 敲四次回车；

  b. 在`C:\Users\admin\.ssh`(admin更改为你自己的用户名)，找到”`id_rsa.pub`”文件，打开，复制秘钥

  c. 打开”Github” -> “seetings” -> “SSH and Gpg Keys” -> 点击”New SSH key”, -> Title随便，将密匙复制到key -> Add SSH key

  d. 在Git Bash中输入`ssh -T git@github.com` (无需更改) 测试ssh是否绑定成功, 输入 yes 回车

- #### 本地访问博客

  1、创建一个名为 Blog 的文件，在里面启用 Git Bash Here

  2、输入hexo init初始化hexo

  3、输入hexo s生成本地的hexo页面

  4、将网址输入浏览器即可访问博客，Ctrl + c停用

- #### 上到Github 

修改-config.yml文件，在文件最后添加：(注意冒号后需添加一个半角的空格)

```
deploy:
  type: git
  repository: 你的github地址
  branch: main
```

启用 Git Bash Here，输入`npm install hexo-deployer-git --save`安装hexo-deployer-git 自动部署发布工具

输入`hexo g`生成页面

输入`hexo d`本地文件部署到Github上面

在浏览器中输入https://wild-civil.github.io/访问GitHub博客 (请将wild-civil改为自己的github用户名)

文本教程：https://dhndzwxj.vercel.app/3276806131.html

hexo标签教程：http://haiyong.site/post/cda958f2.html (很棒的教程)

自定义 js、css等的添加：http://www.gocit.cn/posts/5.html

https://www.wxnacy.com/2017/12/12/hexo-cust-js/

## 二、Quick Start

#### Create a new post

```
$ hexo new "My New Post"
```

也可输入`hexo n`

More info: Writing

### Run server

```
$ hexo server
```

也可输入`hexo s`

More info: Server

### Generate static files

```
$ hexo generate
```

也可输入`hexo g`

More info: Generating

### Deploy to remote sites

```
$ hexo deploy
```

也可输入`hexo d`

More info: Deployment

hexo更换背景图片 背景图片参考网址：

https://wallhaven.cc/ https://wall.alphacoders.com/ https://bz.zzzmh.cn/index

