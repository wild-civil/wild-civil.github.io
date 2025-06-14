// 全局变量
let inactivityTimer = null;
let activeTimer = null;
let stayInterval = null;
let pausedTime = 0;
let localhostTime, activeStartTime;

// 初始化函数
function initTimers() {
    // 获取元素
    const staySpan = document.getElementById("stayTiming");
    const activeSpan = document.getElementById("activeTiming");
    const warningSpan = document.getElementById("warning");

    if (!staySpan || !activeSpan || !warningSpan) {
        return false; // 元素未找到
    }

    // 重置时间
    localhostTime = new Date();
    activeStartTime = new Date();
    pausedTime = 0;
    
    // 清除旧计时器
    if (stayInterval) clearInterval(stayInterval);
    if (activeTimer) clearInterval(activeTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    // 启动计时器
    startStayTimer(staySpan);
    startInactivityTimer(warningSpan);
    startActiveTimer(activeSpan);
    
    // 绑定事件
    bindActivityEvents();
    
    return true; // 初始化成功
}

// 启动停留计时器
function startStayTimer(staySpan) {
    function update() {
        const goTime = new Date();
        const diffTime = goTime.getTime() - localhostTime.getTime();

        const hour = Math.floor(diffTime / 3600000);
        const minute = Math.floor((diffTime % 3600000) / 60000);
        const second = Math.floor((diffTime % 60000) / 1000);

        const str = tow(hour) + '<span class="time">小时</span> ' +
                    tow(minute) + '<span class="time">分钟</span> ' +
                    tow(second) + '<span class="time">秒</span>';

        staySpan.innerHTML = "您已打开网页 " + str;
    }
    
    stayInterval = setInterval(update, 1000);
    update(); // 立即更新
}

// 活跃时间计时器
function startActiveTimer(activeSpan) {
    activeTimer = setInterval(() => {
        const currentTime = new Date();
        const diffTime = currentTime.getTime() - activeStartTime.getTime() + pausedTime;

        const hour = Math.floor(diffTime / 3600000);
        const minute = Math.floor((diffTime % 3600000) / 60000);
        const second = Math.floor((diffTime % 60000) / 1000);

        const str = tow(hour) + '<span class="time">小时</span> ' +
                    tow(minute) + '<span class="time">分钟</span> ' +
                    tow(second) + '<span class="time">秒</span>';

        activeSpan.innerHTML = "您已浏览网页 " + str;
    }, 1000);
}

function stopActiveTimer() {
    if (activeTimer) {
        clearInterval(activeTimer);
        activeTimer = null;
    }
}

function startInactivityTimer(warningSpan) {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
        if (warningSpan) {
            warningSpan.innerHTML = "<font color='red'>您已超过十分钟未做出任何响应！</font>";
        }
        pausedTime += new Date().getTime() - activeStartTime.getTime();
        stopActiveTimer();
    }, 10 * 60 * 1000); // 10分钟
}

function resetInactivityTimer() {
    const warningSpan = document.getElementById("warning");
    if (warningSpan) {
        warningSpan.innerHTML = "";
    }
    startInactivityTimer(warningSpan);

    if (!activeTimer) {
        activeStartTime = new Date();
        const activeSpan = document.getElementById("activeTiming");
        if (activeSpan) startActiveTimer(activeSpan);
    }
}

// 绑定活动事件
function bindActivityEvents() {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
        window.addEventListener(event, resetInactivityTimer);
    });
}

// 辅助函数
function tow(n) {
    return n >= 0 && n < 10 ? '0' + n : '' + n;
}

// 主初始化函数
function mainInit() {
    // 尝试立即初始化
    if (initTimers()) return;
    
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                if (document.getElementById("stayTiming") && 
                    document.getElementById("activeTiming") && 
                    document.getElementById("warning")) {
                    observer.disconnect();
                    initTimers();
                    break;
                }
            }
        }
    });
    
    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 初始加载
document.addEventListener('DOMContentLoaded', mainInit);

// PJAX 事件监听器 - 使用通用方法
document.addEventListener('pjax:end', mainInit);
document.addEventListener('pjax:success', mainInit);
document.addEventListener('pjax:complete', mainInit);

// 为不同PJAX实现添加更多事件
const pjaxEvents = ['turbo:load', 'turbolinks:load', 'fragment:loaded'];
pjaxEvents.forEach(event => {
    document.addEventListener(event, mainInit);
});





















// let oSpan = document.getElementsByTagName("timing")[0];
// let localhostTime = new Date();//获取页面打开的时间
// function tow(n) {
//     return n >= 0 && n < 10 ? '0' + n : '' + n;
// }
// setInterval(function () {
//     let goTime = new Date();//获取动态时间
//     let diffTime = goTime.getTime() - localhostTime.getTime();
//     var second = Math.floor(diffTime / 1000);//未来时间距离现在的秒数
//     var day = Math.floor(second / 86400);//整数部分代表的是天；一天有24*60*60=86400秒 ；
//     second = second % 86400;//余数代表剩下的秒数；
//     var hour = Math.floor(second / 3600);//整数部分代表小时；
//     second %= 3600; //余数代表 剩下的秒数；
//     var minute = Math.floor(second / 60);
//     second %= 60;
//     // var str = tow(day) + '<span class="time">天</span>'
//     //     + tow(hour) + '<span class="time">小时</span>'
//     //     + tow(minute) + '<span class="time">分钟</span>'
//     //     + tow(second) + '<span class="time">秒</span>';
//     var str = tow(hour) + '<span class="time">小时</span>'
//         + tow(minute) + '<span class="time">分钟</span>'
//         + tow(second) + '<span class="time">秒</span>';
//     oSpan.innerHTML = "您已浏览网页" + str;
// }, 1000)


// // // 来源: https://cnhuazhu.gitee.io/2021/02/24/Hexo%E9%AD%94%E6%94%B9/Hexo%E5%A2%9E%E6%B7%BB%E5%85%AC%E5%91%8A%E6%A0%8F%E8%AE%A1%E6%97%B6%E5%99%A8%E5%B0%8F%E9%83%A8%E4%BB%B6/
