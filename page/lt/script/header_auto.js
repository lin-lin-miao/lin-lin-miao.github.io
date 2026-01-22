
//标题菜单底部留空
window.head_page = window.head_page || {};
let title_menu = document.querySelector('.title_menu')
let title_menu_bottom = document.querySelector('.title_menu_bottom')

const main_view = document.getElementById('main_view')

//侧边栏位置设定
const main_page_for_side_r = document.querySelector('.main_page_for_side_r');
const main_page_for_side_l = document.querySelector('.main_page_for_side_l');

const main_side_r = document.querySelector('.main_side_r');
const main_side_l = document.querySelector('.main_side_l');

const side_r = document.querySelector('.side_r');
const side_l = document.querySelector('.side_l');

let main_view_scroll = false;
let window_view_scroll = false;

// 标记是否已移动
let side_isMoved = false;

window.head_page.get_title_menu = function () {
	return title_menu;
};

window.head_page.get_title_menu_bottom = function () {
	return title_menu_bottom;
};

window.head_page.is_l_side_show = false;
window.head_page.is_r_side_show = false;
window.head_page.is_show_title = true;

window.head_page.title_h = '0px';

window.head_page.div_show = function (params) {
	params.classList.remove('fade-out');
	params.style.display = '';
	params.classList.add('fade-in');
}

window.head_page.div_hidden = function (params) {
	params.classList.remove('fade-in')
	params.classList.add('fade-out')
	setTimeout(() => {
		params.style.display = 'none';
	}, 900);
	
}

window.head_page.show_r_side = function () {
	window.head_page.is_r_side_show = !window.head_page.is_r_side_show;
	if (window.head_page.is_r_side_show) {
		// main_side_r.classList.remove('fade-out')
		// main_page_for_side_r.classList.remove('fade-out')
		// main_page_for_side_r.style.display = '';
		// main_side_r.style.display = '';
		// main_side_r.classList.add('fade-in')
		// main_page_for_side_r.classList.add('fade-in')
		window.head_page.div_show(main_side_r)
		window.head_page.div_show(main_page_for_side_r)
	} else {
		// main_side_r.classList.remove('fade-in')
		// main_page_for_side_r.classList.remove('fade-in')
		// main_side_r.classList.add('fade-out')
		// main_page_for_side_r.classList.add('fade-out')


		// setTimeout(() => {
		// 	main_side_r.style.display = 'none';
		// 	main_page_for_side_r.style.display = 'none';
		// }, 900);
		window.head_page.div_hidden(main_side_r)
		window.head_page.div_hidden(main_page_for_side_r)
	}
}
window.head_page.show_l_side = function () {
	window.head_page.is_l_side_show = !window.head_page.is_l_side_show;
	if (window.head_page.is_l_side_show) {


		main_side_l.classList.remove('fade-out')
		main_page_for_side_l.classList.remove('fade-out')
		main_page_for_side_l.style.display = '';
		main_side_l.style.display = '';
		main_side_l.classList.add('fade-in')
		main_page_for_side_l.classList.add('fade-in')
	} else {

		main_side_l.classList.add('fade-out')
		main_page_for_side_l.classList.add('fade-out')
		main_side_l.classList.remove('fade-in')
		main_page_for_side_l.classList.remove('fade-in')


		setTimeout(() => {
			main_side_l.style.display = 'none';
			main_page_for_side_l.style.display = 'none';
		}, 900);
	}
}

// 节流函数：优化scroll事件性能（每16ms触发一次，约60帧）
function throttle(fn, delay = 16) {
	let timer = null;
	return function (...args) {
		if (!timer) {
			timer = setTimeout(() => {
				fn.apply(this, args);
				timer = null;
			}, delay);
		}
	};
}

window.addEventListener('scroll', throttle(handlePageScroll));

main_view.addEventListener('scroll', throttle(sideScroll()));

function sideScroll() {
	if (!main_view_scroll) return;
	// 1. 计算源元素的滚动比例（相对滚动高度）
	// scrollTop：已滚动的垂直距离
	// scrollHeight：元素内容的总高度（包括不可见部分）
	// clientHeight：元素可视区域的高度
	const scrollRatio = this.scrollTop / (this.scrollHeight - this.clientHeight);

	// 2. 根据比例计算目标元素应滚动的距离（单向同步核心）
	// 避免除以0（当内容高度≤可视高度时，scrollRatio为0）
	const side_rScrollTop = scrollRatio * (side_r.scrollHeight - side_r.clientHeight) || 0;
	const side_lScrollTop = scrollRatio * (side_l.scrollHeight - side_l.clientHeight) || 0;

	// 3. 设置目标元素的滚动位置（实现同步）
	side_r.scrollTop = side_rScrollTop;
	side_l.scrollTop = side_lScrollTop;
}

let lastPageScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
// 页面滚动监听逻辑（核心）
function handlePageScroll() {

	// 1. 获取当前页面滚动位置
	const currentPageScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	const pageScrollHEIGHT = document.documentElement.scrollHeight || document.body.scrollHeight;
	try {
		if (currentPageScrollTop / pageScrollHEIGHT > 0.1) {
			document.getElementById('rside_tool').style.opacity = '1';
		} else {
			document.getElementById('rside_tool').style.opacity = '0';
		}
	} catch (error) {

	}
	if (!window_view_scroll) return

	// 2. 计算本次滚动的增量（正数=向下滚，负数=向上滚）
	const scrollDelta = currentPageScrollTop - lastPageScrollTop;

	// 3. 仅当有滚动增量时，让目标容器跟随滚动
	if (scrollDelta !== 0) {
		// scrollBy(x, y)：基于当前位置滚动指定增量（核心方法）
		// x=0：横向无滚动，y=scrollDelta：纵向滚动对应增量
		side_l.scrollBy(0, scrollDelta / 5);
		side_r.scrollBy(0, scrollDelta / 5);
	}

	// 4. 更新上一次滚动位置，为下一次计算增量做准备
	lastPageScrollTop = currentPageScrollTop;
}


function syncHeight() {
	if (!window.head_page.is_show_title) return;
	window.head_page.title_h = (title_menu.offsetHeight + 16) + 'px'
	title_menu_bottom.style.height = window.head_page.title_h;
	side_r.style.top = window.head_page.title_h;
	side_l.style.top = window.head_page.title_h;
}

function setSide() {
	let screenWidth = window.innerWidth;
	// 小屏：移动到目标容器
	if (screenWidth < 1000 && !side_isMoved) {
		if (side_r && main_page_for_side_r) main_page_for_side_r.appendChild(side_r);
		if (side_l && main_page_for_side_l) main_page_for_side_l.appendChild(side_l);
		if (window.head_page.is_r_side_show) {
			main_page_for_side_r.style.display = ""
		} else {
			main_page_for_side_r.style.display = "none"
		}
		if (window.head_page.is_l_side_show) {
			main_page_for_side_l.style.display = ""
		} else {
			main_page_for_side_l.style.display = "none"
		}
		side_isMoved = true;
	}
	// 大屏：还原到原位置
	else if (screenWidth >= 1000 && side_isMoved) {
		// 注意：这里假设原位置是侧边栏的兄弟元素之前/之后，你可根据实际调整
		if (side_r) main_side_r.appendChild(side_r);
		if (side_l) main_side_l.appendChild(side_l);
		if (window.head_page.is_r_side_show) {
			main_side_r.style.display = ""
		} else {
			main_side_r.style.display = "none"
		}
		if (window.head_page.is_l_side_show) {
			main_side_l.style.display = ""
		} else {
			main_side_l.style.display = "none"
		}
		side_isMoved = false;
	}
}

// setSide()
document.addEventListener('headerLoaded', () => {
	title_menu = document.querySelector('.title_menu');
	title_menu_bottom = document.querySelector('.title_menu_bottom');
	syncHeight();
	window.addEventListener('resize', syncHeight);
});

window.addEventListener('resize', setSide);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	setSide()
} else {
	document.addEventListener('DOMContentLoaded', function () {
		setSide()
	});
}
// ========== 可选：处理动态添加的a标签（比如后续JS生成的） ==========
// 如果页面会动态新增a标签，用事件委托更高效（推荐）
document.addEventListener('click', function (event) {
	// 判断点击的元素是否是a标签
	if (event.target.tagName === 'a') {
		// event.preventDefault();
		// 执行通用脚本
		// console.log(`动态a标签：准备跳转到${event.target.href}`);
		title_menu_bottom.style.height = '100vh';
		setTimeout(() => {
			window.location.href = event.target.href;
		}, 1000);
	}
});