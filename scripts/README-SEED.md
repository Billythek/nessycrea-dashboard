# Seed Demo Data - NessyCrea Dashboard

Script de génération de données de démonstration complètes pour présentation client.

## 📦 Ce qui est généré

### Produits (13 total)
- **10 bougies parfumées** (1€-5€)
  - Vanille Douce (3.50€)
  - Lavande Provence (4.00€)
  - Rose Romantique (4.50€)
  - Citron Frais (3.00€)
  - Cannelle Épicée (3.50€)
  - Coco Vanille (4.00€)
  - Sapin Nordique (3.50€)
  - Fleur de Coton (4.50€)
  - Ambre & Musc (5.00€)
  - Thé Vert (3.50€)

- **3 packs**
  - Pack Découverte 3 bougies (9.00€)
  - Pack Bien-Être 5 bougies (14.00€)
  - Pack Premium 10 bougies (25.00€)

### Contacts (100 clients)
- **40% Leads** - Ont contacté mais pas encore acheté
- **50% Customers** - Ont acheté 1-2 fois
- **10% VIP** - Clients fidèles avec 3+ commandes

Chaque contact possède:
- Nom/prénom français réaliste
- Username Instagram
- Email (70% des contacts)
- Téléphone (50% des contacts)
- Score de priorité AI (0-100)
- Sentiment moyen (0.3-0.9)

### Messages (300-500)
Messages Instagram en français avec 5 types:
- **Questions produits** - "C'est quoi votre best-seller?"
- **Commandes** - "Je prends le pack 5 bougies!"
- **Remerciements** - "Super rapide la livraison!"
- **Info livraison** - "T'as un numéro de suivi stp?"
- **Suivi** - "Colis bien reçu ce matin!"

Chaque message inclut:
- Direction (inbound/outbound)
- Sentiment score (-1.0 à 1.0)
- Intent détecté (purchase_intent, question, thanks, etc.)
- Statut (unread, read, responded, archived)
- Urgency level (low, normal, high, urgent)

### Commandes (150-200)
- **70% livrées**, 20% expédiées, 10% en cours
- **Montant moyen**: 3€-30€ (correspond à 1-5 bougies ou 1 pack)
- **30% achètent un pack**, 70% des bougies individuelles
- **Frais de port**: Gratuits au-dessus de 20€, sinon 3.90€

Statuts de commande:
- `draft` - Brouillon
- `pending_payment` - En attente de paiement
- `paid` - Payée
- `processing` - En préparation
- `shipped` - Expédiée
- `delivered` - Livrée
- `cancelled` - Annulée

### Paiements
- **Providers**: PayPal, Stripe, Virement bancaire
- **Frais**: ~2.9% + 0.30€ (frais réels PayPal/Stripe)
- **Statut**: completed pour toutes les commandes payées

### Avis (100-150)
Distribution réaliste:
- **60% avec 5 étoiles** - Clients ravis
- **25% avec 4 étoiles** - Clients satisfaits
- **10% avec 3 étoiles** - Clients mitigés
- **5% avec 1-2 étoiles** - Clients déçus

Chaque avis inclut:
- Note globale (1-5)
- Commentaire en français
- Notes détaillées (qualité produit, rapidité livraison, service client)
- Recommandation (oui/non)
- Nombre de "utile" (helpful_count)

## 🚀 Installation

### 1. Installer tsx (pour exécuter TypeScript)

```bash
npm install --save-dev tsx
```

### 2. Vérifier la connexion Supabase

Assurez-vous que `.env.local` contient:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

## ▶️ Utilisation

### Méthode 1: Via npm script (recommandé)

Ajoutez dans `package.json`:

```json
{
  "scripts": {
    "seed": "tsx scripts/seed-demo-data.ts"
  }
}
```

Puis lancez:

```bash
npm run seed
```

### Méthode 2: Directement avec tsx

```bash
npx tsx scripts/seed-demo-data.ts
```

## 📊 Résultat attendu

