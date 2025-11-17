# ================================================
# SETUP DEMO COMPLET - NessyCrea Dashboard
# Script PowerShell pour Windows
# ================================================

$ErrorActionPreference = "Stop"

Write-Host "?? SETUP DEMO COMPLET - NessyCrea Dashboard" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# V?rifier Node.js
try {
    $nodeVersion = node -v
    Write-Host "? Node.js $nodeVersion d?tect?" -ForegroundColor Green
} catch {
    Write-Host "? Node.js n'est pas install?" -ForegroundColor Red
    Write-Host "Installez Node.js 18+ depuis https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# V?rifier npm
try {
    $npmVersion = npm -v
    Write-Host "? npm $npmVersion d?tect?" -ForegroundColor Green
} catch {
    Write-Host "? npm n'est pas install?" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Aller dans le dossier react-dashboard
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptPath "..")

# ?tape 1: V?rifier .env.local
Write-Host "?? ?tape 1: V?rification de la configuration" -ForegroundColor Cyan

if (-not (Test-Path ".env.local")) {
    Write-Host "??  Fichier .env.local non trouv?" -ForegroundColor Yellow
    
    if (Test-Path ".env.local.example") {
        Write-Host "Cr?ation de .env.local depuis .env.local.example..."
        Copy-Item ".env.local.example" ".env.local"
        Write-Host "??  IMPORTANT: ?ditez .env.local avec vos credentials Supabase" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Variables requises:"
        Write-Host "  NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co"
        Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon"
        Write-Host ""
        Read-Host "Appuyez sur Entr?e apr?s avoir configur? .env.local"
    } else {
        Write-Host "? Fichier .env.local.example non trouv?" -ForegroundColor Red
        Write-Host "Cr?ez .env.local avec:"
        Write-Host "  NEXT_PUBLIC_SUPABASE_URL=..."
        Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
        exit 1
    }
}

# V?rifier que les variables sont d?finies
$envContent = Get-Content ".env.local" -Raw
if (-not ($envContent -match "NEXT_PUBLIC_SUPABASE_URL") -or -not ($envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
    Write-Host "? Variables d'environnement manquantes dans .env.local" -ForegroundColor Red
    Write-Host "Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont d?finies"
    exit 1
}

Write-Host "? Configuration .env.local OK" -ForegroundColor Green
Write-Host ""

# ?tape 2: Installer les d?pendances
Write-Host "?? ?tape 2: Installation des d?pendances" -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des d?pendances npm..."
    npm install
    Write-Host "? D?pendances install?es" -ForegroundColor Green
} else {
    Write-Host "? D?pendances d?j? install?es" -ForegroundColor Green
}
Write-Host ""

# ?tape 3: V?rifier la connexion Supabase
Write-Host "?? ?tape 3: V?rification de la connexion Supabase" -ForegroundColor Cyan

Write-Host "Test de connexion ? Supabase..."
try {
    $verifyOutput = npm run verify 2>&1 | Out-String
    if ($verifyOutput -match "Connexion Supabase OK") {
        Write-Host "? Connexion Supabase OK" -ForegroundColor Green
    } else {
        Write-Host "??  Impossible de v?rifier la connexion automatiquement" -ForegroundColor Yellow
        Write-Host "Assurez-vous que:"
        Write-Host "  1. Votre projet Supabase est actif (non en pause)"
        Write-Host "  2. Les sch?mas SQL ont ?t? ex?cut?s"
        Write-Host "  3. Les credentials dans .env.local sont corrects"
        Write-Host ""
        $continue = Read-Host "Continuer quand m?me ? (o/N)"
        if ($continue -ne "o" -and $continue -ne "O") {
            exit 1
        }
    }
} catch {
    Write-Host "??  Impossible de v?rifier la connexion" -ForegroundColor Yellow
}
Write-Host ""

# ?tape 4: G?n?rer les donn?es de d?mo
Write-Host "?? ?tape 4: G?n?ration des donn?es de d?monstration" -ForegroundColor Cyan

Write-Host "Cette ?tape va:"
Write-Host "  - Nettoyer toutes les donn?es existantes"
Write-Host "  - G?n?rer ~30 produits NessyCrea"
Write-Host "  - G?n?rer ~100 contacts"
Write-Host "  - G?n?rer ~400 messages"
Write-Host "  - G?n?rer ~180 commandes"
Write-Host "  - G?n?rer ~160 paiements"
Write-Host "  - G?n?rer ~120 avis"
Write-Host ""

$continue = Read-Host "Continuer ? (O/n)"
if ($continue -eq "n" -or $continue -eq "N") {
    Write-Host "Annul? par l'utilisateur"
    exit 0
}

Write-Host ""
Write-Host "G?n?ration en cours..."
npm run seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "? Donn?es g?n?r?es avec succ?s" -ForegroundColor Green
} else {
    Write-Host "? Erreur lors de la g?n?ration des donn?es" -ForegroundColor Red
    exit 1
}
Write-Host ""

# ?tape 5: V?rifier les donn?es
Write-Host "?? ?tape 5: V?rification des donn?es g?n?r?es" -ForegroundColor Cyan

npm run verify

if ($LASTEXITCODE -eq 0) {
    Write-Host "? Toutes les v?rifications pass?es" -ForegroundColor Green
} else {
    Write-Host "??  Certaines v?rifications ont ?chou?" -ForegroundColor Yellow
    Write-Host "V?rifiez les messages ci-dessus"
}
Write-Host ""

# R?sum? final
Write-Host "????????????????????????????????????????" -ForegroundColor Cyan
Write-Host "?? SETUP TERMIN? AVEC SUCC?S !" -ForegroundColor Green
Write-Host "????????????????????????????????????????" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines ?tapes:"
Write-Host ""
Write-Host "1. Lancer le dashboard:"
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Ouvrir dans le navigateur:"
Write-Host "   http://localhost:3000/dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Consulter le guide de d?monstration:"
Write-Host "   ..\..\GUIDE-DEMONSTRATION.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "? Le syst?me est pr?t pour la d?monstration !" -ForegroundColor Green
Write-Host ""
