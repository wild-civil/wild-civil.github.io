var percentFlag = false;
var currentEssayPage = 1;
var essaysPerPage = 6;

function essayScroll() {
  let a = document.documentElement.scrollTop || window.pageYOffset;
  const waterfallResult = a % document.documentElement.clientHeight;
  result <= 99 || (result = 99);

  if (
    !percentFlag &&
    waterfallResult + 100 >= document.documentElement.clientHeight &&
    document.querySelector("#waterfall")
  ) {
    setTimeout(() => {
      waterfall("#waterfall");
    }, 500);
  } else {
    setTimeout(() => {
      document.querySelector("#waterfall") && waterfall("#waterfall");
    }, 500);
  }

  const r = window.scrollY + document.documentElement.clientHeight;
  let p = document.getElementById("post-comment") || document.getElementById("footer");
  (p.offsetTop + p.offsetHeight / 2 < r || 90 < result) && (percentFlag = true);
}

function replaceAll(e, n, t) {
  return e.split(n).join(t);
}

// 完全重写的分页显示函数
function showEssayPage(pageNum) {
  const allItems = document.querySelectorAll('.bber-item');
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / essaysPerPage);
  
  console.log(`切换到第 ${pageNum} 页，共 ${totalPages} 页，每页 ${essaysPerPage} 条`);
  
  // 确保页码在有效范围内
  pageNum = Math.max(1, Math.min(pageNum, totalPages));
  currentEssayPage = pageNum;
  
  // 保存当前页面到sessionStorage
  sessionStorage.setItem('essayCurrentPage', pageNum.toString());
  
  // 完全重置所有项目的显示状态
  allItems.forEach((item, index) => {
    // 移除所有可能影响显示的类
    item.classList.remove('active-page', 'hidden-page', 'visible-page');
    
    // 使用更可靠的方法控制显示
    const startIndex = (pageNum - 1) * essaysPerPage;
    const endIndex = Math.min(startIndex + essaysPerPage, totalItems);
    
    if (index >= startIndex && index < endIndex) {
      // 当前页的项目
      item.style.display = 'flex';
      item.style.visibility = 'visible';
      item.style.opacity = '1';
      item.style.position = 'relative';
      item.classList.add('visible-page');
    } else {
      // 非当前页的项目
      item.style.display = 'none';
      item.style.visibility = 'hidden';
      item.style.opacity = '0';
      item.classList.add('hidden-page');
    }
  });
  
  // 更新分页按钮状态
  updatePaginationButtons(pageNum, totalPages);
  
  // 更新提示信息
  updatePageInfo(totalItems, pageNum, totalPages);
  
  // 重新计算瀑布流 - 使用更激进的方法
  reflowWaterfallCompletely();
  
  // 滚动到顶部
  const bberElement = document.getElementById('bber');
  if (bberElement) {
    setTimeout(() => {
      window.scrollTo({
        top: bberElement.offsetTop - 100,
        behavior: 'smooth'
      });
    }, 300);
  }
}

