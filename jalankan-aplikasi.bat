@echo off
title E-Penjurian WIA & KRENOVA Wonogiri 2026
echo ========================================================
echo   E-PENJURIAN WIA & KRENOVA KABUPATEN WONOGIRI 2026
echo   Bidang Riset dan Inovasi Daerah - Bapperida
echo ========================================================
echo.
echo Memulai server penjurian lokal...
echo Akses aplikasi melalui browser di: http://localhost:3000
echo.
echo Jika ingin diakses dari tablet / laptop juri via Wi-Fi lokal:
echo Cari IP laptop ini dengan 'ipconfig' (misal: http://192.168.1.XX:3000)
echo.
echo Tekan Ctrl+C untuk menghentikan server.
echo ========================================================
echo.

node node_modules\next\dist\bin\next start -p 3000

pause
