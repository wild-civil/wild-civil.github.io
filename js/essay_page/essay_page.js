var essayManager = {
    currentPage: 1,
    itemsPerPage: 6,
    allEssays: [],
    isLoading: false,

    init: function() {
        this.loadEssayData();
        this.setupEventListeners();
        this.restoreState();
    },

    loadEssayData: function() {
        // 从全局变量或直接数据加载
        if (window.essayData && Array.isArray(window.essayData)) {
            this.allEssays = this.flattenEssayData(window.essayData);
            this.renderPagination();
            this.renderCurrentPage();
        } else {
            console.error('Essay data not found');
        }
    },

    flattenEssayData: function(essayData) {
        const flattened = [];
        essayData.forEach(category => {
            if (category.essay_list && Array.isArray(category.essay_list)) {
                category.essay_list.forEach(essay => {
                    flattened.push(essay);
                });
            }
        });
        return flattened;
    },

    renderCurrentPage: function() {
        if (this.isLoading) return;
        this.isLoading = true;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.allEssays.length);
        const currentEssays = this.allEssays.slice(startIndex, endIndex);

        this.renderEssays(currentEssays);
        this.updateTips();
        
        // 重新初始化瀑布流
        setTimeout(() => {
            this.initWaterfall();
            this.isLoading = false;
        }, 100);
    },

    renderEssays: function(essays) {
        const waterfall = document.getElementById('waterfall');
        if (!waterfall) return;

        // 清空现有内容
        waterfall.innerHTML = '';

        essays.forEach((item, index) => {
            const essayElement = this.createEssayElement(item, index);
            waterfall.appendChild(essayElement);
        });
    },



    // createEssayElement: function(item, index) {
    //     const li = document.createElement('li');
    //     li.className = 'bber-item';
    //     li.setAttribute('data-index', index);

    //     let imagesHtml = '';
    //     if (item.image) {
    //         if (item.image.length === 1) {
    //             imagesHtml = `
    //                 <div class="bber-container-img">
    //                     <a class="bber-content-img-one" href="${item.image[0]}" target="_blank" data-fancybox="gallery" data-caption="">
    //                         <img src="${item.image[0]}" loading="lazy">
    //                     </a>
    //                 </div>
    //             `;
    //         } else {
    //             imagesHtml = `
    //                 <div class="bber-container-img">
    //                     ${item.image.map(img => `
    //                         <a class="bber-content-img" href="${img}" target="_blank" data-fancybox="gallery" data-caption="">
    //                             <img src="${img}" loading="lazy">
    //                         </a>
    //                     `).join('')}
    //                     <div class="bber-content-noimg"></div>
    //                     <div class="bber-content-noimg"></div>
    //                     <div class="bber-content-noimg"></div>
    //                 </div>
    //             `;
    //         }
    //     }

    //     let musicHtml = '';
    //     if (item.aplayer) {
    //         musicHtml = `
    //             <div class="bber-music">
    //                 <div class="aplayer no-destroy" 
    //                     data-id="${item.aplayer.id}" 
    //                     data-server="${item.aplayer.server}" 
    //                     data-type="song" 
    //                     data-order="list" 
    //                     data-preload="none" 
    //                     data-autoplay="false" 
    //                     data-mutex="true" 
    //                     data-theme="var(--anzhiyu-main)">
    //                 </div>
    //             </div>
    //         `;
    //     }

    //     let bilibiliHtml = '';
    //     if (item.bilibili) {
    //         bilibiliHtml = `
    //             <div class="aspect-ratio">
    //                 <iframe src="https://player.bilibili.com/player.html?bvid=${item.bilibili}&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=false" 
    //                         scrolling="no" border="0" frameborder="no" framespacing="0" 
    //                         high_quality="1" danmaku="1" allowfullscreen="true">
    //                 </iframe>
    //             </div>
    //         `;
    //     }

    //     const contentText = item.content.replace(/<br\s*\/?>/gi, '');
    //     // 使用新的日期格式化方法
    //     const dateObj = new Date(item.date);
    //     const formattedDate = this.formatLocalDate(dateObj);

    //     li.innerHTML = `
    //         <div class="bber-content">
    //             <p class="datacont">${item.content}</p>
    //             ${imagesHtml}
    //             ${musicHtml}
    //             ${bilibiliHtml}
    //         </div>
    //         <hr>
    //         <div class="bber-bottom">
    //             <div class="bber-info">
    //                 <div class="bber-info-time">
    //                     <i class="far fa-clock"></i>
    //                     <time class="datatime" datetime="${item.date}">${formattedDate}</time>
    //                 </div>
    //                 ${item.link ? `
    //                     <a class="bber-content-link" target="_blank" title="跳转到短文指引的链接" href="${item.link}" rel="external nofollow">
    //                         <i class="fas fa-link"></i>链接
    //                     </a>
    //                 ` : ''}
    //                 ${item.from ? `
    //                     <div class="bber-info-from">
    //                         <i class="fas fa-fire"></i>
    //                         <span>${item.from}</span>
    //                     </div>
    //                 ` : ''}
    //                 ${item.location ? `
    //                     <div class="bber-info-from">
    //                         <i class="fas fa-location-dot"></i>
    //                         <span>${item.location}</span>
    //                     </div>
    //                 ` : ''}
    //             </div>
    //             <div class="bber-reply" onclick="essayManager.commentText('${contentText.replace(/'/g, "\\'")}')">
    //                 <i class="fa-solid fa-message"></i>
    //             </div>
    //         </div>
    //     `;

    //     return li;
    // },

    // // 日期格式化方法
    // formatLocalDate: function(date) {
    //     const now = new Date();
    //     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //     const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    //     const diffTime = today - targetDate;
    //     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
    //     if (diffDays === 0) {
    //         return '今天';
    //     } else if (diffDays === 1) {
    //         return '昨天';
    //     } else if (diffDays === 2) {
    //         return '前天';
    //     // } else if (diffDays < 7) {
    //     //     return `${diffDays}天前`;
    //     // } else if (diffDays < 30) {
    //     //     return `${Math.floor(diffDays / 7)}周前`;
    //     } else {
    //         // 显示具体日期
    //         const year = date.getFullYear();
    //         const month = String(date.getMonth() + 1).padStart(2, '0');
    //         const day = String(date.getDate()).padStart(2, '0');
    //         return `${year}-${month}-${day}`;
    //     }
    // },


    //如果是"今天"昨天"前天"大前天"就显示汉字，否则就显示相应的YYYY/MM/DD
    //当我标注date: 2025/3/13时就只显示这个日期，当我标注date: 2025/6/14 20:40:00，则显示具体到时分秒
    createEssayElement: function(item, index) {
        const li = document.createElement('li');
        li.className = 'bber-item';
        li.setAttribute('data-index', index);

        let imagesHtml = '';
        if (item.image) {
            if (item.image.length === 1) {
                imagesHtml = `
                    <div class="bber-container-img">
                        <a class="bber-content-img-one" href="${item.image[0]}" target="_blank" data-fancybox="gallery" data-caption="">
                            <img src="${item.image[0]}" loading="lazy">
                        </a>
                    </div>
                `;
            } else {
                imagesHtml = `
                    <div class="bber-container-img">
                        ${item.image.map(img => `
                            <a class="bber-content-img" href="${img}" target="_blank" data-fancybox="gallery" data-caption="">
                                <img src="${img}" loading="lazy">
                            </a>
                        `).join('')}
                        <div class="bber-content-noimg"></div>
                        <div class="bber-content-noimg"></div>
                        <div class="bber-content-noimg"></div>
                    </div>
                `;
            }
        }

        let musicHtml = '';
        if (item.aplayer) {
            musicHtml = `
                <div class="bber-music">
                    <div class="aplayer no-destroy" 
                        data-id="${item.aplayer.id}" 
                        data-server="${item.aplayer.server}" 
                        data-type="song" 
                        data-order="list" 
                        data-preload="none" 
                        data-autoplay="false" 
                        data-mutex="true" 
                        data-theme="var(--anzhiyu-main)">
                    </div>
                </div>
            `;
        }

        let bilibiliHtml = '';
        if (item.bilibili) {
            bilibiliHtml = `
                <div class="aspect-ratio">
                    <iframe src="https://player.bilibili.com/player.html?bvid=${item.bilibili}&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=false" 
                            scrolling="no" border="0" frameborder="no" framespacing="0" 
                            high_quality="1" danmaku="1" allowfullscreen="true">
                    </iframe>
                </div>
            `;
        }

        const contentText = item.content.replace(/<br\s*\/?>/gi, '');
        // 使用新的日期格式化方法，传递原始日期字符串
        const formattedDate = this.formatLocalDate(item.date);

        li.innerHTML = `
            <div class="bber-content">
                <p class="datacont">${item.content}</p>
                ${imagesHtml}
                ${musicHtml}
                ${bilibiliHtml}
            </div>
            <hr>
            <div class="bber-bottom">
                <div class="bber-info">
                    <div class="bber-info-time">
                        <i class="far fa-clock"></i>
                        <time class="datatime" datetime="${item.date}">${formattedDate}</time>
                    </div>
                    ${item.link ? `
                        <a class="bber-content-link" target="_blank" title="跳转到短文指引的链接" href="${item.link}" rel="external nofollow">
                            <i class="fas fa-link"></i>链接
                        </a>
                    ` : ''}
                    ${item.from ? `
                        <div class="bber-info-from">
                            <i class="fas fa-fire"></i>
                            <span>${item.from}</span>
                        </div>
                    ` : ''}
                    ${item.location ? `
                        <div class="bber-info-from">
                            <i class="fas fa-location-dot"></i>
                            <span>${item.location}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="bber-reply" onclick="essayManager.commentText('${contentText.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-message"></i>
                </div>
            </div>
        `;

        return li;
    },

    // 日期格式化方法 - 智能显示
    formatLocalDate: function(dateStr) {
        // 解析日期字符串
        const date = new Date(dateStr);
        const now = new Date();
        
        // 检查原始字符串是否包含时间部分
        const hasTime = dateStr.includes(':');
        
        // 计算日期差（只比较日期部分，忽略时间）
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffTime = today - targetDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // 处理3天内的相对时间显示
        if (diffDays >= 0 && diffDays <= 3) {
            let dayText = '';
            switch (diffDays) {
                case 0: dayText = '今天'; break;
                case 1: dayText = '昨天'; break;
                case 2: dayText = '前天'; break;
                case 3: dayText = '大前天'; break;
            }
            
            // 如果原始日期包含时间，则添加时间显示
            if (hasTime) {
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${dayText} ${hours}:${minutes}:${seconds}`;
            } else {
                return dayText;
            }
        } 
        // 超过3天，显示完整日期
        else {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            // 如果原始日期包含时间，则添加时间显示
            if (hasTime) {
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            } else {
                return `${year}/${month}/${day}`;
                // return `${year}-${month}-${day}`;
            }
        }
    },
    //---


    renderPagination: function() {
        const totalPages = Math.ceil(this.allEssays.length / this.itemsPerPage);
        const paginationContainer = document.querySelector('.pagination') || this.createPaginationContainer();
        
        paginationContainer.innerHTML = '';

        // 添加上一页按钮
        const prevButton = document.createElement('a');
        prevButton.className = 'pagination-item pagination-prev';
        prevButton.innerHTML = '&laquo; 上一页';
        prevButton.onclick = () => this.prevPage();
        paginationContainer.appendChild(prevButton);

        // 添加页码
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('a');
            pageButton.className = `pagination-item ${i === this.currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.onclick = () => this.goToPage(i);
            paginationContainer.appendChild(pageButton);
        }

        // 添加下一页按钮
        const nextButton = document.createElement('a');
        nextButton.className = 'pagination-item pagination-next';
        nextButton.innerHTML = '下一页 &raquo;';
        nextButton.onclick = () => this.nextPage();
        paginationContainer.appendChild(nextButton);
    },

    createPaginationContainer: function() {
        const container = document.createElement('div');
        container.className = 'pagination';
        const bberContainer = document.getElementById('bber');
        if (bberContainer) {
            bberContainer.appendChild(container);
        }
        return container;
    },

    goToPage: function(page) {
        if (page < 1 || page > Math.ceil(this.allEssays.length / this.itemsPerPage)) {
            return;
        }

        this.currentPage = page;
        this.saveState();
        this.renderPagination();
        this.renderCurrentPage();
        
        // 滚动到顶部
        setTimeout(() => {
            const bberElement = document.getElementById('bber');
            if (bberElement) {
                window.scrollTo({
                    top: bberElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }, 200);
    },

    prevPage: function() {
        this.goToPage(this.currentPage - 1);
    },

    nextPage: function() {
        this.goToPage(this.currentPage + 1);
    },

    updateTips: function() {
        const tips = document.getElementById('bber-tips');
        if (tips) {
            const totalPages = Math.ceil(this.allEssays.length / this.itemsPerPage);
            tips.textContent = `- 共 ${this.allEssays.length} 条短文，第 ${this.currentPage}/${totalPages} 页 -`;
        }
    },

    initWaterfall: function() {
        const waterfall = document.getElementById('waterfall');
        if (!waterfall) return;

        // 重置瀑布流状态
        waterfall.style.height = 'auto';
        
        setTimeout(() => {
            if (typeof window.waterfall === 'function') {
                try {
                    window.waterfall('#waterfall');
                    
                    // 确保瀑布流正确显示
                    setTimeout(() => {
                        waterfall.classList.add('show');
                        waterfall.style.opacity = '1';
                    }, 100);
                } catch (error) {
                    console.error('Waterfall layout error:', error);
                }
            }
        }, 50);
    },

    saveState: function() {
        sessionStorage.setItem('essayCurrentPage', this.currentPage.toString());
    },

    restoreState: function() {
        const savedPage = parseInt(sessionStorage.getItem('essayCurrentPage'));
        if (savedPage && !isNaN(savedPage)) {
            this.currentPage = savedPage;
        }
    },

    setupEventListeners: function() {
        // 窗口大小改变时重新计算瀑布流
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.initWaterfall();
            }, 250);
        });
    },

    commentText: function(txt) {
        const postCommentDom = document.querySelector("#post-comment");
        if (!postCommentDom) return;
        
        const domTop = postCommentDom.offsetTop;
        window.scrollTo(0, domTop - 80);
        
        if (txt === "undefined" || txt === "null") txt = "好棒！";
        
        function setText() {
            setTimeout(() => {
                const input = document.getElementsByClassName("el-textarea__inner")[0];
                if (!input) {
                    setText();
                    return;
                }
                
                const event = document.createEvent("HTMLEvents");
                event.initEvent("input", true, true);
                const inputValue = txt.replace(/\n/g, "\n> ");
                input.value = "> " + inputValue + "\n\n";
                input.dispatchEvent(event);
                input.focus();
                input.setSelectionRange(-1, -1);
                
                const commentTips = document.getElementById("comment-tips");
                if (commentTips) {
                    commentTips.classList.add("show");
                }
            }, 100);
        }
        setText();
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        essayManager.init();
    }, 100);
});

// PJAX支持
if (typeof pjax !== 'undefined') {
    document.addEventListener('pjax:complete', function() {
        setTimeout(() => {
            essayManager.init();
        }, 100);
    });
}

// 页面卸载前保存状态
window.addEventListener('beforeunload', function() {
    essayManager.saveState();
});