```
🚀 SEED DEMO DATA - NessyCrea Dashboard
========================================
📊 Génération de données de démonstration complètes

✅ Connexion Supabase OK

🗑️  Nettoyage des données existantes...
✅ Données nettoyées

🕯️  Création des produits (10 bougies + 3 packs)...
✅ 13 produits créés

👥 Création de 100 clients français...
✅ 100 contacts créés

💬 Génération de 300-500 messages Instagram...
✅ 387 messages créés

📦 Création de 150-200 commandes...
✅ 176 commandes créées
✅ 423 articles de commande créés

💳 Génération des paiements...
✅ 158 paiements créés

⭐ Création de 100-150 avis clients...
✅ 124 avis créés

📊 RÉSUMÉ DE LA GÉNÉRATION
==========================
✅ Produits: 13 (10 bougies + 3 packs)
✅ Contacts: 100
   - Leads: 40
   - Customers: 50
   - VIP: 10
✅ Messages: 387
✅ Commandes: 176
✅ Paiements: 158
✅ Avis: 124

💰 Chiffre d'affaires simulé: 2847.32€
📊 Panier moyen: 18.02€

🎉 SEED TERMINÉ AVEC SUCCÈS !
👉 Vous pouvez maintenant lancer le dashboard: npm run dev
👉 Toutes les données sont visibles dans l'interface
```

## ⚠️ Important

### Nettoyage automatique

Le script **nettoie TOUTES les données existantes** avant de générer les nouvelles. Cela inclut:
- Tous les avis (reviews)
- Tous les paiements (payments)
- Tous les articles de commande (order_items)
- Toutes les commandes (orders)
- Tous les messages (messages)
- Tous les produits (products)
- Tous les contacts (contacts)

⚠️ **N'UTILISEZ PAS ce script en production avec de vraies données !**

### Re-exécution

Vous pouvez exécuter le script plusieurs fois. À chaque fois:
1. Toutes les données sont supprimées
2. De nouvelles données aléatoires sont générées
3. Les statistiques varient légèrement (nombres aléatoires)

## 🎯 Utilisation pour démo client

Ce seed est parfait pour:
- ✅ Présentation client avec données réalistes
- ✅ Tests de l'interface utilisateur
- ✅ Screenshots/vidéos de démonstration
- ✅ Formation des utilisateurs
- ✅ Tests de performance avec volume de données

Les données sont **100% en français** et **cohérentes**:
- Les noms sont français
- Les messages sont naturels
- Les montants sont réalistes (3€-30€)
- Les dates sont chronologiques
- Les statuts sont logiques

## 🔧 Personnalisation

Pour modifier les données générées, éditez `seed-demo-data.ts`:

### Changer le nombre de clients

```typescript
for (let i = 0; i < 200; i++) { // Au lieu de 100
```

### Ajouter des produits

```typescript
const PRODUCTS = [
  // ... produits existants
  {
    sku: 'BG-NEW-001',
    name: 'Nouvelle Bougie',
    description: '...',
    category: 'bougies',
    price: 4.50,
    keywords: ['nouveau', 'parfum']
  }
]
```

### Modifier les templates de messages

```typescript
const MESSAGE_TEMPLATES = {
  question_produit: [
    "Votre nouveau message ici...",
    // ... autres messages
  ]
}
```

## 📝 Notes techniques

- Utilise la bibliothèque Supabase JS v2
- Génère des UUID automatiques (PostgreSQL)
- Respecte toutes les contraintes foreign key
- Les triggers de mise à jour se déclenchent automatiquement
- Calculs réalistes (frais de port, marges, frais PayPal)

## 🐛 Dépannage

### Erreur "Variables d'environnement manquantes"

Vérifiez que `.env.local` existe et contient:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Erreur "Foreign key constraint"

Les données sont insérées dans le bon ordre. Si erreur, vérifiez que:
1. Les tables existent (schema.sql a été exécuté)
2. La table reviews existe (schema-reviews-CLEAN.sql a été exécuté)

### Erreur de connexion Supabase

```bash
# Testez la connexion
curl https://votre-projet.supabase.co/rest/v1/
```

## 📚 Ressources

- [Supabase Docs](https://supabase.com/docs)
- [tsx](https://github.com/esbuild-kit/tsx)
- [TypeScript](https://www.typescriptlang.org/)

---

Généré avec ❤️ pour NessyCrea Dashboard