// 更新分页按钮状态
function updatePaginationButtons(pageNum, totalPages) {
  const pageButtons = document.querySelectorAll('.pagination-item:not(.pagination-prev):not(.pagination-next)');
  pageButtons.forEach((btn) => {
    const pageNumber = parseInt(btn.textContent);
    if (pageNumber === pageNum) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // 更新上一页/下一页按钮状态
  const prevButton = document.querySelector('.pagination-prev');
  const nextButton = document.querySelector('.pagination-next');
  
  if (prevButton) {
    prevButton.style.opacity = pageNum === 1 ? '0.5' : '1';
    prevButton.style.pointerEvents = pageNum === 1 ? 'none' : 'all';
  }
  if (nextButton) {
    nextButton.style.opacity = pageNum === totalPages ? '0.5' : '1';
    nextButton.style.pointerEvents = pageNum === totalPages ? 'none' : 'all';
  }
}

// 更新页面信息
function updatePageInfo(totalItems, currentPage, totalPages) {
  const tipsElement = document.getElementById('bber-tips');
  if (tipsElement) {
    tipsElement.textContent = `- 共 ${totalItems} 条短文，第 ${currentPage}/${totalPages} 页 -`;
  }
}

// 彻底重新计算瀑布流布局
function reflowWaterfallCompletely() {
  const waterfallElement = document.querySelector("#waterfall");
  if (!waterfallElement) return;
  
  console.log('开始彻底重新计算瀑布流');
  
  // 方法1: 先完全隐藏再显示，强制重排
  waterfallElement.style.display = 'none';
  
  setTimeout(() => {
    waterfallElement.style.display = 'block';
    
    // 方法2: 强制重排
    void waterfallElement.offsetHeight;
    
    // 方法3: 重置瀑布流
    if (typeof waterfall === 'function') {
      // 先移除可能存在的瀑布流实例
      try {
        // 尝试重置瀑布流容器
        const listElement = document.querySelector('#waterfall .list');
        if (listElement) {
          // 临时修改布局然后恢复，强制重排
          listElement.style.flexDirection = 'column';
          setTimeout(() => {
            listElement.style.flexDirection = '';
            waterfall("#waterfall");
          }, 50);
        } else {
          waterfall("#waterfall");
        }
      } catch (e) {
        console.warn('瀑布流重置时出错:', e);
        // 如果出错，直接重新初始化
        setTimeout(() => {
          if (typeof waterfall === 'function') {
            waterfall("#waterfall");
          }
        }, 100);
      }
    }
    
    // 确保最终显示
    setTimeout(() => {
      waterfallElement.classList.add("show");
      waterfallElement.style.opacity = '1';
      
      // 最终检查
      setTimeout(() => {
        checkAndFixLayout();
      }, 200);
    }, 150);
  }, 50);
}

// 检查并修复布局问题
function checkAndFixLayout() {
  const visibleItems = document.querySelectorAll('.bber-item.visible-page');
  const waterfallElement = document.querySelector("#waterfall");
  
  console.log(`当前显示 ${visibleItems.length} 个项目`);
  
  // 检查是否有重叠
  let hasOverlap = false;
  visibleItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    
    // 检查与后续项目的重叠
    for (let j = index + 1; j < visibleItems.length; j++) {
      const nextRect = visibleItems[j].getBoundingClientRect();
      if (rect.bottom > nextRect.top && Math.abs(rect.left - nextRect.left) < 10) {
        hasOverlap = true;
        console.warn(`检测到项目 ${index} 和 ${j} 重叠`);
        break;
      }
    }
  });
  
  // 如果检测到重叠，强制重新布局
  if (hasOverlap && typeof waterfall === 'function') {
    console.log('检测到重叠，强制重新布局');
    waterfallElement.classList.remove("show");
    setTimeout(() => {
      waterfall("#waterfall");
      setTimeout(() => {
        waterfallElement.classList.add("show");
      }, 100);
    }, 100);
  }
}

// 初始化分页
function initEssayPagination() {
  const allItems = document.querySelectorAll('.bber-item');
  const totalItems = allItems.length;
  
  console.log(`找到 ${totalItems} 条短文，每页显示 ${essaysPerPage} 条`);
  
  if (totalItems === 0) {
    console.log('没有找到短文内容');
    return;
  }
  
  const totalPages = Math.ceil(totalItems / essaysPerPage);
  
  // 如果已经有分页元素，先移除
  const existingPagination = document.querySelector('.pagination');
  if (existingPagination) {
    existingPagination.remove();
  }
  
  // 创建分页容器
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination';
  paginationContainer.id = 'essay-pagination';
  
  // 添加上一页按钮
  const prevButton = document.createElement('a');
  prevButton.className = 'pagination-item pagination-prev';
  prevButton.innerHTML = '&laquo; 上一页';
  prevButton.href = 'javascript:void(0);';
  prevButton.onclick = function() {
    if (currentEssayPage > 1) {
      showEssayPage(currentEssayPage - 1);
    }
  };
  paginationContainer.appendChild(prevButton);
  
  // 添加页码按钮
  const maxVisiblePages = Math.min(totalPages, 6);
  let startPage = 1;
  let endPage = totalPages;
  
  if (totalPages > maxVisiblePages) {
    const half = Math.floor(maxVisiblePages / 2);
    startPage = Math.max(1, currentEssayPage - half);
    endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  }
  
  // 添加第一页和省略号（如果需要）
  if (startPage > 1) {
    const firstPageButton = document.createElement('a');
    firstPageButton.className = 'pagination-item';
    firstPageButton.textContent = '1';
    firstPageButton.href = 'javascript:void(0);';
    firstPageButton.onclick = function() {
      showEssayPage(1);
    };
    paginationContainer.appendChild(firstPageButton);
    
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      paginationContainer.appendChild(ellipsis);
    }
  }
  
  // 添加页码按钮
  for (let p = startPage; p <= endPage; p++) {
    const pageButton = document.createElement('a');
    pageButton.className = `pagination-item ${p === 1 ? 'active' : ''}`;
    pageButton.textContent = p;
    pageButton.href = 'javascript:void(0);';
    pageButton.onclick = function() {
      showEssayPage(p);
    };
    paginationContainer.appendChild(pageButton);
  }
  
  // 添加最后一页和省略号（如果需要）
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      paginationContainer.appendChild(ellipsis);
    }
    
    const lastPageButton = document.createElement('a');
    lastPageButton.className = 'pagination-item';
    lastPageButton.textContent = totalPages;
    lastPageButton.href = 'javascript:void(0);';
    lastPageButton.onclick = function() {
      showEssayPage(totalPages);
    };
    paginationContainer.appendChild(lastPageButton);
  }
  
  // 添加下一页按钮
  const nextButton = document.createElement('a');
  nextButton.className = 'pagination-item pagination-next';
  nextButton.innerHTML = '下一页 &raquo;';
  nextButton.href = 'javascript:void(0);';
  nextButton.onclick = function() {
    if (currentEssayPage < totalPages) {
      showEssayPage(currentEssayPage + 1);
    }
  };
  paginationContainer.appendChild(nextButton);
  
  // 插入到短文容器后面
  const bberContainer = document.getElementById('bber');
  if (bberContainer) {
    bberContainer.appendChild(paginationContainer);
  }
  
  console.log('分页初始化完成');
  
  // 从sessionStorage获取保存的页面或默认第一页
  const savedPage = parseInt(sessionStorage.getItem('essayCurrentPage')) || 1;
  showEssayPage(savedPage);
}

