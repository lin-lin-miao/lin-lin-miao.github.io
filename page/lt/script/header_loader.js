(function () {
	async function loadHeader() {
		try {
			// 读取header.html文件内容
			const response = await fetch('header.html');
			if (!response.ok) {
				throw new Error(`加载失败：${response.status}`);
			}
			const html = await response.text();
			// 将组件内容插入到容器中
			const hc = document.getElementById('header-container')
			hc.innerHTML = html;
			hc.style.height = '';
		} catch (error) {
			// 加载失败时的降级处理（避免页面空白）
			console.error('加载头部出错：', error);
			document.getElementById('header-container').innerHTML = `
        <header style="padding: 20px; background: #f5f5f5;">
            <h1>如果你看到这个,那就是出错啦</h1>
        </header>
        `;
		} finally {
			document.dispatchEvent(new CustomEvent('headerLoaded'));
		}
	}

	// 页面加载完成后执行加载
	window.onload = loadHeader;
})();