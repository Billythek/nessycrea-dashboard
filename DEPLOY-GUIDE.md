# 🚀 Guide de Déploiement NessyCrea Dashboard

**Repo GitHub :** https://github.com/Billythek/nessycrea-dashboard
**Version :** v2.0.0
**Date :** 4 novembre 2025

---

## ✅ Étape 1 : Code sur GitHub (TERMINÉ ✓)

Le code est déjà poussé sur GitHub :
- **URL :** https://github.com/Billythek/nessycrea-dashboard
- **Branch :** master
- **Commit :** feat: NessyCrea Dashboard v2.0.0 - Production Ready 🚀

---

## 🌐 Étape 2 : Déployer sur Vercel (GRATUIT)

### Option A : Déploiement depuis GitHub (RECOMMANDÉ - 2 minutes)

1. **Aller sur Vercel :**
   - Ouvrir : https://vercel.com
   - Cliquer sur "Sign Up" ou "Login"
   - Choisir "Continue with GitHub"

2. **Importer le Projet :**
   - Une fois connecté, cliquer sur "Add New..." → "Project"
   - Vercel va scanner ton compte GitHub
   - Sélectionner **"nessycrea-dashboard"**
   - Cliquer sur "Import"

3. **Configuration :**
   ```
   Framework Preset: Next.js (auto-détecté ✓)
   Root Directory: ./
   Build Command: npm run build (auto ✓)
   Output Directory: .next (auto ✓)
   Install Command: npm install (auto ✓)
   ```

4. **Variables d'Environnement :**
   - Cliquer sur "Environment Variables"
   - Ajouter **pour chaque environnement** (Production, Preview, Development) les variables suivantes avec les valeurs fournies par Supabase :

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY  (optionnel mais conseillé pour les scripts ou routes serveur sécurisés)
   ```

   👉 Récupère les valeurs exactes dans ton projet Supabase : `Project Settings → API`.
   👉 Laisse la case "Encrypt" cochée par défaut dans Vercel pour protéger les clés sensibles.

5. **Déployer :**
   - Cliquer sur "Deploy"
   - Attendre 2-3 minutes ⏳
   - Vercel va build et déployer automatiquement

6. **🎉 C'est fait !**
   - Tu auras une URL du type : `https://nessycrea-dashboard.vercel.app`
   - Partager cette URL avec ton équipe !

---

### Option B : Déploiement via CLI (pour experts)

```bash
# 1. Login Vercel
vercel login

# 2. Naviguer dans le projet
cd C:\Users\apag9\Documents\nessycrea-dashboard\react-dashboard

# 3. Déployer
vercel --prod

# 4. Suivre les instructions
# - Nom du projet : nessycrea-dashboard
# - Root directory : ./
# - Framework : Next.js
```

---

## 🔧 Configuration Post-Déploiement

### Ajouter un Domaine Custom (Optionnel)

1. Dans Vercel Dashboard → ton projet
2. Onglet "Settings" → "Domains"
3. Ajouter ton domaine (ex: dashboard.nessycrea.com)
4. Suivre les instructions DNS
5. SSL automatique ✓

### Webhook GitHub (Auto-déploiement)

**Déjà configuré automatiquement !** ✓

À chaque push sur `master`, Vercel va :
- Détecter le changement
- Rebuild automatiquement
- Déployer la nouvelle version
- Notifier sur Discord/Slack (si configuré)

---

## 📊 Vérifications Post-Déploiement

### 1. Tester le Site

```
✓ Homepage : https://ton-url.vercel.app
✓ Dashboard : https://ton-url.vercel.app/dashboard
✓ Messages : https://ton-url.vercel.app/messages
✓ Orders : https://ton-url.vercel.app/orders
✓ Contacts : https://ton-url.vercel.app/contacts
✓ Payments : https://ton-url.vercel.app/payments
✓ Reviews : https://ton-url.vercel.app/reviews
```

### 1bis. Vérifier les données de démo

1. **Dans Supabase Studio → Table Editor**
   - `contacts` : rechercher `demo_user_%` (100 lignes attendues)
   - `orders` : filtrer `order_number` par `DEMO-%` pour suivre la répartition des statuts
   - `payments` : filtrer `transaction_id` par `demo-%` pour voir les paiements `completed/pending/failed`
2. **Dans le dashboard**
   - `Contacts` : filtres/tri pour visualiser les clients de démo
   - `Commandes` : vérifier les badges de statuts (payée, en attente, remboursée...)
   - `Paiements` : comparer la synthèse (cartes en haut) avec les données Supabase
3. **Échantillons SQL Supabase**
   ```sql
   select status, count(*) from orders where order_number like 'DEMO-%' group by status;
   select payment_status, count(*) from payments where transaction_id like 'demo-%' group by payment_status;
   ```

