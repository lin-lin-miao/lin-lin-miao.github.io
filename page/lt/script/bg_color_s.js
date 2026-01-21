
const more_set = document.querySelector('.more_set');
let is_show_more_set = false;
const bg_color_in = document.getElementById('bg_color_in');
const bg_tran_in = document.getElementById('bg_tran_in');

const MAX_SATURATION = 0.2

// 2. 监听颜色选择器的change事件（颜色改变时触发）
bg_color_in.addEventListener('change', change_box_bg);
bg_tran_in.addEventListener('change', change_box_bg);

function show_color_input() {
	is_show_more_set = !is_show_more_set
	if (is_show_more_set) {
		more_set.style.display = "";
	} else {
		more_set.style.display = "none";
	}
}

function change_box_bg() {
	const boxElements = document.querySelectorAll('.box_bg');
	const hexColor = bg_color_in.value; // 获取十六进制颜色（如#ff0000）
	const opacity = bg_tran_in.value;
	const rgb = hexToRgb(hexColor); // 转成RGB数值

	// 1. 判断是否是白色/黑色（豁免饱和度检查）
	const isWhite = hexColor === '#ffffff' || hexColor === '#fff';
	const isBlack = hexColor === '#000000' || hexColor === '#000';

	let finalRgb;
	if (isWhite || isBlack) {
		// 白/黑直接使用
		finalRgb = hexToRgb(hexColor);
	} else {
		// 2. 非白/黑：转HSV判断饱和度
		const rgb = hexToRgb(hexColor);
		const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

		if (hsv.s > MAX_SATURATION) {
			// 饱和度超标：提示+自动降低饱和度到阈值
			// saturationTip.style.display = 'block';
			// 降饱和后转回RGB
			console.log("饱和度超标");

			finalRgb = hsvToRgb(hsv.h, MAX_SATURATION, hsv.v);
		} else {
			// 饱和度合规：直接使用
			finalRgb = rgb;
		}
	}

	// 3. 为每个box_bg设置带固定透明度的背景色
	boxElements.forEach(box => {
		box.style.backgroundColor = `rgba(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b}, ${opacity})`;

		// 文字颜色自动切换（基于最终颜色的深浅）
		const finalHex = rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
		bg_color_in.value = finalHex;
		box.style.color = isDarkColor(finalHex) ? '#fff' : '#000';
	});
}

// 工具函数1：十六进制转RGB（兼容简写）
function hexToRgb(hex) {
	const fullHex = hex.length === 4
		? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
		: hex;
	return {
		r: parseInt(fullHex.slice(1, 3), 16),
		g: parseInt(fullHex.slice(3, 5), 16),
		b: parseInt(fullHex.slice(5, 7), 16)
	};
}

// 工具函数2：RGB转HSV（核心：计算饱和度）
function rgbToHsv(r, g, b) {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0, s = 0, v = max;

	const d = max - min;
	s = max === 0 ? 0 : d / max;

	if (max !== min) {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return { h, s, v };
}

// 工具函数3：HSV转RGB（用于降饱和后转回）
function hsvToRgb(h, s, v) {
	let r, g, b;
	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: r = v; g = t; b = p; break;
		case 1: r = q; g = v; b = p; break;
		case 2: r = p; g = v; b = t; break;
		case 3: r = p; g = q; b = v; break;
		case 4: r = t; g = p; b = v; break;
		case 5: r = v; g = p; b = q; break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

// 工具函数4：RGB转十六进制（用于文字颜色判断）
function rgbToHex(r, g, b) {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// 工具函数5：判断颜色深浅（用于文字切换）
function isDarkColor(hexColor) {
	const rgb = hexToRgb(hexColor);
	const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	return brightness < 128;
}

function reset_color() {
	bg_color_in.value = "#ffffff";
	bg_tran_in.value = 0.8;
	change_box_bg();
}