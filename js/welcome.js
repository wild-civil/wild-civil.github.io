fetch('https://api.qjqq.cn/api/Local')
    .then(response => response.json())
    .then(data => {
        ipLocation = data;
        showWelcome();
    })
    .catch(error => console.error('Error:', error));


function getDistance(e1, n1, e2, n2) {
    const R = 6371;
    const { sin, cos, asin, PI, hypot } = Math;
    let getPoint = (e, n) => {
        e *= PI / 180;
        n *= PI / 180;
        return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) };
    };

    let a = getPoint(e1, n1);
    let b = getPoint(e2, n2);
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    let r = asin(c / 2) * 2 * R;
    return Math.round(r);
}

function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase();  //取得浏览器的agent字符串

    var browser='unknown';

    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;

    //IE
    if (agent.indexOf("msie") > 0) {
        return agent.match(regStr_ie);
    }

    //firefox
    else if (agent.indexOf("firefox") > 0) {
        return agent.match(regStr_ff);
    }

    //Chrome
    else if (agent.indexOf("chrome") > 0) {
        return agent.match(regStr_chrome);
    }

    //Safari
    else if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        return agent.match(regStr_saf);
    }
    else
        return "我也不道啊";
}

function showWelcome() {

    let dist = getDistance(108.947063, 34.259456, ipLocation.data.lng, ipLocation.data.lat); //修改自己的经度（121.413921）纬度（31.089290）  //钟楼108.947063,34.259456  //432 108.768708,34.029036
    let pos = ipLocation.data.country;
    let ip = ipLocation.ip;
    let posdesc;

    // 以下的代码需要根据新API返回的结果进行相应的调整
    switch (ipLocation.data.country) {
        case "日本":
            posdesc = "よろしく，一起去看樱花吗";
            break;
        case "美国":
            posdesc = "Let us live in peace!";
            break;
        case "英国":
            posdesc = "想同你一起夜乘伦敦眼";
            break;
        case "俄罗斯":
            posdesc = "干了这瓶伏特加！";
            break;
        case "法国":
            posdesc = "C'est La Vie";
            break;
        case "德国":
            posdesc = "Die Zeit verging im Fluge.";
            break;
        case "澳大利亚":
            posdesc = "一起去大堡礁吧！";
            break;
        case "加拿大":
            posdesc = "拾起一片枫叶赠予你🍂";
            break;
        case "中国":
            pos = ipLocation.data.prov + " " + ipLocation.data.city + " " + ipLocation.data.district;
            switch (ipLocation.data.prov) {
                case "北京市":
                case "北京":
                    posdesc = "北——京——欢迎你~~~";
                    break;
                case "天津市":
                case "天津":
                    posdesc = "讲段相声吧";
                    break;
                case "河北省":
                case "河北":
                    posdesc = "山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山";
                    break;
                case "山西省":
                case "山西":
                    posdesc = "展开坐具长三尺，已占山河五百余";
                    break;
                case "内蒙古自治区":
                    posdesc = "天苍苍，野茫茫，风吹草低见牛羊";
                    break;
                case "辽宁省":
                case "辽宁":
                    posdesc = "我想吃烤鸡架！";
                    break;
                case "吉林省":
                case "吉林":
                    posdesc = "状元阁就是东北烧烤之王";
                    break;
                case "黑龙江省":
                case "黑龙江":
                    posdesc = "很喜欢哈尔滨大剧院";
                    break;
                case "上海市":
                case "上海":
                    posdesc = "众所周知，中国只有两个城市";
                    break;
                case "江苏省":
                case "江苏":
                    switch (ipLocation.data.city) {
                        case "南京市":
                        case "南京":
                            posdesc = "这是我挺想去的城市啦";
                            break;
                        case "苏州市":
                        case "苏州":
                            posdesc = "上有天堂，下有苏杭";
                            break;
                        default:
                            posdesc = "散装是必须要散装的";
                            break;
                    }
                    break;
                case "浙江省":
                case "浙江":
                    posdesc = "东风渐绿西湖柳，雁已还人未南归";
                    break;
                case "河南省":
                case "河南":
                    switch (ipLocation.data.city) {
                        case "郑州市":
                        case "郑州":
                            posdesc = "豫州之域，天地之中";
                            break;
                        case "南阳市":
                        case "南阳":
                            posdesc = "臣本布衣，躬耕于南阳此南阳非彼南阳！";
                            break;
                        case "驻马店市":
                        case "驻马店":
                            posdesc = "峰峰有奇石，石石挟仙气嵖岈山的花很美哦！";
                            break;
                        case "开封市":
                        case "开封":
                            posdesc = "刚正不阿包青天";
                            break;
                        case "洛阳市":
                        case "洛阳":
                            posdesc = "洛阳牡丹甲天下";
                            break;
                        default:
                            posdesc = "可否带我品尝河南烩面啦？";
                            break;
                    }
                    break;
                case "安徽省":
                case "安徽":
                    posdesc = "蚌埠住了，芜湖起飞";
                    break;
                case "福建省":
                case "福建":
                    posdesc = "井邑白云间，岩城远带山";
                    break;
                case "江西省":
                case "江西":
                    posdesc = "落霞与孤鹜齐飞，秋水共长天一色";
                    break;
                case "山东省":
                case "山东":
                    posdesc = "遥望齐州九点烟，一泓海水杯中泻";
                    break;
                case "湖北省":
                case "湖北":
                    switch (ipLocation.data.city) {
                        case "黄冈市":
                        case "黄冈":
                            posdesc = "红安将军县！辈出将才！";
                            break;
                        default:
                            posdesc = "来碗热干面~";
                            break;
                    }
                    break;
                case "湖南省":
                case "湖南":
                    posdesc = "74751，长沙斯塔克";
                    break;
                case "广东省":
                case "广东":
                    switch (ipLocation.data.city) {
                        case "广州市":
                            posdesc = "看小蛮腰，喝早茶";
                            break;
                        case "深圳市":
                        case "深圳":
                            posdesc = "今天你打工了嘛";
                            break;
                        case "阳江市":
                            posdesc = "阳春合水！博主家乡~ 欢迎来玩~";
                            break;
                        default:
                            posdesc = "来两斤福建人~";
                            break;
                    }
                    break;
                case "广西壮族自治区":
                    posdesc = "桂林山水甲天下";
                    break;
                case "海南省":
                case "海南":
                    posdesc = "朝观日出逐白浪，夕看云起收霞光";
                    break;
                case "四川省":
                    posdesc = "康康川妹子";
                    break;
                case "贵州省":
                case "贵州":
                    posdesc = "茅台，学生，再塞200";
                    break;
                case "云南省":
                case "云南":
                    posdesc = "玉龙飞舞云缠绕，万仞冰川直耸天";
                    break;
                case "西藏自治区":
                    posdesc = "躺在茫茫草原上，仰望蓝天";
                    break;
                case "陕西省":
                case "陕西":
                    posdesc = "来份臊子面肉加馍🍜";
                    break;
                case "甘肃省":
                    posdesc = "羌笛何须怨杨柳，春风不度玉门关";
                    break;
                case "青海省":
                    posdesc = "牛肉干和老酸奶都好好吃";
                    break;
                case "宁夏回族自治区":
                    posdesc = "大漠孤烟直，长河落日圆";
                    break;
                case "新疆维吾尔自治区":
                    posdesc = "驼铃古道丝绸路，胡马犹闻唐汉风";
                    break;
                case "台湾省":
                case "台湾":
                    posdesc = "我在这头，大陆在那头";
                    break;
                case "香港特别行政区":
                case "香港":
                    posdesc = "永定贼有残留地鬼嚎，迎击光非岁玉";
                    break;
                case "澳门特别行政区":
                case "澳门":
                    posdesc = "性感荷官，在线发牌";
                    break;
                default:
                    posdesc = "带我去你的城市逛逛吧！";
                    break;
            }
            break;
        default:
            posdesc = "带我去你的国家逛逛吧";
            break;
    }

    //根据本地时间切换欢迎语
    let timeChange;
    let date = new Date();
    if (date.getHours() >= 5 && date.getHours() < 7) timeChange = "<span>🌤️ 早上好，一日之计在于晨</span>";
    else if (date.getHours() >= 7 && date.getHours() < 8) timeChange = "<span>🧑‍🍳 吃早饭了吗</span>";
    else if (date.getHours() >= 9 && date.getHours() < 11) timeChange = "<span>🌤️ 早上好，一日之计在于晨！</span>";
    else if (date.getHours() >= 11 && date.getHours() < 12) timeChange = "<span>😋 干饭人，干饭魂！</span>";
    else if (date.getHours() >= 12 && date.getHours() < 14) timeChange = "<span>☀️ 中午好，记得午休喔~</span>";
    else if (date.getHours() >= 14 && date.getHours() < 17) timeChange = "<span>🕞 下午好，饮茶先啦！</span>";
    else if (date.getHours() >= 17 && date.getHours() < 18) timeChange = "<span>🚶‍♂️ 即将下班，记得按时吃饭</span>";
    else if (date.getHours() >= 18 && date.getHours() < 19) timeChange = "<span>🍚 吃晚饭了吗？晚饭得吃啊！</span>";
    else if (date.getHours() >= 19 && date.getHours() < 23) timeChange = "<span>🌙 晚上好，夜生活嗨起来！</span>";
    else timeChange = "夜深了，早点休息，少熬夜";
    
    if (ipLocation.data.country == "") {
        pos = "未知地带";
        // dist = "未知";
    }

    let distanceInfo;
    if (ipLocation.data.city.includes("西安")) {
        distanceInfo = "好巧，我们在同一个城市";
    } else {
        distanceInfo = `当前位置距博主约 <b><span style="color: var(--kouseki-ip-color)">${dist}</span></b> 公里！`;
    }


    try {
        //自定义文本和需要放的位置
        document.getElementById("welcome-info").innerHTML =
            `欢迎来自 <b><span style="color: var(--kouseki-ip-color);font-size: var(--kouseki-gl-size)">${pos}</span></b> 的小友💖<br>${distanceInfo}<br>${posdesc}<br>您的IP地址为：<b><span style="font-size: 12px;">${ip}</span></b><br>浏览器内核：<b><span style="font-size: 12px;"> ${getBrowserInfo()} </span></b><br>${timeChange} <br>`;
            // `欢迎来自 <b><span style="color: var(--kouseki-ip-color);font-size: var(--kouseki-gl-size)">${pos}</span></b> 的小友💖<br>${posdesc}<br>当前位置距博主约 <b><span style="color: var(--kouseki-ip-color)">${dist}</span></b> 公里！<br>您的IP地址为：<b><span style="font-size: 12px;">${ip}</span></b><br>浏览器内核：<b><span style="font-size: 12px;"> ${getBrowserInfo()} </span></b><br>${timeChange} <br>`;
    } catch (err) {
        console.log("Pjax无法获取元素");
    }
}

