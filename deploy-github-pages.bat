@echo off
echo 🚀 Deploying Blood Donor System to GitHub Pages...
echo.

echo Step 1: Building React app...
cd client
call npm run build
cd ..

echo Step 2: Installing gh-pages package...
npm install --save-dev gh-pages

echo Step 3: Deploying to GitHub Pages...
npx gh-pages -d client/build

echo.
echo ✅ Deployment complete!
echo 🌐 Your site will be live at: https://prince-kumar1.github.io/life-connect-blood-donation
echo.
pause