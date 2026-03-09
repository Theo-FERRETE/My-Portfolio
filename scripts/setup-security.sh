#!/bin/bash

# 🔐 Script de Setup Sécurité Portfolio
# Ce script vous guide dans la configuration sécurisée

echo "🔐 Configuration Sécurité Portfolio"
echo "===================================="
echo ""

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm est installé"
echo ""

# Étape 1 : Installation des dépendances
echo "📦 Étape 1/4 : Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation"
    exit 1
fi

echo "✅ Dépendances installées"
echo ""

# Étape 2 : Générer NEXTAUTH_SECRET
echo "🔑 Étape 2/4 : Génération du NEXTAUTH_SECRET..."
npm run generate-secret

echo ""
echo "📝 Copiez la valeur ci-dessus dans votre .env.local"
echo "Appuyez sur Entrée quand c'est fait..."
read

# Étape 3 : Hasher le mot de passe
echo ""
echo "🔒 Étape 3/4 : Hashage du mot de passe admin..."
npm run hash-password

echo ""
echo "📝 Copiez le hash ci-dessus dans votre .env.local"
echo "Appuyez sur Entrée quand c'est fait..."
read

# Étape 4 : Vérification
echo ""
echo "✅ Étape 4/4 : Configuration terminée !"
echo ""
echo "📋 Checklist finale :"
echo "  □ .env.local configuré avec NEXTAUTH_SECRET"
echo "  □ .env.local configuré avec ADMIN_PASSWORD_HASH"
echo "  □ .env.local configuré avec ADMIN_EMAIL"
echo "  □ ADMIN_PASSWORD retiré (recommandé)"
echo ""
echo "🚀 Vous pouvez maintenant démarrer :"
echo "   npm run dev"
echo ""
echo "📚 Documentation complète : README_SECURITY.md"