var anzhiyu = {
  diffDate: function (d, more = false) {
    const dateNow = new Date();
    const datePost = new Date(d);
    const dateDiff = dateNow.getTime() - datePost.getTime();
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    let result;
    if (more) {
      const monthCount = dateDiff / month;
      const dayCount = dateDiff / day;
      const hourCount = dateDiff / hour;
      const minuteCount = dateDiff / minute;

      if (monthCount >= 1) {
        result = datePost.toLocaleDateString().replace(/\//g, "-");
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + " " + GLOBAL_CONFIG.date_suffix.day;
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + " " + GLOBAL_CONFIG.date_suffix.hour;
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + " " + GLOBAL_CONFIG.date_suffix.min;
      } else {
        result = GLOBAL_CONFIG.date_suffix.just;
      }
    } else {
      result = parseInt(dateDiff / day);
    }
    return result;
  },
  changeTimeInEssay: function () {
    document.querySelector("#bber") &&
      document.querySelectorAll("#bber time").forEach(function (e) {
        var t = e,
          datetime = t.getAttribute("datetime");
        (t.innerText = anzhiyu.diffDate(datetime, true)), (t.style.display = "inline");
      });
  },
  reflashEssayWaterFall: function () {
    document.querySelector("#waterfall") &&
      setTimeout(function () {
        waterfall("#waterfall");
        document.getElementById("waterfall").classList.add("show");
      }, 500);
  },
  commentText: function (txt) {
    const postCommentDom = document.querySelector("#post-comment");
    var domTop = postCommentDom.offsetTop;
    window.scrollTo(0, domTop - 80);
    if (txt == "undefined" || txt == "null") txt = "好棒！";
    function setText() {
      setTimeout(() => {
        var input = document.getElementsByClassName("el-textarea__inner")[0];
        if (!input) setText();
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("input", true, true);
        let inputValue = replaceAll(txt, "\n", "\n> ");
        input.value = "> " + inputValue + "\n\n";
        input.dispatchEvent(evt);
        input.focus();
        input.setSelectionRange(-1, -1);
        if (document.getElementById("comment-tips")) {
          document.getElementById("comment-tips").classList.add("show");
        }
      }, 100);
    }
    setText();
  },
  initIndexEssay: function () {
    setTimeout(() => {
      let essay_bar_swiper = new Swiper(".essay_bar_swiper_container", {
        passiveListeners: true,
        direction: "vertical",
        loop: true,
        autoplay: {
          disableOnInteraction: true,
          delay: 3000,
        },
        mousewheel: true,
      });

      let essay_bar_comtainer = document.getElementById("bbtalk");
      if (essay_bar_comtainer !== null) {
        essay_bar_comtainer.onmouseenter = function () {
          essay_bar_swiper.autoplay.stop();
        };
        essay_bar_comtainer.onmouseleave = function () {
          essay_bar_swiper.autoplay.start();
        };
      }
    }, 100);
  }
};

// 改进的初始化函数
function initializeEssayPage() {
  console.log('开始初始化短文页面...');
  
  // 先初始化基础功能
  anzhiyu.initIndexEssay();
  anzhiyu.changeTimeInEssay();
  
  // 等待DOM完全渲染后初始化分页
  setTimeout(() => {
    initEssayPagination();
    
    // 延迟执行瀑布流，确保分页已完成
    setTimeout(() => {
      anzhiyu.reflashEssayWaterFall();
      console.log('短文页面初始化完成');
    }, 600);
  }, 400);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEssayPage);
} else {
  initializeEssayPage();
}

// 如果使用了pjax，需要在pjax完成后重新初始化
if (typeof pjax !== 'undefined') {
  document.addEventListener('pjax:complete', function() {
    console.log('PJAX完成，重新初始化短文页面');
    setTimeout(initializeEssayPage, 100);
  });
}

// 页面卸载前保存当前页面状态
window.addEventListener('beforeunload', function() {
  sessionStorage.setItem('essayCurrentPage', currentEssayPage.toString());
});

// window.addEventListener("scroll", essayScroll);