// Pjax完成页面切换的事件回调处理
function handlePjaxComplete() {
    showWelcome();
}

window.onload = function() {
    showWelcome();

    // 添加pjax:complete事件监听
    document.addEventListener("pjax:complete", handlePjaxComplete);
};



//链接: https://home.wfqyys.cn/2023/03/bc09934ba1cb.html/




// fetch('https://api.qjqq.cn/api/Local')
//     .then(response => response.json())
//     .then(data => {
//         ipLocation = data;
//         showWelcome();
//     })
//     .catch(error => console.error('Error:', error));


// function getDistance(e1, n1, e2, n2) {
//     const R = 6371;
//     const { sin, cos, asin, PI, hypot } = Math;
//     let getPoint = (e, n) => {
//         e *= PI / 180;
//         n *= PI / 180;
//         return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) };
//     };

//     let a = getPoint(e1, n1);
//     let b = getPoint(e2, n2);
//     let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z);
//     let r = asin(c / 2) * 2 * R;
//     return Math.round(r);
// }

// function showWelcome() {

//     let dist = getDistance(121.413921, 31.089290, ipLocation.data.lng, ipLocation.data.lat); //修改自己的经度（121.413921）纬度（31.089290）
//     let pos = ipLocation.data.country;
//     let ip = ipLocation.ip;
//     let posdesc;

