(function () {
	const styleContent = `
	/* Toast 专属样式 */
	.toast-container {
		/* 固定定位，始终在屏幕中间 */
		position: fixed;
		top: 85%;
		left: 50%;
		max-width: 80%;
		transform: translate(-50%, -50%) scale(0.8);
		/* 初始缩小，配合动画 */
		-webkit-transform: translate(-50%, -50%) scale(0.8);
		border: rgba(133, 133, 133, 0.7) solid 4px;
		/* 样式美化 */
		background: rgba(0, 0, 0, 0.75);
		/* 半透黑背景，适配各种场景 */
		color: #fff;
		font-size: 16px;
		padding: 12px 20px;
		border-radius: 8px;
		/* 层级置顶，避免被遮挡 */
		z-index: 999;
		/* 文字居中 */
		text-align: center;
		/* 可以换行 */
		white-space: normal;
		/* 过渡动画：让显示/隐藏更流畅 */
		transition: all 0.3s ease;
		/* 初始隐藏 */
		opacity: 0;
		pointer-events: none;
		/* 不触发鼠标事件，不影响页面操作 */
	}

	/* Toast 显示状态 */
	.toast-container.show {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
		/* 恢复正常大小 */
		-webkit-transform: translate(-50%, -50%) scale(1);
	}
	`
	const style = document.createElement('style');
	style.textContent = styleContent;
	document.head.appendChild(style);
})();

/**
 * 显示 Toast 提示
 * @param {string} text - 要显示的文字（必填）
 * @param {number} duration - 显示时长（毫秒，可选，默认 2000ms）
 */
function showToast(text, duration = 2000) {
	// 1. 校验参数：文字为空则直接返回
	if (!text || typeof text !== 'string') {
		// console.warn('Toast 显示文字不能为空，且必须为字符串');
		return;
	}
	// 2. 清除页面中已存在的 Toast（避免重复显示）
	const oldToast = document.querySelector('.toast-container');
	if (oldToast) {
		clearTimeout(oldToast.timer); // 清除旧的定时器
		oldToast.remove(); // 移除旧元素
	}

	// 3. 创建 Toast 元素
	const toast = document.createElement('div');
	toast.className = 'toast-container'; // 添加样式类
	// toast.textContent = text; // 设置显示文字

	if (typeof text === 'string') {
		// 字符串（含 HTML 字符串）：用 innerHTML 渲染
		toast.innerHTML = text;
	} else if (text instanceof HTMLElement) {
		// DOM 元素：直接插入到 Toast 容器
		toast.appendChild(text);
	} else {
		// 其他类型：转为字符串处理
		toast.textContent = String(text);
		console.warn('Toast 内容建议使用字符串或 DOM 元素，已自动转为字符串');
	}

	// 4. 插入到 body 中
	document.body.appendChild(toast);

	// 5. 触发显示动画（需延迟一小段时间，让浏览器渲染元素后再加类）
	setTimeout(() => {
		toast.classList.add('show');
	}, 10);

	// 6. 定时隐藏并移除 Toast
	toast.timer = setTimeout(() => {
		toast.classList.remove('show'); // 移除显示类，触发隐藏动画
		// 动画结束后移除元素
		setTimeout(() => {
			toast.remove();
		}, 300); // 与 CSS 中 transition 时长一致
	}, duration);
}