#!/bin/bash

# 🔒 Script de vérification de sécurité
# Vérifie que votre configuration respecte les nouvelles exigences

echo "🔐 Vérification de sécurité Portfolio"
echo "======================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur d'erreurs
errors=0
warnings=0

# Vérifier que .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Fichier .env.local manquant${NC}"
    echo "   Créez-le avec: cp .env.example .env.local"
    exit 1
fi

echo "✅ Fichier .env.local trouvé"
echo ""

# Charger les variables
source .env.local 2>/dev/null

# 1. Vérifier NEXTAUTH_SECRET
echo "🔑 Vérification NEXTAUTH_SECRET..."
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo -e "${RED}❌ NEXTAUTH_SECRET manquant${NC}"
    echo "   Générez-le avec: npm run generate-secret"
    ((errors++))
elif [ ${#NEXTAUTH_SECRET} -lt 32 ]; then
    echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET trop court (< 32 caractères)${NC}"
    ((warnings++))
else
    echo -e "${GREEN}✅ NEXTAUTH_SECRET configuré${NC}"
fi
echo ""

# 2. Vérifier ADMIN_EMAIL
echo "📧 Vérification ADMIN_EMAIL..."
if [ -z "$ADMIN_EMAIL" ]; then
    echo -e "${RED}❌ ADMIN_EMAIL manquant${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ ADMIN_EMAIL: $ADMIN_EMAIL${NC}"
fi
echo ""

# 3. Vérifier ADMIN_PASSWORD_HASH (OBLIGATOIRE)
echo "🔒 Vérification ADMIN_PASSWORD_HASH..."
if [ -z "$ADMIN_PASSWORD_HASH" ]; then
    echo -e "${RED}❌ ADMIN_PASSWORD_HASH manquant (OBLIGATOIRE)${NC}"
    echo "   Générez-le avec: npm run hash-password"
    ((errors++))
else
    echo -e "${GREEN}✅ ADMIN_PASSWORD_HASH configuré${NC}"
fi
echo ""

# 4. Vérifier que ADMIN_PASSWORD n'est PAS utilisé
echo "🚨 Vérification ADMIN_PASSWORD (ne doit PAS être utilisé)..."
if [ -n "$ADMIN_PASSWORD" ]; then
    echo -e "${RED}❌ ADMIN_PASSWORD détecté - C'EST DANGEREUX !${NC}"
    echo -e "${YELLOW}   Cette variable n'est plus supportée pour des raisons de sécurité${NC}"
    echo "   Supprimez ADMIN_PASSWORD de votre .env.local"
    echo "   Utilisez uniquement ADMIN_PASSWORD_HASH"
    ((errors++))
else
    echo -e "${GREEN}✅ ADMIN_PASSWORD non utilisé (bon)${NC}"
fi
echo ""

# 5. Vérifier ENABLE_AUDIT_LOGS
echo "📊 Vérification ENABLE_AUDIT_LOGS..."
if [ "$ENABLE_AUDIT_LOGS" = "true" ]; then
    echo -e "${GREEN}✅ Logs d'audit activés${NC}"
else
    echo -e "${YELLOW}⚠️  Logs d'audit désactivés (recommandé: true)${NC}"
    ((warnings++))
fi
echo ""

# 6. Vérifier TRUSTED_PROXY
echo "🌐 Vérification TRUSTED_PROXY..."
if [ "$TRUSTED_PROXY" = "true" ]; then
    echo -e "${GREEN}✅ Proxy de confiance activé (production)${NC}"
elif [ "$TRUSTED_PROXY" = "false" ]; then
    echo -e "${GREEN}✅ Proxy désactivé (développement)${NC}"
else
    echo -e "${YELLOW}⚠️  TRUSTED_PROXY non défini (par défaut: false)${NC}"
    ((warnings++))
fi
echo ""

# 7. Vérifier NODE_ENV en production
if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Mode PRODUCTION détecté - Vérifications supplémentaires..."
    
    if [ "$NEXTAUTH_URL" = "http://localhost:3000" ]; then
        echo -e "${RED}❌ NEXTAUTH_URL pointe vers localhost en production${NC}"
        ((errors++))
    fi
    
    if [ ${#NEXTAUTH_SECRET} -lt 40 ]; then
        echo -e "${YELLOW}⚠️  Secret trop court pour production (recommandé: 40+ caractères)${NC}"
        ((warnings++))
    fi
    
    echo ""
fi

# Résumé
echo "======================================"
echo "📋 RÉSUMÉ"
echo "======================================"

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration parfaite ! Aucun problème détecté.${NC}"
    echo ""
    echo "🚀 Vous pouvez démarrer en toute sécurité:"
    echo "   npm run dev"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $warnings avertissement(s) détecté(s)${NC}"
    echo "   Votre configuration fonctionne mais pourrait être améliorée."
    echo ""
    echo "Vous pouvez continuer avec:"
    echo "   npm run dev"
    exit 0
else
    echo -e "${RED}❌ $errors erreur(s) critique(s) détectée(s)${NC}"
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $warnings avertissement(s)${NC}"
    fi
    echo ""
    echo "Corrigez les erreurs avant de continuer."
    echo "Consultez: README_SECURITY.md"
    exit 1
fi