//     // 以下的代码需要根据新API返回的结果进行相应的调整
//     switch (ipLocation.data.country) {
//         case "日本":
//             posdesc = "よろしく，一起去看樱花吗";
//             break;
//         case "美国":
//             posdesc = "Let us live in peace!";
//             break;
//         case "英国":
//             posdesc = "想同你一起夜乘伦敦眼";
//             break;
//         case "俄罗斯":
//             posdesc = "干了这瓶伏特加！";
//             break;
//         case "法国":
//             posdesc = "C'est La Vie";
//             break;
//         case "德国":
//             posdesc = "Die Zeit verging im Fluge.";
//             break;
//         case "澳大利亚":
//             posdesc = "一起去大堡礁吧！";
//             break;
//         case "加拿大":
//             posdesc = "拾起一片枫叶赠予你";
//             break;
//         case "中国":
//             pos = ipLocation.data.prov + " " + ipLocation.data.city + " " + ipLocation.data.district;
//             switch (ipLocation.data.prov) {
//                 case "北京市":
//                     posdesc = "北——京——欢迎你~~~";
//                     break;
//                 case "天津市":
//                     posdesc = "讲段相声吧";
//                     break;
//                 case "河北省":
//                     posdesc = "山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山";
//                     break;
//                 case "山西省":
//                     posdesc = "展开坐具长三尺，已占山河五百余";
//                     break;
//                 case "内蒙古自治区":
//                     posdesc = "天苍苍，野茫茫，风吹草低见牛羊";
//                     break;
//                 case "辽宁省":
//                     posdesc = "我想吃烤鸡架！";
//                     break;
//                 case "吉林省":
//                     posdesc = "状元阁就是东北烧烤之王";
//                     break;
//                 case "黑龙江省":
//                     posdesc = "很喜欢哈尔滨大剧院";
//                     break;
//                 case "上海市":
//                     posdesc = "众所周知，中国只有两个城市";
//                     break;
//                 case "江苏省":
//                     switch (ipLocation.data.city) {
//                         case "南京市":
//                             posdesc = "这是我挺想去的城市啦";
//                             break;
//                         case "苏州市":
//                             posdesc = "上有天堂，下有苏杭";
//                             break;
//                         default:
//                             posdesc = "散装是必须要散装的";
//                             break;
//                     }
//                     break;
//                 case "浙江省":
//                     posdesc = "东风渐绿西湖柳，雁已还人未南归";
//                     break;
//                 case "河南省":
//                     switch (ipLocation.data.city) {
//                         case "郑州市":
//                             posdesc = "豫州之域，天地之中";
//                             break;
//                         case "南阳市":
//                             posdesc = "臣本布衣，躬耕于南阳此南阳非彼南阳！";
//                             break;
//                         case "驻马店市":
//                             posdesc = "峰峰有奇石，石石挟仙气嵖岈山的花很美哦！";
//                             break;
//                         case "开封市":
//                             posdesc = "刚正不阿包青天";
//                             break;
//                         case "洛阳市":
//                             posdesc = "洛阳牡丹甲天下";
//                             break;
//                         default:
//                             posdesc = "可否带我品尝河南烩面啦？";
//                             break;
//                     }
//                     break;
//                 case "安徽省":
//                     posdesc = "蚌埠住了，芜湖起飞";
//                     break;
//                 case "福建省":
//                     posdesc = "井邑白云间，岩城远带山";
//                     break;
//                 case "江西省":
//                     posdesc = "落霞与孤鹜齐飞，秋水共长天一色";
//                     break;
//                 case "山东省":
//                     posdesc = "遥望齐州九点烟，一泓海水杯中泻";
//                     break;
//                 case "湖北省":
//                     switch (ipLocation.data.city) {
//                         case "黄冈市":
//                             posdesc = "红安将军县！辈出将才！";
//                             break;
//                         default:
//                             posdesc = "来碗热干面~";
//                             break;
//                     }
//                     break;
//                 case "湖南省":
//                     posdesc = "74751，长沙斯塔克";
//                     break;
//                 case "广东省":
//                     switch (ipLocation.data.city) {
//                         case "广州市":
//                             posdesc = "看小蛮腰，喝早茶了嘛~";
//                             break;
//                         case "深圳市":
//                             posdesc = "今天你逛商场了嘛~";
//                             break;
//                         case "阳江市":
//                             posdesc = "阳春合水！博主家乡~ 欢迎来玩~";
//                             break;
//                         default:
//                             posdesc = "来两斤福建人~";
//                             break;
//                     }
//                     break;
//                 case "广西壮族自治区":
//                     posdesc = "桂林山水甲天下";
//                     break;
//                 case "海南省":
//                     posdesc = "朝观日出逐白浪，夕看云起收霞光";
//                     break;
//                 case "四川省":
//                     posdesc = "康康川妹子";
//                     break;
//                 case "贵州省":
//                     posdesc = "茅台，学生，再塞200";
//                     break;
//                 case "云南省":
//                     posdesc = "玉龙飞舞云缠绕，万仞冰川直耸天";
//                     break;
//                 case "西藏自治区":
//                     posdesc = "躺在茫茫草原上，仰望蓝天";
//                     break;
//                 case "陕西省":
//                     posdesc = "来份臊子面加馍";
//                     break;
//                 case "甘肃省":
//                     posdesc = "羌笛何须怨杨柳，春风不度玉门关";
//                     break;
//                 case "青海省":
//                     posdesc = "牛肉干和老酸奶都好好吃";
//                     break;
//                 case "宁夏回族自治区":
//                     posdesc = "大漠孤烟直，长河落日圆";
//                     break;
//                 case "新疆维吾尔自治区":
//                     posdesc = "驼铃古道丝绸路，胡马犹闻唐汉风";
//                     break;
//                 case "台湾省":
//                     posdesc = "我在这头，大陆在那头";
//                     break;
//                 case "香港特别行政区":
//                     posdesc = "永定贼有残留地鬼嚎，迎击光非岁玉";
//                     break;
//                 case "澳门特别行政区":
//                     posdesc = "性感荷官，在线发牌";
//                     break;
//                 default:
//                     posdesc = "带我去你的城市逛逛吧！";
//                     break;
//             }
//             break;
//         default:
//             posdesc = "带我去你的国家逛逛吧";
//             break;
//     }

