
var essayManager = {
    currentPage: 1,
    itemsPerPage: 6,
    allEssays: [],
    isLoading: false,

    privateUnlocked: false,
    privatePassword: "123456", // 默认密码，修改进入个人区域
    privateCurrentPage: 1,
    privateItemsPerPage: 6, // 可以和公开区不同
    allPrivateEssays: [], // 存储所有个人短文数据


    init: function() {
        this.setupEventListeners();
        this.restoreState();  // 先恢复状态
        this.loadEssayData(); // 然后加载数据，这样渲染就会使用恢复后的状态
        this.initPrivateZoneModal();
        this.setupHistoryListener(); // 添加浏览器历史记录监听
    },
    

    loadEssayData: function() {
        // 从全局变量或直接数据加载
        if (window.essayData && Array.isArray(window.essayData)) {
            this.allEssays = this.flattenEssayData(window.essayData);
            this.renderPagination();
            this.renderCurrentPage(); // 这里会使用恢复后的页码
        } else {
            console.error('Essay data not found');
        }
    },

    // 加载个人短文数据
    loadPrivateEssayData: function() {
        if (window.privateEssayData && Array.isArray(window.privateEssayData)) {
            this.allPrivateEssays = this.flattenEssayData(window.privateEssayData);
            this.renderPrivateCurrentPage();
        } else {
            this.showEmptyPrivateZone();
        }
    },

    // 渲染当前页的个人短文
    renderPrivateCurrentPage: function() {
        const startIndex = (this.privateCurrentPage - 1) * this.privateItemsPerPage;
        const endIndex = Math.min(startIndex + this.privateItemsPerPage, this.allPrivateEssays.length);
        const currentEssays = this.allPrivateEssays.slice(startIndex, endIndex);
        
        this.renderPrivateEssays(currentEssays);
        this.renderPrivatePagination();
        this.updatePrivateTips();
        
        // 重新初始化瀑布流
        setTimeout(() => {
            this.initPrivateWaterfall();
        }, 100);
    },

    renderPrivateEssays: function(essays) {
        const waterfall = document.getElementById('waterfall_private');
        if (!waterfall) return;

        // 清空现有内容
        waterfall.innerHTML = '';

        if (essays.length === 0) {
            this.showEmptyPrivateZone();
            return;
        }

        essays.forEach((item, index) => {
            const essayElement = this.createEssayElement(item, index);
            waterfall.appendChild(essayElement);
        });
    },

    showEmptyPrivateZone: function() {
        const privateZone = document.querySelector('.private-zone');
        if (privateZone) {
            const emptyHtml = `
                <div class="empty-zone">
                    <i class="fas fa-lock"></i>
                    <p>暂无个人内容</p>
                </div>
            `;
            privateZone.querySelector('.list').innerHTML = emptyHtml;
        }
    },

    initPrivateWaterfall: function() {
        const waterfall = document.getElementById('waterfall_private');
        if (!waterfall) return;

        setTimeout(() => {
            if (typeof window.waterfall === 'function') {
                try {
                    window.waterfall('#waterfall_private');
                    
                    setTimeout(() => {
                        waterfall.classList.add('show');
                        waterfall.style.opacity = '1';
                    }, 100);
                } catch (error) {
                    console.error('Private waterfall layout error:', error);
                }
            }
        }, 50);
    },

    // 渲染个人区分页
    renderPrivatePagination: function() {
        const totalPages = Math.ceil(this.allPrivateEssays.length / this.privateItemsPerPage);
        let paginationContainer = document.querySelector('.private-pagination');
        
        // 如果分页容器不存在，创建它
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'private-pagination';
            const privateZone = document.querySelector('.private-zone');
            if (privateZone) {
                privateZone.appendChild(paginationContainer);
            }
        }
        
        paginationContainer.innerHTML = '';

        // 如果只有一页或没有内容，不显示分页
        if (totalPages <= 1) {
            return;
        }

        // 添加上一页按钮
        const prevButton = document.createElement('a');
        prevButton.className = 'pagination-item pagination-prev';
        prevButton.innerHTML = '&laquo; 上一页';
        prevButton.onclick = () => this.prevPrivatePage();
        paginationContainer.appendChild(prevButton);

        // 添加页码
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('a');
            pageButton.className = `pagination-item ${i === this.privateCurrentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.onclick = () => this.goToPrivatePage(i);
            paginationContainer.appendChild(pageButton);
        }

        // 添加下一页按钮
        const nextButton = document.createElement('a');
        nextButton.className = 'pagination-item pagination-next';
        nextButton.innerHTML = '下一页 &raquo;';
        nextButton.onclick = () => this.nextPrivatePage();
        paginationContainer.appendChild(nextButton);
    },

    // 个人区分页方法
    goToPrivatePage: function(page) {
        if (page < 1 || page > Math.ceil(this.allPrivateEssays.length / this.privateItemsPerPage)) {
            return;
        }

        this.privateCurrentPage = page;
        this.saveState();
        this.renderPrivatePagination();
        this.renderPrivateCurrentPage();
        
        // 更新URL状态但不刷新页面
        this.updatePrivateURLState();
    },

    prevPrivatePage: function() {
        this.goToPrivatePage(this.privateCurrentPage - 1);
    },

    nextPrivatePage: function() {
        this.goToPrivatePage(this.privateCurrentPage + 1);
    },

    // 更新个人区提示信息
    updatePrivateTips: function() {
        let tips = document.getElementById('private-bber-tips');
        if (!tips) {
            tips = document.createElement('div');
            tips.id = 'private-bber-tips';
            const privateZone = document.querySelector('.private-zone');
            if (privateZone) {
                privateZone.appendChild(tips);
            }
        }
        
        const totalPages = Math.ceil(this.allPrivateEssays.length / this.privateItemsPerPage);
        tips.textContent = `- 共 ${this.allPrivateEssays.length} 条个人短文，第 ${this.privateCurrentPage}/${totalPages} 页 -`;
    },

    togglePrivateZone: function() {
        if (this.privateUnlocked) {
            this.lockPrivateZone();
        } else {
            this.showPasswordModal();
        }
    },

    showPasswordModal: function() {
        const modal = document.getElementById('privateZoneModal');
        const passwordInput = document.getElementById('privateZonePassword');
        const errorMsg = document.querySelector('.error-message');
        
        if (modal && passwordInput) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
                passwordInput.focus();
            }, 10);
            
            // 清除错误状态
            passwordInput.classList.remove('password-error');
            if (errorMsg) errorMsg.classList.remove('show');
        }
    },

    hidePasswordModal: function() {
        const modal = document.getElementById('privateZoneModal');
        const passwordInput = document.getElementById('privateZonePassword');
        
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                if (passwordInput) passwordInput.value = '';
            }, 300);
        }
    },

    initPrivateZoneModal: function() {
        const confirmBtn = document.getElementById('confirmPrivateBtn');
        const cancelBtn = document.getElementById('cancelPrivateBtn');
        const passwordInput = document.getElementById('privateZonePassword');
        
        if (confirmBtn) {
            confirmBtn.onclick = () => this.verifyPassword();
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => this.hidePasswordModal();
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.verifyPassword();
                }
            });
        }
        
        // 点击模态框背景关闭
        const modal = document.getElementById('privateZoneModal');
        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) {
                    this.hidePasswordModal();
                }
            };
        }
    },

    verifyPassword: function() {
        const passwordInput = document.getElementById('privateZonePassword');
        const errorMsg = document.querySelector('.error-message');
        const enteredPassword = passwordInput.value.trim();
        
        if (!enteredPassword) {
            this.showPasswordError('请输入密码');
            return;
        }
        
        if (enteredPassword === this.privatePassword) {
            this.unlockPrivateZone();
            this.hidePasswordModal();
        } else {
            this.showPasswordError('密码错误，请重新输入');
        }
    },

    showPasswordError: function(message) {
        const passwordInput = document.getElementById('privateZonePassword');
        const errorMsg = document.querySelector('.error-message');
        
        if (passwordInput) {
            passwordInput.classList.add('password-error');
        }
        
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }
        
        // 3秒后清除错误状态
        setTimeout(() => {
            if (passwordInput) passwordInput.classList.remove('password-error');
            if (errorMsg) errorMsg.classList.remove('show');
        }, 3000);
    },

    unlockPrivateZone: function() {
        this.privateUnlocked = true;
        this.saveState();
        
        // 更新按钮状态
        const privateBtn = document.getElementById('privateZoneBtn');
        if (privateBtn) {
            privateBtn.classList.add('unlocked');
            privateBtn.querySelector('span').textContent = '退出个人区';
        }
        
        // 显示个人区
        const privateZone = document.querySelector('.private-zone');
        if (privateZone) {
            privateZone.style.display = 'block';
            this.loadPrivateEssayData();
        }
        
        // 更新URL状态
        this.updatePrivateURLState();
        
        // 滚动到个人区
        setTimeout(() => {
            privateZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    },

    lockPrivateZone: function() {
        this.privateUnlocked = false;
        this.privateCurrentPage = 1; // 重置个人区页码
        this.saveState();
        
        // 更新按钮状态
        const privateBtn = document.getElementById('privateZoneBtn');
        if (privateBtn) {
            privateBtn.classList.remove('unlocked');
            privateBtn.querySelector('span').textContent = '个人区';
        }
        
        // 隐藏个人区
        const privateZone = document.querySelector('.private-zone');
        if (privateZone) {
            privateZone.style.display = 'none';
        }
        
        // 清除URL中的个人区状态
        this.clearPrivateURLState();
    },

    // 更新URL状态以支持浏览器返回按钮
    updatePrivateURLState: function() {
        if (!this.privateUnlocked) return;
        
        const state = {
            privateUnlocked: true,
            privatePage: this.privateCurrentPage,
            publicPage: this.currentPage
        };
        
        // 使用replaceState而不是pushState，避免产生过多历史记录
        const url = new URL(window.location);
        url.searchParams.set('private', '1');
        url.searchParams.set('privatePage', this.privateCurrentPage);
        url.searchParams.set('publicPage', this.currentPage);
        
        window.history.replaceState(state, '', url);
    },

    clearPrivateURLState: function() {
        const url = new URL(window.location);
        url.searchParams.delete('private');
        url.searchParams.delete('privatePage');
        url.searchParams.delete('publicPage');
        
        window.history.replaceState({}, '', url);
    },

    // 设置历史记录监听
    setupHistoryListener: function() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.privateUnlocked) {
                // 恢复个人区状态
                this.privateUnlocked = true;
                this.privateCurrentPage = event.state.privatePage || 1;
                this.currentPage = event.state.publicPage || 1;
                
                // 更新UI
                this.unlockPrivateZone();
                this.renderPagination();
                this.renderCurrentPage();
            } else {
                // 检查URL参数
                const urlParams = new URLSearchParams(window.location.search);
                const privateParam = urlParams.get('private');
                const privatePage = parseInt(urlParams.get('privatePage')) || 1;
                const publicPage = parseInt(urlParams.get('publicPage')) || 1;
                
                if (privateParam === '1') {
                    this.privateUnlocked = true;
                    this.privateCurrentPage = privatePage;
                    this.currentPage = publicPage;
                    this.unlockPrivateZone();
                    this.renderPagination();
                    this.renderCurrentPage();
                }
            }
        });
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
        
        // 更新URL状态
        this.updatePublicURLState();
    },

    // 更新公开区URL状态
    updatePublicURLState: function() {
        const state = {
            publicPage: this.currentPage,
            privateUnlocked: this.privateUnlocked,
            privatePage: this.privateCurrentPage
        };
        
        const url = new URL(window.location);
        url.searchParams.set('publicPage', this.currentPage);
        
        if (this.privateUnlocked) {
            url.searchParams.set('private', '1');
            url.searchParams.set('privatePage', this.privateCurrentPage);
        } else {
            url.searchParams.delete('private');
            url.searchParams.delete('privatePage');
        }
        
        window.history.replaceState(state, '', url);
    },

    renderEssays: function(essays) {
        const waterfall = document.getElementById('waterfall_public');
        if (!waterfall) return;

        // 清空现有内容
        waterfall.innerHTML = '';

        if (essays.length === 0) {
            waterfall.innerHTML = `
                <div class="empty-zone">
                    <i class="fas fa-feather"></i>
                    <p>暂无公开内容</p>
                </div>
            `;
            return;
        }

        essays.forEach((item, index) => {
            const essayElement = this.createEssayElement(item, index);
            waterfall.appendChild(essayElement);
        });
    },

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
            } else {
                return `${year}/${month}/${day}`;
            }
        }
    },

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

    // 修改初始化瀑布流的方法
    initWaterfall: function() {
        const publicWaterfall = document.getElementById('waterfall_public');
        const privateWaterfall = document.getElementById('waterfall_private');
        
        if (publicWaterfall) {
            setTimeout(() => {
                if (typeof window.waterfall === 'function') {
                    try {
                        window.waterfall('#waterfall_public');
                        setTimeout(() => {
                            publicWaterfall.classList.add('show');
                            publicWaterfall.style.opacity = '1';
                        }, 100);
                    } catch (error) {
                        console.error('Public waterfall layout error:', error);
                    }
                }
            }, 50);
        }
        
        if (privateWaterfall && this.privateUnlocked) {
            this.initPrivateWaterfall();
        }
    },

    // 修改 saveState 和 restoreState 方法以包含个人区状态
    saveState: function() {
        sessionStorage.setItem('essayCurrentPage', this.currentPage.toString());
        sessionStorage.setItem('essayPrivateUnlocked', this.privateUnlocked.toString());
        sessionStorage.setItem('essayPrivateCurrentPage', this.privateCurrentPage.toString());
    },

    restoreState: function() {
        // 从sessionStorage恢复
        const savedPage = parseInt(sessionStorage.getItem('essayCurrentPage'));
        if (savedPage && !isNaN(savedPage)) {
            this.currentPage = savedPage;
        }
        
        const savedUnlocked = sessionStorage.getItem('essayPrivateUnlocked');
        if (savedUnlocked === 'true') {
            this.privateUnlocked = true;
            // 恢复个人区页码
            const savedPrivatePage = parseInt(sessionStorage.getItem('essayPrivateCurrentPage'));
            if (savedPrivatePage && !isNaN(savedPrivatePage)) {
                this.privateCurrentPage = savedPrivatePage;
            }
            this.unlockPrivateZone();
        }
        
        // 检查URL参数，优先使用URL中的状态
        const urlParams = new URLSearchParams(window.location.search);
        const privateParam = urlParams.get('private');
        const privatePage = parseInt(urlParams.get('privatePage')) || 1;
        const publicPage = parseInt(urlParams.get('publicPage')) || 1;
        
        // 添加公开区URL参数处理
        if (urlParams.has('publicPage')) {
            this.currentPage = publicPage;
        }
        
        if (privateParam === '1') {
            this.privateUnlocked = true;
            this.privateCurrentPage = privatePage;
            // 这里也要更新公开区页码
            if (urlParams.has('publicPage')) {
                this.currentPage = publicPage;
            }
            this.unlockPrivateZone();
            this.renderPagination();
        }
        
        // 确保渲染正确的页码
        this.renderPagination();
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
