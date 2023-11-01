---
title: hexo + github搭建个人博客
abbrlink: 95eb7d
date: 2022-08-27 11:16:53
tags:
  - 博客搭建
  - 博客美化
keywords:
description: 本篇教程完整讲述了如何利用Hexo+github搭建个人博客并且绑定自己的域名，生成自己的网站！ 
password:
abstract:
message:
---

# Hexo+github搭建个人博客，并绑定域名

> 搭建&美化：http://haiyong.site/post/cda958f2.html 

注：本文章内容大部分来源(包括视频)来自：[www.wushishu.xyz ](www.wushishu.xyz)备用[wushishu.github.io](wushishu.github.io)

# 第一部分视频学习

<iframe src="https://player.bilibili.com/player.html?aid=638754315&amp;bvid=BV1NY4y1C7Ng&amp;cid=714430663&amp;page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="800" height="500" style="box-sizing: border-box; --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246 / 0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; margin: 0px 0px 20px; color: rgb(76, 73, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Lato, Roboto, &quot;PingFang SC&quot;, &quot;Microsoft YaHei&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>

也可以直接跟着视频走

## 安装并配置Node.js

Node.js下载:【它让JavaScript成为与PHP、Python、Perl、Ruby等服务端语言平起平坐的脚本语言。】

教程：https://blog.csdn.net/weixin_52799373/article/details/123840137（过程详细，还覆盖win11，评论下面还有师叔的足迹）

#### 注意一

全局安装最常用的 express 模块 进行测试

命令如下:

```PLAINTEXT
npm install express -g
```

报错图片：

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311330969.png" alt="img" style="zoom:50%;" />

解决方法：

【亲测有效】

需要删除 npmrc 文件。

**强调：**不是nodejs安装目录npm模块下的那个npmrc文件

而是在 C:\Users\（你的用户名）\下的.npmrc文件

***聪明的你，一定想到了直接用evering搜索，省的还要调用文件管理器在一点一点的找***

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331077.png" alt="img" style="zoom:50%;" />

#### 注意二

**在文章第四歩测试上查看安装结果**

可能会出现下面照片结果，更改了目录为什么还是C盘目录下，这时候只需要以管理员身份运行命令即可。

在下面路径下找到cmd.exe并且管理员身份运行即可。

推测：出像这种现象的原因就是执行权限不够，推荐大家在桌面建立一个快捷方式（管理员命令的）cmd

```PLAINTEXT
C:\Windows\System32\cmd.exe
```

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331718.png" alt="img" style="zoom:50%;" />

**创建管理员权限的cmd桌面快捷方式**

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331004.png" alt="img" style="zoom:50%;" />

## 安装并配置Git

git是一个并源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理

Windows系统Git安装教程：https://www.cnblogs.com/xueweisuoyong/p/11914045.html

### 生成SSH Keys

生成ssh

```PLAINTEXT
ssh-keygen -t rsa -C "你的邮箱地址"
```

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331566.png" alt="img" style="zoom:50%;" />

**找到秘钥位置并复制**

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331246.png" alt="img" style="zoom:500%;" />

**测试ssh是否绑定成功**

```PLAINTEXT
ssh -T git@github.com
```

如果问你（yes or no）,直接 yes 就可以得到下面这段话

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331532.png" alt="img" style="zoom:50%;" />

## 本地访问博客

1、创建一个名为 Blog 的文件，在里面启用 Git Bash Here

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331193.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/b0/b06a27bee58606277ea46f413b34ed14.png)

2、初始化hexo

```PLAINTEXT
hexo init
```

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311331023.png" alt="img" style="zoom:50%;" />

3、生成本地的hexo页面

```PLAINTEXT
hexo s
```

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332717.png" alt="img" style="zoom:50%;" />

4、访问

打开本地服务器

```PLAINTEXT
http://localhost:4000/
```

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332849.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/5f/5fde531819308103720a5c098f342092.png)

