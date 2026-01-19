// 自执行闭包，避免全局变量污染
(function () {
	// ========== 第一步：动态注入CSS样式 ==========
	const styleContent = `

    .bg-bubbles {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -5;
    }

    #bg-cvs-div {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -3;
		pointer-events: none;
    }

	#m-cvs-div {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
		pointer-events: none;
    }

    .bg-bubbles li {
		position: fixed;
		list-style: none;
		display: block;
		width: 40px;
		height: 40px;
		cursor: move;
		background-color: rgba(50, 230, 175, 0.75);
		border-radius: 10px;
		border-style: solid;
		border-width: 5px;
		border-color: rgba(35, 212, 159, 0.75);
		box-shadow: 0 0 0.5rem 0 #32e6af5e;
		bottom: -160px;
		-webkit-animation: square 35s infinite;
		-webkit-animation-fill-mode: both;
		-webkit-animation-play-state: running;
		animation: square 35s infinite;
		animation-fill-mode: both;
		animation-play-state: running;
		transition-timing-function: linear;
		transition: all 2s ease 0.5s;
		z-index: -4;
    }

    .bg-bubbles li:hover {
		-webkit-animation-play-state: paused;
		animation-play-state: paused;
		background-color: #ff8fffee;
		border-color: rgba(126, 33, 159, 0.75);
		box-shadow: 0 0 1.2rem 0 #ff8fff5e;
		opacity: 0.8;
    }

    .bg-bubbles li:nth-child(1) {
		left: 10%;
    }

    .bg-bubbles li:nth-child(2) {
		left: 20%;
		width: 80px;
		height: 80px;
		-webkit-animation-delay: 2s;
		animation-delay: 2s;
		-webkit-animation-duration: 17s;
		animation-duration: 17s;
    }

    .bg-bubbles li:nth-child(3) {
		left: 60%;
		-webkit-animation-delay: 4s;
		animation-delay: 4s;
    }

    .bg-bubbles li:nth-child(4) {
		left: 40%;
		width: 60px;
		height: 60px;
		-webkit-animation-duration: 22s;
		animation-duration: 22s;
		background-color: rgba(50, 230, 175, 0.25);
    }

    .bg-bubbles li:nth-child(5) {
		left: 70%;
    }

    .bg-bubbles li:nth-child(6) {
		left: 80%;
		width: 120px;
		height: 120px;
		-webkit-animation-delay: 3s;
		animation-delay: 3s;
		background-color: rgba(50, 230, 175, 0.2);
    }

    .bg-bubbles li:nth-child(7) {
		left: 32%;
		width: 160px;
		height: 160px;
		-webkit-animation-delay: 7s;
		animation-delay: 7s;
    }

    .bg-bubbles li:nth-child(8) {
		left: 55%;
		width: 20px;
		height: 20px;
		-webkit-animation-delay: 15s;
		animation-delay: 15s;
		-webkit-animation-duration: 40s;
		animation-duration: 40s;
    }

    .bg-bubbles li:nth-child(9) {
		left: 25%;
		width: 30px;
		height: 30px;
		-webkit-animation-delay: 2s;
		animation-delay: 2s;
		-webkit-animation-duration: 40s;
		animation-duration: 40s;
		background-color: rgba(50, 230, 175, 0.3);
    }

    .bg-bubbles li:nth-child(10) {
		left: 90%;
		width: 160px;
		height: 160px;
		-webkit-animation-delay: 11s;
		animation-delay: 11s;
    }

    @-webkit-keyframes square {
		0% {
			top: 110%;
			opacity: 0;
		}

		5% {
			opacity: 1;
		}

		80% {
			opacity: 0.2;
		}

		100% {
			transform: rotate(600deg);
			top: -10%;
			opacity: 0;
			border-color: rgba(33, 159, 121, 0);
			box-shadow: 0 0 0.1rem 0 #32e6b000;
		}
    }

    @keyframes square {
		0% {
			top: 110%;
			opacity: 0;
		}

		5% {
			opacity: 1;
		}

		80% {
			opacity: 0.2;
		}

		100% {
			transform: rotate(600deg);
			top: -50%;
			opacity: 0;
			border-color: rgba(33, 159, 121, 0);
		}
    }
	`;
	//先创建/复用utils命名空间
	window.bgState = window.bgState || {};

	// 创建style标签并插入head
	const style = document.createElement('style');
	style.textContent = styleContent;
	document.head.appendChild(style);

	//定义变量
	let bg_parts = []; // 粒子列表
	let m_parts = []; // 粒子列表
	let parts_MAX = 350;
	let fps = 0;
	let showFPS = false;

	let callbackFPS = null;



	// 方式3：解构赋值（减少重复书写utils，更简洁）
	//const { calculateSum, formatGreeting } = window.utils;

	window.bgState.getPartsLength = function () {
		return bg_parts.length + m_parts.length;
	};

	window.bgState.getFps = function () {
		return fps;
	};

	window.bgState.getParts_MAX = function () {
		return parts_MAX;
	};

	window.bgState.setParts_MAX = function (n) {
		if (typeof n === 'number') {
			parts_MAX = n;
		}
		return;
	};

	window.bgState.setShowFPS = function (n) {
		if (typeof n === 'boolean') {
			showFPS = n;
		}
		return;
	};

	window.bgState.setcallbackFPS = function (callback) {
		if (typeof callback === 'function') {
			callbackFPS = callback;
		}
	};

	// ========== 第二步：动态创建DOM元素 ==========
	function createDOMElements() {
		// 创建bg-b-div容器
		const bgBDiv = document.createElement('div');
		bgBDiv.id = 'bg-b-div';

		// 创建ul.bg-bubbles
		const bgBubblesUl = document.createElement('ul');
		bgBubblesUl.className = 'bg-bubbles';

		// 创建10个li元素
		for (let i = 0; i < 10; i++) {
			const li = document.createElement('li');
			li.id = 'bg-li';
			bgBubblesUl.appendChild(li);
		}
		bgBDiv.appendChild(bgBubblesUl);


		// 创建bg-cvs-div容器
		const bgCvsDiv = document.createElement('div');
		bgCvsDiv.id = 'bg-cvs-div';

		const mCvsDiv = document.createElement('div');
		mCvsDiv.id = 'm-cvs-div';

		// 创建canvas元素
		const bg_canvas = document.createElement('canvas');
		const m_canvas = document.createElement('canvas');

		bg_canvas.className = 'bg-cvs';
		bg_canvas.id = 'bg-cvs';
		m_canvas.className = 'm-cvs';
		m_canvas.id = 'm-cvs';

		bgCvsDiv.appendChild(bg_canvas);
		mCvsDiv.appendChild(m_canvas);

		// 将元素添加到body
		document.body.appendChild(bgBDiv);
		document.body.appendChild(bgCvsDiv);
		document.body.appendChild(mCvsDiv);
	}


	// ========== 第三步：核心交互逻辑 ==========
	function initAnimation() {

		let lis = []; // 浮动方形列表

		const bg_canvas = document.getElementById('bg-cvs'); // 画板
		const m_canvas = document.getElementById('m-cvs'); // 画板

		const bg_video = document.getElementById('bg-cvs-div'); // 父容器
		const m_video = document.getElementById('bg-cvs-div'); // 父容器
		let drawT = 100;
		const bg_ctx = bg_canvas.getContext('2d');
		const m_ctx = m_canvas.getContext('2d');
		let bg_cFrame;
		let m_cFrame;
		let fpsLastTime = 0;

		let mouseLastTime = 0; // 上一次移动鼠标创建粒子的时间戳
		let lastMx = 0; // 上一次创建粒子的鼠标X坐标
		let lastMy = 0; // 上一次创建粒子的鼠标Y坐标

		let currentMx = 0;
		let currentMy = 0;

		const MOVE_DISTANCE_THRESHOLD = 25; // 触发粒子创建的最小移动距离（像素）
		let isMouseDown = false; // 标记鼠标是否按下
		let longPressTimer = null; // 长按定时器，用于持续创建粒子

		let ontitle = 0; // 页面焦点状态
		const title = document.title;

		let max_FPS = 60;
		let text_umax = false

		// 粒子类
		class Particle {
			constructor(x, y) {
				this.x = x; // 坐标x值
				this.y = y; // 坐标y值
				this.r = 0; // 旋转度
				this.speedRate = 0.1; // 速率，用来控制粒子流动的快慢
				this.rotateRate = 0.3; // 速率，用来控制粒子旋转的快慢
				this.speedX = 0; // 速度在x方向上的增量
				this.speedY = -1; // 速度在y方向上的增量
				this.speedR = 0; //旋转速度
				this.lifetime = 80 + Math.random() * 60; // 粒子生命周期，每次更新都会减小
				this.nextX = x + this.speedX; // 接下来粒子的x坐标
				this.nextY = y + this.speedY; // 接下来粒子的y坐标
				this.nextR = this.r + this.speedR; // 接下来粒子的旋转

				this.t = 0; //绘制次数
				this.test = '0'; //显示的字
				this.op = 1; //透明度
				this.font = "rem serif"; //文字格式
				this.size_f = 15; // 文字大小

				this.lifetime_c = this.lifetime;
				this.isDivergence = true;
			}

			// 更新粒子的方法
			update() {
				this.x = this.nextX; // 更新x坐标
				this.y = this.nextY; // 更新y坐标
				this.r = this.nextR; // 更新旋转
				if (this.isDivergence) {
					this.speedX += (Math.random() * 2 - 1) * this.speedRate; // x方向增量
					this.speedY += (Math.random() * 2 - 1) * this.speedRate; // y方向增量
					this.speedR += (Math.random() * 2 - 1) * this.rotateRate;
				} else {
					this.speedX = this.speedX * (this.speedRate + Math.random() * 0.1); // x方向增量
					this.speedY = this.speedY * (this.speedRate + Math.random() * 0.1); // y方向增量
					this.speedR += (Math.random() * 2 - 1) * this.rotateRate;
				}

				this.nextX = this.x + this.speedX; // 计算接下来粒子的x坐标
				this.nextY = this.y + this.speedY; // 计算接下来粒子的y坐标
				this.nextR = this.r + this.speedR; // 计算接下来粒子的旋转

				this.lifetime--; // 生命周期减1
			}

			draw(ctx) {
				const { x, y, r, t } = this;
				if (t < 5) {
					this.t += 1;
				} else {
					if (this.test === '1' || this.test === "0" || this.test === "X") {
						if (Math.random() * 2 < 0.75) {
							this.test = ontitle !== 0 ? 'X' : '1';
						} else {
							this.test = '0';
						}
					}
					this.t = 0;
				}

				ctx.save();
				ctx.beginPath();
				ctx.fillStyle = `rgba(255,200,255,${this.op})`;
				// console.log(text_umax);

				if (text_umax) {
					ctx.font = `${this.size_f / 10 * (this.lifetime / this.lifetime_c)}vmax ${this.font}`;
				} else {
					ctx.font = `${this.size_f * (this.lifetime / this.lifetime_c)}px ${this.font}`;
				}
				ctx.translate(x, y);
				ctx.rotate(r * Math.PI / 180); // 旋转r度
				ctx.fillText(this.test, 0, 0);
				ctx.restore();
				ctx.closePath();
			}
		}

		// 添加粒子到列表
		function put_parts(p, list) {
			if (bg_parts.length + m_parts.length < parts_MAX) {
				list.push(p);
			}
		}

		// 计算FPS并动态调整粒子数

		function fps_C() {
			const now = performance.now();
			fps++;
			if (now - fpsLastTime > 1000) {
				// 自动限制粒子数
				if (fps > 55) {
					max_FPS = 60;
				} if (fps < 35) {
					max_FPS = 30;
				}
				if (parts_MAX > -10 && parts_MAX < 500) {
					parts_MAX += fps - max_FPS;
				}
				if (showFPS) {
					console.log(`FPS: ${fps} parts.length: ${bg_parts.length}|${m_parts.length}  parts_MAX: ${parts_MAX}`);
				}
				if (typeof callbackFPS === 'function') {
					callbackFPS(fps);
				}
				fps = 0;
				fpsLastTime = performance.now();
			}
		}

		// 重绘动画
		function redraw() {
			requestAnimationFrame(redraw);
			if (ontitle !== 0 && ontitle !== 3) {
				fpsLastTime = performance.now();
				return;
			}
			fps_C();

			if (drawT > 60) {
				bg_canvas.width = bg_video.offsetWidth;
				bg_canvas.height = bg_video.offsetHeight; // 填满屏幕

				m_canvas.width = m_video.offsetWidth;
				m_canvas.height = m_video.offsetHeight; // 填满屏幕

				bg_cFrame = bg_canvas.getBoundingClientRect(); // 获取画板矩形
				m_cFrame = m_canvas.getBoundingClientRect(); // 获取画板矩形

				if (bg_canvas.width > 1000) {
					text_umax = true;
				} else {
					text_umax = false;
				}
				drawT = 0;
			}
			drawT += 1;

			// 填充画布
			// bg_ctx.fillStyle = 'rgba(28,17,41,1)';

			// bg_ctx.fillRect(0, 0, cFrame.width, cFrame.height);
			bg_ctx.clearRect(0, 0, bg_canvas.width, bg_canvas.height);
			m_ctx.clearRect(0, 0, m_canvas.width, m_canvas.height);
			// bg_ctx.fill();

			// 矩形粒子产生
			if (drawT % 10 === 1) {
				const wh = window.innerHeight;
				for (const li of lis) {
					if (Math.random() * 2 > 1.2) {
						const h = li.offsetHeight;
						const y = li.offsetTop + li.clientHeight * 1.1;
						const x = li.offsetLeft + (li.offsetWidth / 2);
						const p = new Particle(x, y);
						p.speedY = 0.2;
						p.speedX = (Math.random() - 0.5) * 0.5;
						p.speedRate = 0.1;
						p.size_f = 10 + (Math.random() - 0.5) * 1.5;
						p.lifetime = parseInt(150 + Math.random() * 50);
						p.lifetime_c = p.lifetime;
						p.op = li.offsetTop * 1.5 / wh;
						put_parts(p, bg_parts);
					}
				}
			}

			// ========== 绘制/更新矩形粒子（底层画布） ==========
			for (const part of bg_parts) {
				part.draw(bg_ctx); // 绘制到矩形粒子画布
				part.update();
				// 移除生命周期结束的粒子（性能优化）
				if (part.lifetime <= 0) {
					bg_parts.splice(bg_parts.indexOf(part), 1);
				}
			}

			// ========== 绘制/更新其他粒子（上层画布） ==========
			for (const part of m_parts) {
				part.draw(m_ctx); // 绘制到其他粒子画布
				part.update();
				// 移除生命周期结束的粒子（性能优化）
				if (part.lifetime <= 0) {
					m_parts.splice(m_parts.indexOf(part), 1);
				}
			}

		}

		// 鼠标事件处理
		function mouseC() {
			// 鼠标按下
			document.addEventListener('mousedown', function (event) {
				if (ontitle !== 0 && ontitle !== 3) return;

				isMouseDown = true;
				currentMx = event.clientX;
				currentMy = event.clientY;

				lastMx = currentMx;
				lastMy = currentMx;
				put_parts(new Particle(currentMx, currentMy), m_parts);

				// 启动长按定时器
				if (longPressTimer) clearInterval(longPressTimer);
				longPressTimer = setInterval(() => {
					if (!isMouseDown || (ontitle !== 0 && ontitle !== 3)) {
						clearInterval(longPressTimer);
						return;
					}
					p = new Particle(currentMx - 3, currentMy + 8);
					p.speedX = (Math.random() - 0.5) * 8;
					p.speedY = (Math.random() - 0.5) * 8;
					p.speedRate = 0.93;
					p.size_f = 13 - Math.random() * 0.5;
					p.test = Math.random() > 0.98 ? "喵" : "0";
					p.isDivergence = false;
					p.op = 0.8
					put_parts(p, m_parts);
				}, 50);
			});

			// 鼠标松开
			document.addEventListener('mouseup', function () {
				isMouseDown = false;
				if (longPressTimer) {
					clearInterval(longPressTimer);
					longPressTimer = null;
				}
			});

			// 鼠标离开文档
			document.addEventListener('mouseleave', function () {
				isMouseDown = false;
				if (longPressTimer) {
					clearInterval(longPressTimer);
					longPressTimer = null;
				}
			});

			// 鼠标移动
			document.addEventListener('mousemove', function (event) {
				currentMx = event.clientX;
				currentMy = event.clientY;
				const ti = performance.now() - mouseLastTime;
				if (ti < 30) return;
				if (ontitle !== 0 && ontitle !== 3) return;

				if (ti < 500) {
					const moveDistance = Math.hypot(currentMx - lastMx, currentMy - lastMy);
					if (moveDistance < MOVE_DISTANCE_THRESHOLD && (lastMx !== 0 || lastMy !== 0)) {
						return;
					}
				}

				mouseLastTime = performance.now();

				lastMx = currentMx;
				lastMy = currentMy;
				const p = new Particle(currentMx - 7, currentMy + 10)
				p.op = 0.8
				put_parts(p, m_parts);
			});
		}

		// 绑定DOM元素
		function elementBinding() {
			const box = document.getElementById('bg-b-div');
			const li = box.getElementsByTagName('li');
			lis = Array.from(li);
		}

		// 页面焦点事件
		function bindFocusEvents() {
			// 窗口获得焦点
			window.addEventListener('focus', function () {
				function timeoutTxt() {
					if (ontitle === 3) {
						document.title = title;
						fpsLastTime = performance.now();
						ontitle = 0;
					}
				}
				if (ontitle === 0) return;
				document.title = '数据恢复中';
				setTimeout(timeoutTxt, ontitle === 1 ? 2000 : 10000);
				ontitle = 3;
			});

			// 窗口失去焦点
			window.addEventListener('blur', function () {
				function timeoutTxt() {
					if (ontitle === 1) {
						ontitle = 2;
						document.title = '数据丢失 X(';
					}
				}
				ontitle = 1;
				document.title = '阿,不要离开';
				setTimeout(timeoutTxt, 3000);
			});
		}

		// 主初始化函数
		function main() {
			bg_cFrame = m_canvas.getBoundingClientRect(); // 获取画板矩形
			m_cFrame = m_canvas.getBoundingClientRect(); // 获取画板矩形
			bg_ctx.clearRect(0, 0, bg_canvas.width, bg_canvas.height);
			m_ctx.clearRect(0, 0, m_canvas.width, m_canvas.height);
			elementBinding(); // 绑定元素
			mouseC(); // 绑定鼠标事件
			bindFocusEvents(); // 绑定焦点事件
			redraw(); // 启动动画循环
		}

		// 执行主函数
		main();
	}

	// ========== 第四步：初始化流程 ==========
	// 确保DOM加载完成后执行
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		createDOMElements();
		initAnimation();
	} else {
		document.addEventListener('DOMContentLoaded', function () {
			createDOMElements();
			initAnimation();
		});
	}
})();