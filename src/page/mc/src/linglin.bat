@echo off
setlocal enabledelayedexpansion
chcp 936 >nul


cls


date /T 
time /T 

echo 当前版本1.0.0 
echo -------------------- 

if "%1"=="" (
    echo 无效命令 
    goto end
)

if "%1"=="还在开发" (
    echo 都说还在开发惹 
    REM 这里可以添加功能的具体代码
) else if "%1"=="ping" (
    echo 网络连接检查 
    ping www.bilibili.com
    echo.
    echo 服务器连接检查 
	ping "%2"
    goto end
) else if "%1"=="找java" (
    echo java在: 
	where java
    goto end
) else if "%1"=="刷新DNS" (
    echo 刷新DNS 
	ipconfig /flushdns
    goto end
) else if "%1"=="电脑使用情况" (
    echo CPU 使用率:
    wmic cpu get loadpercentage
    echo.
    echo 内存使用情况:
    wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value
    echo.
    echo 显卡相关进程:
    tasklist | findstr /i "dwm.exe nvdisplay.container.exe"
    echo.
    goto end
) else (
    echo 无效的参数 %1 
    echo 当前版本1.0.0 
    goto end
)

:end
echo -------------------- 
echo 执行完成 
echo 按任意键退出 
pause > nul

:end_h
echo 执行完成 
exit