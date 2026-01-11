import http.server
import socketserver
import os
from pathlib import Path

# ===================== 配置项（请修改这里）=====================
PORT = 8000  # 服务端口，若被占用可改为8080/9000等
# 替换为你的项目绝对路径（示例：Windows用C:\\Users\\xxx\\my_project，macOS/Linux用/Users/xxx/my_project）
PROJECT_ROOT = Path("E:\\GitHub Pages\\linghub.github.io")
# ==============================================================

# 校验项目路径是否存在
if not PROJECT_ROOT.exists():
    raise FileNotFoundError(f"错误：项目路径不存在 → {PROJECT_ROOT}")

# 切换工作目录到项目根目录（核心：让Web服务以该目录为根）
os.chdir(PROJECT_ROOT)

# 定义HTTP请求处理器（提供静态文件服务）
Handler = http.server.SimpleHTTPRequestHandler

# 解决端口占用时的"Address already in use"问题
socketserver.TCPServer.allow_reuse_address = True

# 启动服务器
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("=" * 50)
    print(f"✅ Web服务已启动")
    print(f"🌐 访问地址：http://localhost:{PORT}")
    print(f"📂 项目根目录：{PROJECT_ROOT.absolute()}")
    print("💡 提示：按 Ctrl+C 可停止服务")
    print("=" * 50)
    try:
        httpd.serve_forever()  # 持续运行服务
    except KeyboardInterrupt:
        # 捕获Ctrl+C，优雅停止服务
        print("\n🛑 服务已手动停止")
        httpd.server_close()