//     //根据本地时间切换欢迎语
//     let timeChange;
//     let date = new Date();
//     if (date.getHours() >= 5 && date.getHours() < 11) timeChange = "<span>🌤️ 早上好，一日之计在于晨</span>";
//     else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = "<span>☀️ 中午好，记得午休喔~</span>";
//     else if (date.getHours() >= 13 && date.getHours() < 17) timeChange = "<span>🕞 下午好，饮茶先啦！</span>";
//     else if (date.getHours() >= 17 && date.getHours() < 19) timeChange = "<span>🚶‍♂️ 即将下班，记得按时吃饭~</span>";
//     else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>🌙 晚上好，夜生活嗨起来！</span>";
//     else timeChange = "夜深了，早点休息，少熬夜";

//     try {
//         //自定义文本和需要放的位置
//         document.getElementById("welcome-info").innerHTML =
//             `欢迎来自 <b><span style="color: var(--kouseki-ip-color);font-size: var(--kouseki-gl-size)">${pos}</span></b> 的小友💖<br>${posdesc}🍂<br>当前位置距博主约 <b><span style="color: var(--kouseki-ip-color)">${dist}</span></b> 公里！<br>您的IP地址为：<b><span style="font-size: 12px;">${ip}</span></b><br>${timeChange} <br>`;
//     } catch (err) {
//         console.log("Pjax无法获取元素");
//     }
// }

// // Pjax完成页面切换的事件回调处理
// function handlePjaxComplete() {
//     showWelcome();
// }

// window.onload = function() {
//     showWelcome();

//     // 添加pjax:complete事件监听
//     document.addEventListener("pjax:complete", handlePjaxComplete);
// };


