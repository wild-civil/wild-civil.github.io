var essayManager = {
    currentPage: 1,
    itemsPerPage: 6,
    allEssays: [],
    isLoading: false,

    privateUnlocked: false,
    privatePassword: "20201204", // 默认密码，修改进入个人区域
    privateCurrentPage: 1,
    privateItemsPerPage: 6, // 可以和公开区不同
    allPrivateEssays: [], // 存储所有个人短文数据

    // 新增：数据加载状态跟踪
    dataLoadRetries: 0,
    maxRetries: 5,

    // 新增：滚动锁定机制 - 防止用户滚动时自动跳回顶部
    isUserScrolling: false,
    scrollLockTimer: null,
    lastScrollTime: 0,
    isButtonClick: false, // 标记是否是按钮点击触发的操作

    init: function() {
        // 只在essay页面初始化
        if (!this.isEssayPage()) {
            return;
        }
        
        console.log('🎯 初始化短文管理器...');
        
        // 增强初始化：确保DOM和数据都就绪
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.delayedInit();
            });
        } else {
            this.delayedInit();
        }
    },

    // 新增：延迟初始化，确保所有资源就绪
    delayedInit: function() {
        setTimeout(() => {
            this.setupEventListeners();
            this.restoreState();
            this.ensureDataAndInit();
            this.initPrivateZoneModal();
        }, 300);
    },

    // 新增：确保数据就绪后再初始化
    ensureDataAndInit: function() {
        if (this.isDataReady()) {
            console.log('✅ 数据已就绪，开始加载短文...');
            this.loadEssayData();
        } else if (this.dataLoadRetries < this.maxRetries) {
            this.dataLoadRetries++;
            console.log(`🔄 数据未就绪，重试中... (${this.dataLoadRetries}/${this.maxRetries})`);
            setTimeout(() => this.ensureDataAndInit(), 500);
        } else {
            console.error('❌ 数据加载失败，达到最大重试次数');
            this.showDataError();
        }
    },

    // 新增：检查数据是否就绪
    isDataReady: function() {
        return window.essayData && Array.isArray(window.essayData) && window.essayData.length > 0;
    },

    // 新增：滚动锁定检查 - 判断是否应该执行自动滚动
    shouldScroll: function() {
        // 如果是按钮点击触发的操作，允许滚动
        if (this.isButtonClick) {
            this.isButtonClick = false; // 重置标记
            return true;
        }
        
        const now = Date.now();
        // 如果用户正在滚动（2秒内有滚动操作），则不执行自动滚动
        if (now - this.lastScrollTime < 2000) {
            console.log('🔒 用户正在滚动，跳过自动滚动');
            return false;
        }
        return true;
    },

    // 新增：记录用户滚动时间
    recordScrollTime: function() {
        this.lastScrollTime = Date.now();
    },

    // 新增：安全滚动到指定位置（仅在用户未滚动时执行）
    safeScrollTo: function(targetTop, behavior = 'smooth') {
        if (!this.shouldScroll()) {
            return;
        }
        window.scrollTo({ top: targetTop, behavior: behavior });
    },

    // 新增：安全滚动到元素位置
    safeScrollToElement: function(elementId, offset = 0) {
        if (!this.shouldScroll()) {
            return;
        }
        const element = document.getElementById(elementId);
        if (element) {
            window.scrollTo({ 
                top: element.offsetTop + offset, 
                behavior: 'smooth' 
            });
        }
    },

    // 新增：数据错误处理
    showDataError: function() {
        const tips = document.getElementById('bber-tips');
        if (tips) {
            tips.innerHTML = '- 数据加载失败，请<a href="javascript:location.reload()" style="color: var(--anzhiyu-main); text-decoration: underline;">刷新页面</a> -';
            tips.style.color = 'var(--anzhiyu-red)';
        }
    },

    // 检查当前是否在essay页面
    isEssayPage: function() {
        const currentPath = window.location.pathname;
        return currentPath.includes('/essay/') || currentPath.endsWith('/essay') || document.getElementById('waterfall_public');
    },

    loadEssayData: function() {
        // 从全局变量或直接数据加载
        console.log('📥 加载短文数据...', window.essayData);
        
        if (window.essayData && Array.isArray(window.essayData)) {
            this.allEssays = this.flattenEssayData(window.essayData);
            console.log(`✅ 成功加载 ${this.allEssays.length} 条短文`);
            this.renderPagination();
            this.renderCurrentPage();
        } else {
            console.error('❌ Essay data not found');
            this.showDataError(); // 使用新的错误处理方法
        }
    },

    // 加载个人短文数据
    loadPrivateEssayData: function() {
        console.log('🔒 加载个人短文数据...');
        
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
        
        // 重新初始化瀑布流 - 增加延迟确保DOM更新完成
        setTimeout(() => {
            this.initPrivateWaterfall();
        }, 200);
    },

    renderPrivateEssays: function(essays) {
        const waterfall = document.getElementById('waterfall_private');
        if (!waterfall) {
            console.error('❌ 个人区瀑布流容器未找到');
            return;
        }

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
                    }, 150);
                } catch (error) {
                    console.error('❌ Private waterfall layout error:', error);
                }
            }
        }, 100);
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
        prevButton.className = `pagination-item pagination-prev ${this.privateCurrentPage === 1 ? 'disabled' : ''}`;
        prevButton.innerHTML = '&laquo; 上一页';
        prevButton.onclick = () => this.prevPrivatePage();
        prevButton.href = 'javascript:void(0);';
        paginationContainer.appendChild(prevButton);

        // 添加页码
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('a');
            pageButton.className = `pagination-item ${i === this.privateCurrentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.onclick = () => this.goToPrivatePage(i);
            pageButton.href = 'javascript:void(0);';
            paginationContainer.appendChild(pageButton);
        }

        // 添加下一页按钮
        const nextButton = document.createElement('a');
        nextButton.className = 'pagination-item pagination-next';
        nextButton.innerHTML = '下一页 &raquo;';
        nextButton.onclick = () => this.nextPrivatePage();
        nextButton.href = 'javascript:void(0);';
        paginationContainer.appendChild(nextButton);
    },

    // 个人区分页方法
    goToPrivatePage: function(page) {
        if (page < 1 || page > Math.ceil(this.allPrivateEssays.length / this.privateItemsPerPage)) {
            return;
        }

        // 标记是按钮点击操作，允许自动滚动
        this.isButtonClick = true;

        this.privateCurrentPage = page;
        this.saveState();
        this.renderPrivatePagination();
        this.renderPrivateCurrentPage();
        
        // 将翻页记录到浏览器历史中
        try {
            history.pushState({
                essayPage: this.currentPage,
                essayPrivatePage: page,
                privateUnlocked: this.privateUnlocked
            }, '');
        } catch (e) {
            console.warn('History pushState failed:', e);
        }
        
        // 滚动到顶部
        setTimeout(() => {
            this.safeScrollToElement('bber', -100);
        }, 200);
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
        
        // 确保个人区提示信息有正确的样式
        tips.style.cssText = 'color: var(--anzhiyu-secondtext); display: flex; justify-content: center; margin-top: 1rem; font-size: 14px;';
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
        
        const publicZone = document.querySelector('.public-zone');
        const privateZone = document.querySelector('.private-zone');
        const publicPagination = document.getElementById('essay-pagination');
        
        // 添加隐藏动画类
        if (publicZone) publicZone.classList.add('hiding');
        if (publicPagination) publicPagination.classList.add('hiding');
        
        // 延迟执行实际显示/隐藏
        setTimeout(() => {
            if (publicZone) {
                publicZone.style.display = 'none';
                publicZone.classList.remove('hiding');
            }
            if (privateZone) {
                privateZone.style.display = 'block';
                privateZone.classList.add('showing');
                this.loadPrivateEssayData();
            }
            if (publicPagination) {
                publicPagination.style.display = 'none';
                publicPagination.classList.remove('hiding');
            }
            
            // 隐藏公开区的提示信息，显示个人区的提示信息
            const publicTips = document.getElementById('bber-tips');
            if (publicTips) {
                publicTips.style.display = 'none'; // 隐藏公开区提示
            }
            
            // 滚动到顶部
            //window.scrollTo({ top: 0, behavior: 'smooth' });
            // 安全滚动到顶部（仅在用户未主动滚动时）
            this.safeScrollTo(0);
        }, 300);
    },

    lockPrivateZone: function() {
        this.privateUnlocked = false;
        this.privateCurrentPage = 1;
        this.saveState();
        
        const privateBtn = document.getElementById('privateZoneBtn');
        if (privateBtn) {
            privateBtn.classList.remove('unlocked');
            privateBtn.querySelector('span').textContent = '个人区';
        }
        
        const publicZone = document.querySelector('.public-zone');
        const privateZone = document.querySelector('.private-zone');
        const publicPagination = document.getElementById('essay-pagination');
        
        // 添加隐藏动画类（个人区）
        if (privateZone) privateZone.classList.add('hiding');
        
        setTimeout(() => {
            if (publicZone) {
                publicZone.style.display = 'block';
                publicZone.classList.add('showing');
            }
            if (privateZone) {
                privateZone.style.display = 'none';
                privateZone.classList.remove('hiding', 'showing');
            }
            if (publicPagination) {
                publicPagination.style.display = 'block';
                publicPagination.classList.add('showing');
            }
            
            // 显示公开区的提示信息
            const publicTips = document.getElementById('bber-tips');
            if (publicTips) {
                publicTips.style.display = 'flex'; // 显示公开区提示
                // 确保提示信息是最新的
                this.updateTips();
            }
            
            // 重新初始化公开区瀑布流
            setTimeout(() => {
                this.initWaterfall();
            }, 200);
        }, 300);
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
        
        // 重新初始化瀑布流 - 增加延迟确保渲染完成
        setTimeout(() => {
            this.initWaterfall();
            this.isLoading = false;
        }, 200);
    },

    renderEssays: function(essays) {
        const waterfall = document.getElementById('waterfall_public');
        if (!waterfall) {
            console.error('❌ 公开区瀑布流容器未找到');
            return;
        }

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

        // ========== 图片处理部分 ==========
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

        // ========== 音乐播放器处理部分 ==========
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

        // ========== B站视频处理部分 ==========
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
        
        // ========== 智能日期处理部分 ==========
        // 这是最重要的修改部分！
        let dateDisplay;
        
        // 情况1：如果日期是中文（包含"年"、"月"、"日"等中文字符）
        if (typeof item.date === 'string' && /[年月日]/.test(item.date)) {
            // 直接使用原始的中文日期文字，不做任何处理
            dateDisplay = item.date;
            console.log('📅 检测到中文日期，直接显示:', dateDisplay);
        }
        // 情况2：如果有结束日期（date_end字段）
        else if (item.date_end) {
            // 处理日期范围，格式化为：2024/11/09-10
            const startDate = this.formatLocalDate(item.date);
            const endDate = this.formatLocalDate(item.date_end);
            // 提取结束日期的最后一部分（日）
            const endDay = endDate.split('/').pop();
            dateDisplay = `${startDate}-${endDay}`;
            console.log('📅 检测到日期范围，显示为:', dateDisplay);
        }
        // 情况3：普通的标准日期格式
        else {
            // 使用原有的日期格式化逻辑
            dateDisplay = this.formatLocalDate(item.date);
            console.log('📅 标准日期格式，显示为:', dateDisplay);
        }

        // ========== 生成HTML内容 ==========
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
                        <!-- 注意：这里使用 dateDisplay 而不是原来的 formattedDate -->
                        <time class="datatime" datetime="${item.date}">${dateDisplay}</time>
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

    // ========== 日期格式化方法 - 智能显示 ==========
    // 这个方法是用来处理标准日期格式的，中文日期不会进入这里
    formatLocalDate: function(dateStr) {
        // 先检查是不是中文日期，如果是就直接返回（安全检查）
        if (typeof dateStr === 'string' && /[年月日]/.test(dateStr)) {
            return dateStr;
        }
        
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
        
        // 使用特定的essay分页容器
        let paginationContainer = document.querySelector('#essay-pagination .pagination');
        
        // 如果分页容器不存在，创建它
        if (!paginationContainer) {
            // 先检查是否有 #essay-pagination 容器
            let paginationNav = document.getElementById('essay-pagination');
            if (!paginationNav) {
                paginationNav = document.createElement('nav');
                paginationNav.id = 'essay-pagination';
                const bberContainer = document.getElementById('bber');
                if (bberContainer) {
                    bberContainer.appendChild(paginationNav);
                }
            }
            
            // 创建 .pagination div
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            paginationNav.appendChild(paginationContainer);
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
        prevButton.onclick = () => this.prevPage();
        prevButton.href = 'javascript:void(0);';
        paginationContainer.appendChild(prevButton);

        // 添加页码
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('a');
            pageButton.className = `pagination-item ${i === this.currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.onclick = () => this.goToPage(i);
            pageButton.href = 'javascript:void(0);';
            paginationContainer.appendChild(pageButton);
        }

        // 添加下一页按钮
        const nextButton = document.createElement('a');
        nextButton.className = 'pagination-item pagination-next';
        nextButton.innerHTML = '下一页 &raquo;';
        nextButton.onclick = () => this.nextPage();
        nextButton.href = 'javascript:void(0);';
        paginationContainer.appendChild(nextButton);
    },

    createPaginationContainer: function() {
        // 这个方法现在在 renderPagination 中直接处理了
        return document.querySelector('#essay-pagination .pagination');
    },

    goToPage: function(page) {
        if (page < 1 || page > Math.ceil(this.allEssays.length / this.itemsPerPage)) {
            return;
        }

        // 标记是按钮点击操作，允许自动滚动
        this.isButtonClick = true;
        
        this.currentPage = page;
        this.saveState();
        this.renderPagination();
        this.renderCurrentPage();
        
        // 将翻页记录到浏览器历史中，支持返回/前进按钮
        try {
            history.pushState({
                essayPage: page,
                essayPrivatePage: this.privateCurrentPage,
                privateUnlocked: this.privateUnlocked
            }, '');
        } catch (e) {
            console.warn('History pushState failed:', e);
        }
        
        // 安全滚动到顶部（仅在用户未主动滚动时）
        setTimeout(() => {
            this.safeScrollToElement('bber', -100);
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
        // 只对当前可见的区域初始化瀑布流
        if (this.privateUnlocked) {
            // 个人区已解锁，只初始化个人区
            const privateWaterfall = document.getElementById('waterfall_private');
            if (privateWaterfall) {
                setTimeout(() => {
                    if (typeof window.waterfall === 'function') {
                        try {
                            window.waterfall('#waterfall_private');
                            setTimeout(() => {
                                privateWaterfall.classList.add('show');
                                privateWaterfall.style.opacity = '1';
                            }, 150);
                        } catch (error) {
                            console.error('❌ 个人区瀑布流布局错误:', error);
                        }
                    }
                }, 100);
            }
        } else {
            // 个人区未解锁，只初始化公开区
            const publicWaterfall = document.getElementById('waterfall_public');
            if (publicWaterfall) {
                setTimeout(() => {
                    if (typeof window.waterfall === 'function') {
                        try {
                            window.waterfall('#waterfall_public');
                            setTimeout(() => {
                                publicWaterfall.classList.add('show');
                                publicWaterfall.style.opacity = '1';
                            }, 150);
                        } catch (error) {
                            console.error('❌ 公开区瀑布流布局错误:', error);
                        }
                    }
                }, 100);
            }
        }
    },

    // 修改 saveState 和 restoreState 方法以包含个人区状态
    saveState: function() {
        try {
            sessionStorage.setItem('essayCurrentPage', this.currentPage.toString());
            sessionStorage.setItem('essayPrivateUnlocked', this.privateUnlocked.toString());
            sessionStorage.setItem('essayPrivateCurrentPage', this.privateCurrentPage.toString());
        } catch (e) {
            console.warn('⚠️ 状态保存失败:', e);
        }
    },

    restoreState: function() {
        try {
            // 从sessionStorage恢复状态
            const savedPage = parseInt(sessionStorage.getItem('essayCurrentPage'));
            if (savedPage && !isNaN(savedPage)) {
                this.currentPage = savedPage;
            }
            
            const savedUnlocked = sessionStorage.getItem('essayPrivateUnlocked');
            if (savedUnlocked === 'true') {
                this.privateUnlocked = true;
                const savedPrivatePage = parseInt(sessionStorage.getItem('essayPrivateCurrentPage'));
                if (savedPrivatePage && !isNaN(savedPrivatePage)) {
                    this.privateCurrentPage = savedPrivatePage;
                }
                // 恢复时也要正确显示/隐藏区域
                this.unlockPrivateZone();
            } else {
                // 确保公开区正常显示
                const publicZone = document.querySelector('.public-zone');
                const privateZone = document.querySelector('.private-zone');
                const publicPagination = document.getElementById('essay-pagination');
                
                if (publicZone) publicZone.style.display = 'block';
                if (privateZone) privateZone.style.display = 'none';
                if (publicPagination) publicPagination.style.display = 'block';
                
                // 确保公开区提示信息显示
                const publicTips = document.getElementById('bber-tips');
                if (publicTips) {
                    publicTips.style.display = 'flex';
                }
            }
        } catch (e) {
            console.warn('⚠️ 状态恢复失败:', e);
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

        // 新增：检测用户滚动行为，防止自动滚动干扰
        let scrollTimer;
        window.addEventListener('scroll', () => {
            // 记录用户滚动时间
            this.recordScrollTime();
            
            // 清除之前的滚动定时器（防止瀑布流频繁重算）
            clearTimeout(scrollTimer);
            
            // 滚动停止后300ms再重新计算瀑布流
            scrollTimer = setTimeout(() => {
                this.initWaterfall();
            }, 300);
        }, { passive: true });

        // 监听浏览器前进/后退按钮，恢复翻页状态（防止PJAX重复注册）
        if (this._popstateBound) {
            window.removeEventListener('popstate', this._popstateBound);
        }
        var self = this;
        this._popstateBound = function(e) {
            if (!self.isEssayPage()) return;
            
            if (e.state) {
                // 恢复个人区解锁状态（优先处理，会影响其他状态）
                if (e.state.privateUnlocked !== undefined && e.state.privateUnlocked !== self.privateUnlocked) {
                    self.privateUnlocked = e.state.privateUnlocked;
                    if (self.privateUnlocked) {
                        if (e.state.essayPrivatePage !== undefined) {
                            self.privateCurrentPage = e.state.essayPrivatePage;
                        }
                        self.unlockPrivateZone();
                    } else {
                        self.lockPrivateZone();
                    }
                    self.saveState();
                }
                
                // 恢复公开区页码
                if (e.state.essayPage !== undefined && e.state.essayPage !== self.currentPage) {
                    self.currentPage = e.state.essayPage;
                    self.saveState();
                    self.renderPagination();
                    self.renderCurrentPage();
                }
                
                // 恢复个人区页码（仅在已解锁时）
                if (e.state.essayPrivatePage !== undefined && e.state.essayPrivatePage !== self.privateCurrentPage && self.privateUnlocked) {
                    self.privateCurrentPage = e.state.essayPrivatePage;
                    self.saveState();
                    self.renderPrivatePagination();
                    self.renderPrivateCurrentPage();
                }
            }
        };
        window.addEventListener('popstate', this._popstateBound);
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

// 增强的初始化逻辑 - 确保在正确时机初始化
function initializeEssayManager() {
    // 等待所有资源加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 DOM内容加载完成，准备初始化短文管理器');
            setTimeout(() => {
                if (typeof essayManager !== 'undefined') {
                    essayManager.init();
                }
            }, 400);
        });
    } else {
        console.log('⚡ DOM已就绪，准备初始化短文管理器');
        setTimeout(() => {
            if (typeof essayManager !== 'undefined') {
                essayManager.init();
            }
        }, 400);
    }
}

// 立即开始初始化
initializeEssayManager();

// PJAX支持
if (typeof pjax !== 'undefined') {
    document.addEventListener('pjax:complete', function() {
        console.log('🔄 PJAX完成，重新初始化短文管理器');
        setTimeout(() => {
            if (typeof essayManager !== 'undefined') {
                essayManager.init();
            }
        }, 500);
    });
}

// 页面卸载前保存状态
window.addEventListener('beforeunload', function() {
    if (typeof essayManager !== 'undefined') {
        essayManager.saveState();
    }
});

// 新增：全局错误处理
window.addEventListener('error', function(e) {
    console.error('🌐 全局错误:', e.error);
});