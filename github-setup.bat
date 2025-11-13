@echo off
echo Setting up Git repository for Prince-kumar1/life-connect-blood-donation...
echo.

echo Step 1: Initialize Git repository
git init

echo Step 2: Add all files to Git
git add .

echo Step 3: Create initial commit
git commit -m "🩸 Initial commit: Life Connect - Blood Donor Request Matching System

✨ Features:
- MERN Stack Application
- Real-time blood donor matching
- Dual account system (Donor/Seeker)
- Emergency services integration
- MongoDB Atlas database
- JWT authentication
- Google Maps integration
- Responsive design"

echo Step 4: Add GitHub remote
git remote add origin https://github.com/Prince-kumar1/life-connect-blood-donation.git

echo Step 5: Set main branch and push
git branch -M main
git push -u origin main

echo.
echo ✅ Repository setup complete!
echo 🔗 Your project will be available at: https://github.com/Prince-kumar1/life-connect-blood-donation

pause