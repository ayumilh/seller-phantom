#!/bin/bash
set -e

echo ">>> Deploy seller-phantom"
git pull origin main
npm install
npm run build
echo ">>> Build concluído. Conteúdo em dist/"