> 长按 Ctrl + c 关闭服务器

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332255.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/6f/6f77175cb6028832126b38d0b820be95.png)

## 上传到Github

修改_config.yml文件

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332108.png" alt="img" style="zoom:50%;" />

**把图片上位置更换成**

```PLAINTEXT
deploy:
  type: git
  repository: 你的github地址
  branch: main
```

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332828.png" alt="img" style="zoom:50%;" />

安装hexo-deployer-git 自动部署发布工具

```PLAINTEXT
npm install hexo-deployer-git --save
```

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332467.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/a9/a94aa787c8627d7bc2d95fc3aabe211d.png)

### **生成页面**

```PLAINTEXT
hexo g
```

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332692.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/ec/ec4dc5e76906c62036e61f4d083ebaad.png)

#### 注意一

如果报错如下：（无报错，请忽略此条）

报错信息是提示hexo的yml配置文件 冒号后面少了空格解决方案：

到提示行将对应的空格补上即可

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332399.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/f1/f139b76ed562b895ece7557ebb5bb791.png)

本地文件上传到Github上面

```PLAINTEXT
hexo d
```

中间会出现一个登录界面，可以用令牌登录。（令牌及时保存，就看不到了）

结束以后就上传 Github 就成功了！！！

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332663.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/1b/1ba83adbf958f9ed0ad0129bd843f785.png)

#### 注意二

如果出现如图错误网络报错，再次尝试，多次尝试，直到更换WiFi~~~~

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332772.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/5e/5e33beb4a80df251722f550b7ca0de88.png)

## 访问GitHub博客

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332428.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/0a/0a397f64a129a210ccbebdff832de7af.png)

访问博客，开始的页面是初始化页面，没有做美化和增加内容。

```PLAINTEXT
https://wushishu.github.io/
```

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332934.png" alt="img" style="zoom: 50%;" />](https://static001.geekbang.org/infoq/aa/aa2f760148fbcbf6c3ce0b43cbe3433c.png)

# 第二部分 文档学习

## 撰写博客

***电脑要必须有Typora！电脑要必须有Typora！电脑要必须有Typora！***（重要的事情说三遍）

文本教程：https://dhndzwxj.vercel.app/3276806131.html

