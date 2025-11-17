#!/bin/bash

# ================================================
# SETUP DEMO COMPLET - NessyCrea Dashboard
# ================================================
# Ce script automatise la pr?paration compl?te
# du syst?me de d?monstration
# ================================================

set -e  # Arr?ter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}?? SETUP DEMO COMPLET - NessyCrea Dashboard${NC}"
echo "=========================================="
echo ""

# V?rifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}? Node.js n'est pas install?${NC}"
    echo "Installez Node.js 18+ depuis https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}? Node.js version 18+ requise (actuelle: $(node -v))${NC}"
    exit 1
fi

echo -e "${GREEN}? Node.js $(node -v) d?tect?${NC}"

# V?rifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}? npm n'est pas install?${NC}"
    exit 1
fi

echo -e "${GREEN}? npm $(npm -v) d?tect?${NC}"
echo ""

# Aller dans le dossier react-dashboard
cd "$(dirname "$0")/.."

# ?tape 1: V?rifier .env.local
echo -e "${BLUE}?? ?tape 1: V?rification de la configuration${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}??  Fichier .env.local non trouv?${NC}"
    
    if [ -f ".env.local.example" ]; then
        echo "Cr?ation de .env.local depuis .env.local.example..."
        cp .env.local.example .env.local
        echo -e "${YELLOW}??  IMPORTANT: ?ditez .env.local avec vos credentials Supabase${NC}"
        echo ""
        echo "Variables requises:"
        echo "  NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co"
        echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon"
        echo ""
        read -p "Appuyez sur Entr?e apr?s avoir configur? .env.local..."
    else
        echo -e "${RED}? Fichier .env.local.example non trouv?${NC}"
        echo "Cr?ez .env.local avec:"
        echo "  NEXT_PUBLIC_SUPABASE_URL=..."
        echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
        exit 1
    fi
fi

# V?rifier que les variables sont d?finies
source .env.local 2>/dev/null || true

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}? Variables d'environnement manquantes dans .env.local${NC}"
    echo "Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont d?finies"
    exit 1
fi

echo -e "${GREEN}? Configuration .env.local OK${NC}"
echo ""

# ?tape 2: Installer les d?pendances
echo -e "${BLUE}?? ?tape 2: Installation des d?pendances${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installation des d?pendances npm..."
    npm install
    echo -e "${GREEN}? D?pendances install?es${NC}"
else
    echo -e "${GREEN}? D?pendances d?j? install?es${NC}"
fi
echo ""

# ?tape 3: V?rifier la connexion Supabase
echo -e "${BLUE}?? ?tape 3: V?rification de la connexion Supabase${NC}"

echo "Test de connexion ? Supabase..."
if npm run verify 2>&1 | grep -q "Connexion Supabase OK"; then
    echo -e "${GREEN}? Connexion Supabase OK${NC}"
else
    echo -e "${YELLOW}??  Impossible de v?rifier la connexion automatiquement${NC}"
    echo "Assurez-vous que:"
    echo "  1. Votre projet Supabase est actif (non en pause)"
    echo "  2. Les sch?mas SQL ont ?t? ex?cut?s (schema.sql, schema-reviews-CLEAN.sql, rls-policies.sql)"
    echo "  3. Les credentials dans .env.local sont corrects"
    echo ""
    read -p "Continuer quand m?me ? (o/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
fi
echo ""

# ?tape 4: G?n?rer les donn?es de d?mo
echo -e "${BLUE}?? ?tape 4: G?n?ration des donn?es de d?monstration${NC}"

echo "Cette ?tape va:"
echo "  - Nettoyer toutes les donn?es existantes"
echo "  - G?n?rer ~30 produits NessyCrea"
echo "  - G?n?rer ~100 contacts"
echo "  - G?n?rer ~400 messages"
echo "  - G?n?rer ~180 commandes"
echo "  - G?n?rer ~160 paiements"
echo "  - G?n?rer ~120 avis"
echo ""

read -p "Continuer ? (O/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Annul? par l'utilisateur"
    exit 0
fi

echo ""
echo "G?n?ration en cours..."
npm run seed

if [ $? -eq 0 ]; then
    echo -e "${GREEN}? Donn?es g?n?r?es avec succ?s${NC}"
else
    echo -e "${RED}? Erreur lors de la g?n?ration des donn?es${NC}"
    exit 1
fi
echo ""

# ?tape 5: V?rifier les donn?es
echo -e "${BLUE}?? ?tape 5: V?rification des donn?es g?n?r?es${NC}"

npm run verify

if [ $? -eq 0 ]; then
    echo -e "${GREEN}? Toutes les v?rifications pass?es${NC}"
else
    echo -e "${YELLOW}??  Certaines v?rifications ont ?chou?${NC}"
    echo "V?rifiez les messages ci-dessus"
fi
echo ""

# R?sum? final
echo -e "${BLUE}????????????????????????????????????????${NC}"
echo -e "${GREEN}?? SETUP TERMIN? AVEC SUCC?S !${NC}"
echo -e "${BLUE}????????????????????????????????????????${NC}"
echo ""
echo "Prochaines ?tapes:"
echo ""
echo "1. Lancer le dashboard:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. Ouvrir dans le navigateur:"
echo -e "   ${YELLOW}http://localhost:3000/dashboard${NC}"
echo ""
echo "3. Consulter le guide de d?monstration:"
echo -e "   ${YELLOW}../../GUIDE-DEMONSTRATION.md${NC}"
echo ""
echo -e "${GREEN}? Le syst?me est pr?t pour la d?monstration !${NC}"
echo ""
