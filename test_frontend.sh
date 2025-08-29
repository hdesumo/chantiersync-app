#!/bin/bash
echo "============================="
echo "   🔍 TEST FRONTEND PLAYWRIGHT"
echo "============================="

# Lancer Next.js en arrière-plan
echo "➡️  Démarrage du frontend Next.js..."
npm run dev > frontend.log 2>&1 &
FRONT_PID=$!

# Attendre quelques secondes pour que Next.js démarre
sleep 10

# Lancer les tests Playwright
echo "➡️  Exécution des tests Playwright..."
npx playwright test

# Arrêter le serveur Next.js
kill $FRONT_PID
echo "✅ Tests terminés"

