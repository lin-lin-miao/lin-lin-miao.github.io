@echo off
setlocal enabledelayedexpansion
chcp 936 >nul


cls


date /T 
time /T 

echo ��ǰ�汾1.0.0 
echo -------------------- 

if "%1"=="" (
    echo ��Ч���� 
    goto end
)

if "%1"=="���ڿ���" (
    echo ��˵���ڿ����� 
    REM ���������ӹ��ܵľ������
) else if "%1"=="ping" (
    echo �������Ӽ�� 
    ping www.bilibili.com
    echo.
    echo ���������Ӽ�� 
	ping "%2"
    goto end
) else if "%1"=="��java" (
    echo java��: 
	where java
    goto end
) else if "%1"=="ˢ��DNS" (
    echo ˢ��DNS 
	ipconfig /flushdns
    goto end
) else if "%1"=="����ʹ�����" (
    echo CPU ʹ����:
    wmic cpu get loadpercentage
    echo.
    echo �ڴ�ʹ�����:
    wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value
    echo.
    echo �Կ���ؽ���:
    tasklist | findstr /i "dwm.exe nvdisplay.container.exe"
    echo.
    goto end
) else (
    echo ��Ч�Ĳ��� %1 
    echo ��ǰ�汾1.0.0 
    goto end
)

:end
echo -------------------- 
echo ִ����� 
echo ��������˳� 
pause > nul

:end_h
echo ִ����� 
exit