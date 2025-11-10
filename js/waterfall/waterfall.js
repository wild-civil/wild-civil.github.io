function waterfall(container) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (!container) return;

    // 重置所有子元素
    const items = Array.from(container.children);
    items.forEach(item => {
        item.style.position = '';
        item.style.top = '';
        item.style.left = '';
    });

    // 重置容器高度
    container.style.height = '';

    function getMargin(direction, element) {
        const style = window.getComputedStyle(element);
        return parseFloat(style[`margin${direction}`]) || 0;
    }

    function toPx(value) {
        return value + 'px';
    }

    function getTop(element) {
        return parseFloat(element.style.top) || 0;
    }

    function getLeft(element) {
        return parseFloat(element.style.left) || 0;
    }

    function getWidth(element) {
        return element.clientWidth;
    }

    function getHeight(element) {
        return element.clientHeight;
    }

    function getBottom(element) {
        return getTop(element) + getHeight(element) + getMargin('Bottom', element);
    }

    function getRight(element) {
        return getLeft(element) + getWidth(element) + getMargin('Right', element);
    }

    function sortByBottom(elements) {
        return elements.sort((a, b) => {
            const bottomA = getBottom(a);
            const bottomB = getBottom(b);
            return bottomA === bottomB ? getLeft(b) - getLeft(a) : bottomB - bottomA;
        });
    }

    const positionedItems = items.map(item => {
        item.style.position = 'absolute';
        return item;
    });

    container.style.position = 'relative';

    const columns = [];
    
    if (positionedItems.length === 0) return;

    // 设置第一个元素
    positionedItems[0].style.top = '0px';
    positionedItems[0].style.left = toPx(getMargin('Left', positionedItems[0]));
    columns.push(positionedItems[0]);

    // 布局其他元素
    for (let i = 1; i < positionedItems.length; i++) {
        const prevItem = positionedItems[i - 1];
        const currentItem = positionedItems[i];
        
        const wouldFit = getRight(prevItem) + getWidth(currentItem) <= getWidth(container);
        
        if (!wouldFit) break;
        
        currentItem.style.top = prevItem.style.top;
        currentItem.style.left = toPx(getRight(prevItem) + getMargin('Left', currentItem));
        columns.push(currentItem);
    }

    // 处理剩余元素
    for (let i = columns.length; i < positionedItems.length; i++) {
        sortByBottom(columns);
        const shortestColumn = columns.pop();
        const currentItem = positionedItems[i];
        
        currentItem.style.top = toPx(getBottom(shortestColumn) + getMargin('Top', currentItem));
        currentItem.style.left = toPx(getLeft(shortestColumn));
        columns.push(currentItem);
    }

    // 设置容器高度
    sortByBottom(columns);
    const tallestColumn = columns[0];
    container.style.height = toPx(getBottom(tallestColumn) + getMargin('Bottom', tallestColumn));

    // 响应式处理
    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            waterfall(container);
        }, 250);
    }

    if (window.addEventListener) {
        window.addEventListener('resize', handleResize);
    } else {
        window.onresize = handleResize;
    }
}