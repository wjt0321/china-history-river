@echo off
cd /d D:\china-history-river
rmdir /s /q .deploy 2>nul
mkdir .deploy
xcopy /e /i /y dist .deploy >nul
echo.> .deploy\.nojekyll
cd /d D:\china-history-river\.deploy
git init
git checkout -b gh-pages
git add .
git -c user.name=wjt0321 -c user.email=email@wxbfnnas.asia commit -m "Deploy GitHub Pages"
git remote add origin https://github.com/wjt0321/china-history-river.git
set HTTP_PROXY=http://127.0.0.1:10808
set HTTPS_PROXY=http://127.0.0.1:10808
git push -f origin gh-pages
