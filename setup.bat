@echo off
echo Setting up Ayurvedic Herb Traceability System...

echo.
echo Installing Smart Contract dependencies...
cd smart-contracts
call npm install
cd ..

echo.
echo Installing Backend dependencies...
cd backend
call npm install
cd ..

echo.
echo Installing Frontend dependencies...
cd web-app
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Configure .env files with your credentials
echo 2. Deploy smart contract: cd smart-contracts && npm run deploy
echo 3. Start backend: cd backend && npm start
echo 4. Start frontend: cd web-app && npm run dev
pause