### 2. Vérifier les Features v2.0.0

- ✅ Skeleton loaders s'affichent pendant le chargement
- ✅ Badges dans Sidebar sont dynamiques
- ✅ Graphiques s'affichent correctement
- ✅ React Query Devtools visible en bas à gauche (dev mode)
- ✅ Toast notifications fonctionnent

### 3. Performance

Dans Vercel Dashboard :
- Speed Insights (métriques Core Web Vitals)
- Analytics (visiteurs, pages vues)
- Logs (erreurs, requêtes)

---

## 🎯 Partager avec l'Équipe

### Email Template

```
Sujet : 🚀 Nouveau Dashboard NessyCrea v2.0.0 en Ligne !

Bonjour l'équipe,

Le nouveau dashboard NessyCrea est maintenant en ligne !

🔗 URL : https://[TON-URL].vercel.app

🆕 Nouveautés v2.0.0 :
✅ Performance +50% (cache intelligent)
✅ Badges en temps réel (auto-refresh 30s)
✅ Skeleton loaders professionnels
✅ Erreurs gérées gracieusement
✅ TypeScript 100% type-safe

📖 Documentation :
- GitHub : https://github.com/Billythek/nessycrea-dashboard
- Guide complet : Voir IMPROVEMENTS.md

Testez et donnez vos retours !

L'équipe NessyCrea
```

---

## 🐛 Troubleshooting

### Erreur : "Build Failed"

**Cause :** Erreurs TypeScript ou ESLint

**Solution :**
```bash
cd react-dashboard
npm run build  # Tester le build localement
npm run lint   # Vérifier les erreurs ESLint
```

### Erreur : "Module not found"

**Cause :** Dépendances manquantes

**Solution :** Vérifier que `package.json` contient toutes les dépendances

### Erreur : "Environment variables not set"

**Cause :** Variables Supabase manquantes

**Solution :** Ajouter les variables dans Vercel Dashboard → Settings → Environment Variables

---

## 📈 Monitoring & Analytics

### Vercel Analytics (Gratuit)

1. Dans Vercel Dashboard → ton projet
2. Onglet "Analytics"
3. Voir :
   - Visiteurs uniques
   - Pages vues
   - Temps de chargement
   - Erreurs 404/500

### Vercel Speed Insights (Gratuit)

1. Onglet "Speed Insights"
2. Métriques Core Web Vitals :
   - LCP (Largest Contentful Paint) < 2.5s ✓
   - FID (First Input Delay) < 100ms ✓
   - CLS (Cumulative Layout Shift) < 0.1 ✓

### Logs en Temps Réel

```bash
# CLI
vercel logs

# Ou dans Dashboard
Onglet "Logs" → Voir les requêtes en temps réel
```

---

## 🔄 Mettre à Jour le Site

### Automatique (Push sur GitHub)

```bash
cd C:\Users\apag9\Documents\nessycrea-dashboard\react-dashboard

# 1. Faire des modifications...

# 2. Commit
git add .
git commit -m "feat: nouvelle feature"

# 3. Push
git push origin master

# 4. Vercel détecte et déploie automatiquement ✓
```

### Manuel (Vercel CLI)

```bash
vercel --prod
```

---

## 🎓 Ressources

### Vercel Docs
- [Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/projects/domains)

### GitHub
- [Repo NessyCrea](https://github.com/Billythek/nessycrea-dashboard)
- [Commit v2.0.0](https://github.com/Billythek/nessycrea-dashboard/commit/3d9c329)

### Dashboard Local
- [IMPROVEMENTS.md](./react-dashboard/IMPROVEMENTS.md) - Guide technique complet
- [CHANGELOG.md](./react-dashboard/CHANGELOG.md) - Historique versions
- [README.md](./react-dashboard/README.md) - Quick start

---

## ✅ Checklist Finale

Avant de partager avec l'équipe :

- [ ] Code poussé sur GitHub ✓
- [ ] Projet importé dans Vercel ✓
- [ ] Variables d'environnement ajoutées ✓
- [ ] Build réussi (vert dans Vercel) ✓
- [ ] Site accessible publiquement ✓
- [ ] Toutes les pages fonctionnent ✓
- [ ] Badges dynamiques opérationnels ✓
- [ ] Performance testée (Lighthouse) ✓

---

**🎉 Félicitations ! Ton dashboard est maintenant en production !**

**URL finale :** [À compléter après déploiement Vercel]

**Support :** Consulter IMPROVEMENTS.md ou CHANGELOG.md

---

**Guide créé le 4 novembre 2025**
**Version Dashboard : v2.0.0**
**Déployé avec Vercel (gratuit) 🚀**
