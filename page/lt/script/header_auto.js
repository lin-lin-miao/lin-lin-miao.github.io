
//标题菜单底部留空
window.head_page = window.head_page || {};
let title_menu = document.querySelector('.title_menu')
let title_menu_bottom = document.querySelector('.title_menu_bottom')


//侧边栏位置设定
const main_page_for_side_r = document.querySelector('.main_page_for_side_r');
const main_page_for_side_l = document.querySelector('.main_page_for_side_l');

const main_side_r = document.querySelector('.main_side_r');
const main_side_l = document.querySelector('.main_side_l');

const side_r = document.querySelector('.side_r');
const side_l = document.querySelector('.side_l');

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


function syncHeight() {
	if(!window.head_page.is_show_title) return;
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
		if(window.head_page.is_r_side_show) {
			main_page_for_side_r.style.display = ""
		}else{
			main_page_for_side_r.style.display = "none"
		}
		if(window.head_page.is_l_side_show) {
			main_page_for_side_l.style.display = ""
		}else{
			main_page_for_side_l.style.display = "none"
		}
		side_isMoved = true;
	}
	// 大屏：还原到原位置
	else if (screenWidth >= 1000 && side_isMoved) {
		// 注意：这里假设原位置是侧边栏的兄弟元素之前/之后，你可根据实际调整
		if (side_r) main_side_r.appendChild(side_r);
		if (side_l) main_side_l.appendChild(side_l);
		if(window.head_page.is_r_side_show) {
			main_side_r.style.display = ""
		}else{
			main_side_r.style.display = "none"
		}
		if(window.head_page.is_l_side_show) {
			main_side_l.style.display = ""
		}else{
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