hexo标签教程：[http://haiyong.site/post/cda958f2.html](http://haiyong.site/post/cda958f2.html)（参考文档看需求加不加）

我们打开自己的博客根目录，跟着我一个个了解里面的这些文件（夹）都是干什么的：

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332992.png" alt="img" style="zoom:50%;" />

- `_config.yml`：俗称站点配置文件，很多与博客网站的格式、内容相关的设置都需要在里面改。
- `node_modules`:存储Hexo插件的文件，可以实现各种扩展功能。一般不需要管。
- `package.json`：别问我，我也不知道干嘛的。
- `scaffolds`：模板文件夹，里面的`post.md`文件可以设置每一篇博客的模板。具体用起来就知道能干嘛了。
- `source`：非常重要。所有的个人文件都在里面！
- `themes`：主题文件夹，可以从[Hexo主题官网](https://hexo.io/themes/)或者网上大神的Github主页下载各种各样美观的主题，让自己的网站变得逼格高端的关键！

接下来重点介绍`source`文件夹。新建的博客中，`source`文件夹下默认只有一个子文件夹——`_posts`。我们写的博客都放在这个子文件夹里面。我们还可以在`source`里面新建各种子文件夹满足自己的个性化需求，对初学者而言，我们先把精力放在主线任务上，然后再来搞这些细节。

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311332045.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/3f/3f7b8b410726691082019f2ab603976b.png)

写好Hellworld内容后，在命令行一键三连：

> ‘hexo cl’命令用于清除缓存文件（db.json）和已生成的静态文件（public）。
>
> 例如：在更换主题后，如果发现站点更改不生效，可以运行该命令。

```PLAINTEXT
hexo cl

hexo g

hexo s
```

然后随便打开一个浏览器，在网址栏输入`localhost:4000/`，就能发现自己的网站更新了！不过这只是在本地进行了更新，要想部署到网上（Github上），输入如下代码：

```PLAINTEXT
hexo d
```

然后在浏览器地址栏输入`https://yourname.github.io`，或者`yourname.github.io`就能在网上浏览自己的博客了！

以上，我们的博客网站1.0版本就搭建完成了，如果没有更多的需求，做到这里基本上就可以了。如果有更多的要求，还需要进一步的精耕细作！

## 精耕细作

**海拥\Butterfly 主题美化：**http://haiyong.site/post/22e1d5da.html

**Butterfly参考文档（小白慎入，但是他也是你走向DIY必须迈出的一歩）**:https://butterfly.js.org/posts/dc584b87/#Post-Front-matter

文章中要更改的文件（.yml .bug 等）可以要用viscode打开！！！

**Butterfly 主题安装**

```PLAINTEXT
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

这里面如果报错，如下图所示（长路漫漫，bug满满）

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311333567.png" alt="img" style="zoom:50%;" />

只需要在命令行中执行

```PLAINTEXT
git config --global --unset http.proxy 
git config --global --unset https.proxy
```

再次安装主题即可成功

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311333116.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/a1/a1ee42ae917eb1c19261ec72b82efde4.png)

**应用主题**

```PLAINTEXT
theme: butterfly
```

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311333759.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/b0/b08a6de31ecdfcc74ccb0037f23094b3.png)

**安装插件**

如果你没有 pug 以及 stylus 的渲染器，请下载安装：

```PLAINTEXT
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311333574.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/cd/cded5198aec31fec9f8b53bb76676174.png)

### Butterfly 主题

生成文章唯一链接

Hexo的默认文章链接格式是年，月，日，标题这种格式来生成的。如果你的标题是中文的话，那你的URL链接就会包含中文，

复制后的URL路径就是把中文变成了一大堆字符串编码，如果你在其他地方用这边文章的url链接，偶然你又修改了改文章的标题，那这个URL链接就会失效。为了给每一篇文章来上一个属于自己的链接，写下此教程，利用 hexo-abbrlink 插件，A Hexo plugin to generate static post link based on post titles ,来解决这个问题。 参考github官方： hexo-abbrlink 按照此教程配置完之后如下：

1、安装插件，在博客根目录 [Blogroot] 下打开终端，运行以下指令：

```PLAINTEXT
npm install hexo-abbrlink --save
```

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311333642.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/32/32ad907f045425afedb968d20dab4507.png)

2、插件安装成功后，在根目录 Blogroot(你的博客目录)的配置文件 _config.yml 找到 permalink：

[<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311334031.png" alt="img" style="zoom:50%;" />](https://static001.geekbang.org/infoq/7e/7e4272e54cb25564b1e708e85c8539d2.png)

## 发布博客

这次了解我上面只有一个HelloWord的时候，为什么不让右键新建，**因为需要命令生成啊，铁汁！**

```PLAINTEXT
npm i hexo-deployer-git

hexo new post "新建博客文章名"

hexo cl && hexo g  && hexo s
```

## hexo更换背景图片

背景图片参考网址：

- https://wallhaven.cc/
- https://wall.alphacoders.com/
- https://bz.zzzmh.cn/index

*本方法解决的是多次同步到GitHub上背景图片未成功的情况*

直接更改原文件

图片所在目录：`hexo/themes/landscape/source/css/images/`

图片名称：`banner.jpg`



## ⭐主题美化

芜湖，想做到和我主页一样的动态标题(网页崩溃欺骗)和透明页面吗

Let's get started!

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/image-20231101154515640.png" style="zoom:80%;" />

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/image-20231101155107655.png" alt="path" style="zoom:80%;" />

一定要放在博客根目录下的source下，没有就新建一个

然后在\themes\butterfly\中的_config.yml文件下查找injection，将自己新建的文件路径添加进去

```yaml
# Inject
# Insert the code to head (before '</head>' tag) and the bottom (before '</body>' tag)
# 插入代码到头部 </head> 之前 和 底部 </body> 之前
inject:
  head:
    - <link rel="stylesheet" href="/css/transpancy.css">
    # - <link rel="stylesheet" href="/xxx.css">
  bottom:
    - <script src="/js/cheat.js"></script>
    # - <script src="xxxx"></script>
```

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/image-20231101154311035.png" alt="image-20231101154311035" style="zoom:80%;" />

### 动态标题

`cheat.js`的代码

```js
//动态标题
var OriginTitile = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        //离开当前页面时标签显示内容
        document.title = '网页崩溃啦w(ﾟДﾟ)w ！';
        clearTimeout(titleTime);
    }
    else {
        //返回当前页面时标签显示内容
        document.title = '♪(^∇^*)我又好啦！' + OriginTitile;
        //两秒后变回正常标题
        titleTime = setTimeout(function () {
            document.title = OriginTitile;
        }, 2000);
    }
});
```

### 透明页面

`transpancy.css`的代码：

```css
/* 文章页背景 */
.layout_post>#post {
    /* 以下代表透明度为0.7 可以自行修改*/
    background: rgba(255,255,255,.7);
}
 
/* 所有页面背景 */
#aside_content .card-widget, #recent-posts>.recent-post-item, .layout_page>div:first-child:not(.recent-posts), .layout_post>#page, .layout_post>#post, .read-mode .layout_post>#post{
    /* 以下代表透明度为0.7 */
    background: rgba(255,255,255,.7);
}
/*侧边卡片的透明度 */
:root {
  --card-bg: rgba(255, 255, 255, .7);
}
/* 页脚透明 */
#footer {
    /* 以下代表透明度为0.5 */
    background: rgba(255,255,255, .5);
}
```

`注意一件事：css要放在head；js要放在bottom。不能乱放！`

参考：[透明化](https://conzxy.github.io/2022/08/19/hexo/transparent_bg/)    [透明化](https://blog.csdn.net/qq_44138925/article/details/128843200)    [渐变](https://blog.csdn.net/qq_43740362/article/details/113790851?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-113790851-blog-128843200.235%5Ev38%5Epc_relevant_sort_base1&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-113790851-blog-128843200.235%5Ev38%5Epc_relevant_sort_base1&utm_relevant_index=5)



# 第三部分 绑定自己的域名

博客地址：https://www.likecs.com/show-30474.html

**绑定之后你就有有一个自己专属的博客了。**

买一个域名，可以一块钱白嫖，但是续费贵的飞天！！！

***注意请谨慎绑定，想我就会出现提交一次 (hexo d) ,需要重新绑定域名***



# 图床：

我试了两种：GitHub和七牛云

我想说，如果你有自己的域名。可以选择七牛云，相比GitHub来说快很多



<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311350299.png" alt="image-20231031135024267" style="zoom: 67%;" />



<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311352581.png" alt="image-20231031135228551" style="zoom: 67%;" />

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311353997.png" alt="image-20231031135328962" style="zoom: 67%;" />



<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311354876.png" alt="image-20231031135414847" style="zoom:67%;" />

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311401584.png" alt="image-20231031140102545" style="zoom:67%;" />

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311404397.png" alt="image-20231031140446365" style="zoom:67%;" />

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311409077.png" alt="image-20231031140957036" style="zoom:67%;" />

进行到这一步就成功喽

下一步，去PicGo设置：

<img src="http://qiniu.hanvon.top/blog_article/Blog_building/202310311408731.png" alt="image-20231031140821695" style="zoom:67%;" />



https://www.cnblogs.com/skuld-yi/p/14533794.html



---大部分转载至 武师叔

关注公众号武师叔————————–回复博客————————-即可获得博客PDF文件
