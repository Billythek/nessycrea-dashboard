/**
 * SEED DEMO DATA - NessyCrea Dashboard
 *
 * Script de génération de données de démonstration réalistes pour une simulation complète
 * Business: Bougies parfumées artisanales
 *
 * Génère:
 * - 10 types de bougies (1€-5€) + 3 packs (3, 5, 10 bougies)
 * - 100 clients français avec profils Instagram
 * - 300-500 messages Instagram en français
 * - 150-200 commandes (montant moyen 3€-30€)
 * - Paiements PayPal/Stripe
 * - 100-150 avis clients en français
 *
 * Usage: npx tsx scripts/seed-demo-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Charger les variables d'environnement
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERREUR: Variables d\'environnement Supabase manquantes')
  console.error('Vérifiez .env.local avec NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================================
// DONNÉES DE RÉFÉRENCE
// ============================================================

// Noms français réalistes
const FIRST_NAMES_F = ['Marie', 'Sophie', 'Emma', 'Léa', 'Chloé', 'Julie', 'Laura', 'Camille', 'Sarah', 'Manon', 'Pauline', 'Lisa', 'Lucie', 'Clara', 'Alice', 'Charlotte', 'Mathilde', 'Inès', 'Morgane', 'Anaïs']
const FIRST_NAMES_M = ['Thomas', 'Lucas', 'Hugo', 'Maxime', 'Alexandre', 'Antoine', 'Pierre', 'Louis', 'Nathan', 'Paul', 'Nicolas', 'Julien', 'Romain', 'Clément', 'Benjamin', 'Mathis', 'Gabriel', 'Arthur', 'Raphaël', 'Tom']
const LAST_NAMES = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez']

// Charger les produits réels NessyCrea
let PRODUCTS_REAL: any[] = []
try {
  const productsPath = resolve(__dirname, '../../data/produits-nessycrea.json')
  const productsData = JSON.parse(readFileSync(productsPath, 'utf-8'))
  
  // Convertir les produits NessyCrea au format attendu
  PRODUCTS_REAL = []
  
  // Diffuseurs voiture
  if (productsData.diffuseurs_voiture) {
    productsData.diffuseurs_voiture.parfums.forEach((parfum: string, index: number) => {
      PRODUCTS_REAL.push({
        sku: `DF-VOIT-${String(index + 1).padStart(3, '0')}`,
        name: `Diffuseur Voiture ${parfum}`,
        description: productsData.diffuseurs_voiture.description,
        category: 'diffuseurs',
        price: productsData.diffuseurs_voiture.prix_fixe,
        keywords: ['diffuseur', 'voiture', parfum.toLowerCase()]
      })
    })
  }
  
  // Fondants parfumés
  if (productsData.fondants_parfumes) {
    Object.entries(productsData.fondants_parfumes).forEach(([size, data]: [string, any]) => {
      PRODUCTS_REAL.push({
        sku: `FOND-${size.toUpperCase()}-001`,
        name: `Fondant Parfumé ${size.charAt(0).toUpperCase() + size.slice(1)}`,
        description: data.description,
        category: 'fondants',
        price: data.prix,
        keywords: ['fondant', 'parfumé', size]
      })
    })
  }
  
  // Bougies luxe
  if (productsData.bougies_luxe) {
    productsData.bougies_luxe.forEach((bougie: any, index: number) => {
      PRODUCTS_REAL.push({
        sku: `BG-LUX-${String(index + 1).padStart(3, '0')}`,
        name: `Bougie ${bougie.nom}`,
        description: bougie.description,
        category: 'bougies_luxe',
        price: bougie.prix_moyen,
        keywords: ['bougie', 'luxe', bougie.nom.toLowerCase().replace(/\s+/g, '_')]
      })
    })
  }
  
  // Bougies spéciales
  if (productsData.bougies_speciales) {
    productsData.bougies_speciales.forEach((bougie: any, index: number) => {
      PRODUCTS_REAL.push({
        sku: `BG-SPEC-${String(index + 1).padStart(3, '0')}`,
        name: `Bougie ${bougie.nom}`,
        description: bougie.description,
        category: 'bougies_speciales',
        price: bougie.prix_moyen,
        keywords: ['bougie', 'spéciale', bougie.nom.toLowerCase().replace(/\s+/g, '_')]
      })
    })
  }
  
  // Box
  if (productsData.box) {
    Object.entries(productsData.box).forEach(([type, data]: [string, any]) => {
      PRODUCTS_REAL.push({
        sku: `BOX-${type.toUpperCase()}-001`,
        name: `Box ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: data.description,
        category: 'boxes',
        price: data.prix_moyen,
        keywords: ['box', type, 'coffret']
      })
    })
  }
  
  // Produits chargés avec succès
} catch (error) {
  // Produits par défaut seront utilisés
}

// Produits: Utiliser les produits réels NessyCrea si disponibles, sinon produits par défaut
const PRODUCTS = PRODUCTS_REAL.length > 0 ? PRODUCTS_REAL : [
  // Produits par défaut (fallback si JSON non disponible)
  { sku: 'BG-VAN-001', name: 'Bougie Vanille Douce', description: 'Bougie parfumée à la vanille de Madagascar, senteur gourmande et réconfortante', category: 'bougies', price: 3.50, keywords: ['vanille', 'gourmand', 'doux'] },
  { sku: 'BG-LAV-001', name: 'Bougie Lavande Provence', description: 'Bougie aux huiles essentielles de lavande, parfum relaxant', category: 'bougies', price: 4.00, keywords: ['lavande', 'provence', 'relaxant'] },
  { sku: 'BG-ROS-001', name: 'Bougie Rose Romantique', description: 'Bougie senteur rose et jasmin, idéale pour une ambiance romantique', category: 'bougies', price: 4.50, keywords: ['rose', 'jasmin', 'romantique'] },
  { sku: 'PACK-3', name: 'Pack Découverte 3 Bougies', description: 'Pack de 3 bougies parfumées au choix - Parfait pour découvrir nos senteurs', category: 'packs', price: 9.00, keywords: ['pack', 'découverte', '3'] },
  { sku: 'PACK-5', name: 'Pack Bien-Être 5 Bougies', description: 'Pack de 5 bougies parfumées - Idéal pour créer une ambiance zen', category: 'packs', price: 14.00, keywords: ['pack', 'bien-être', '5'] }
]

// Messages types (pour génération)
const MESSAGE_TEMPLATES = {
  question_produit: [
    "Bonjour ! J'aimerais savoir si vous avez des bougies Angel en stock ? 💜",
    "Coucou 😊 La bougie Angel c'est quelle senteur exactement ?",
    "Hello ! Vos bougies sont-elles 100% naturelles ?",
    "Salut ! Est-ce que vous faites des bougies sans parfum ? J'ai des allergies 😅",
    "Bonjour, les bougies tiennent combien de temps environ ?",
    "Hey ! Vous avez des nouvelles senteurs prévues bientôt ? 🕯️",
    "Coucou ! C'est quoi votre best-seller ? Je vois beaucoup parler de la bougie Angel 🤩",
    "Salut ! Les boxes sont personnalisables ou c'est fixe ?",
    "Bonjour, vous faites des boxes pour Noël ? 🎄",
    "Hello ! La bougie Lady Million sent vraiment bon ?",
    "Coucou ! Le diffuseur voiture c'est pour quelle taille de voiture ? 🚗",
    "Salut ! C'est quoi la différence entre les fondants petit et grand ?",
    "Bonjour ! La box Noël contient quoi exactement ? 🎁"
  ],
  commande: [
    "Je voudrais commander 2 bougies Angel svp ! Comment je fais ? 💜",
    "Salut ! Je prends la box Noël, tu peux m'envoyer le lien de paiement ?",
    "Bonjour ! J'aimerais commander une bougie Lady Million + un diffuseur voiture 🕯️",
    "Hey ! Je veux bien la box découverte, vous livrez en combien de temps ?",
    "Coucou ! Je prends 3 bougies (2 Angel, 1 Miss Dior) 😊",
    "Salut, je voudrais une box saisonnière stp !",
    "Bonjour, je veux commander une box Noël pour offrir 🎁",
    "Hello ! Je prends un diffuseur voiture senteur Vanille 🚗",
    "Coucou, je veux bien 2 bougies Angel + 2 fondants parfumés",
    "Salut ! La box Noël m'intéresse, c'est dispo maintenant ?",
    "Bonjour ! Je commande 2 bougies Angel + 1 diffuseur voiture Monoï 💜",
    "Hey ! Je prends une box découverte + 3 fondants grands"
  ],
  remerciement: [
    "Merci beaucoup ! J'ai reçu ma commande, les bougies sentent trop bon ! 😍",
    "Super rapide la livraison ! Les bougies sont magnifiques 💜",
    "Merci ! J'adore la bougie lavande, je vais recommander 🕯️",
    "Reçu ce matin, tout est parfait ! Merci beaucoup 😊",
    "Trop contente de mes bougies ! Elles sentent incroyablement bon 🤩",
    "Merci pour la rapidité ! Mon salon sent trop bon maintenant 💕",
    "J'ai offert vos bougies à ma mère, elle adore ! Merci 🎁",
    "Les bougies sont encore mieux qu'en photo ! Merci beaucoup 😍",
    "Super qualité ! Je recommande à toutes mes copines 💜",
    "Merciii ! Les bougies sont parfaites pour mon spa à la maison 🧘"
  ],
  info_livraison: [
    "Bonjour ! J'ai passé commande hier, vous avez une idée de quand ça sera expédié ?",
    "Coucou ! Mon colis est toujours en préparation, c'est normal ? 📦",
    "Salut ! T'as un numéro de suivi pour ma commande stp ?",
    "Hey ! Ça fait 3 jours, la commande part quand ? 🚚",
    "Bonjour, vous livrez en point relais ou seulement à domicile ?",
    "Coucou ! Je pars en vacances lundi, je peux repousser la livraison ? 🏖️",
    "Salut ! Les frais de port c'est combien ?",
    "Hello ! Vous livrez en Belgique ? 🇧🇪",
    "Bonjour ! Je peux changer mon adresse de livraison ? J'ai déménagé 😅",
    "Hey ! Mon colis est marqué livré mais je l'ai pas reçu 😰"
  ],
  suivi: [
    "Hello ! J'ai reçu un mail comme quoi c'est expédié, youpi ! 🎉",
    "Coucou ! Le colis arrive demain d'après le suivi, trop hâte 😍",
    "Salut ! Je viens de recevoir, c'est trop bien emballé ! Merci 💜",
    "Hey ! J'ai reçu aujourd'hui, tout est nickel 👌",
    "Bonjour ! Colis bien reçu ce matin, parfait ! 📦",
    "Super ! Le livreur vient de passer, j'ai hâte d'ouvrir 🎁",
    "Merci ! Reçu à l'instant, ça sent déjà bon 🕯️",
    "Coucou ! Package delivered! Je vais tester ce soir 😊",
    "Salut ! Bien reçu, RAS, tout est parfait comme d'hab 💯",
    "Hello ! Colis récupéré au point relais, merci ! 📦"
  ]
}

// Avis clients templates
const REVIEW_COMMENTS = {
  5: [
    "Incroyable ! Les bougies sentent tellement bon, j'en ai commandé 3 autres juste après. La lavande est ma préférée 💜",
    "Qualité au top ! Elles brûlent longtemps et l'odeur reste même quand elles sont éteintes. Je recommande à 100% 🕯️",
    "J'adore !!! Les bougies sont magnifiques et les senteurs sont vraiment naturelles. Livraison super rapide en plus 😍",
    "Parfait de A à Z ! Emballage soigné, bougies de qualité, senteurs incroyables. Je suis fan ! 🤩",
    "Les meilleures bougies que j'ai testées ! La vanille douce sent divinement bon, j'en ai racheté 5 💕",
    "Au top ! J'ai pris le pack découverte et je ne regrette pas. Toutes les senteurs sont sublimes 🌸",
    "Trop contente de mon achat ! Les bougies tiennent longtemps et sentent vraiment bon. Merci NessyCrea ! 💜",
    "Je suis dingue de vos bougies ! J'en offre à tout le monde maintenant. La rose romantique est une tuerie 🌹",
    "Qualité exceptionnelle ! Les bougies sont artisanales et ça se voit. L'odeur est incroyable 🕯️",
    "J'adore ! Déjà ma 3ème commande. Les bougies cannelle et sapin sont parfaites pour l'hiver 🎄"
  ],
  4: [
    "Très bien ! Les bougies sentent bon, juste un peu plus petites que ce que je pensais 😊",
    "Super bougies ! J'aurais aimé qu'elles durent un peu plus longtemps mais la qualité est là 💜",
    "Contente de mon achat ! Les senteurs sont agréables, j'enlève juste une étoile pour le délai de livraison",
    "Belles bougies ! La lavande est top, par contre la vanille est un peu trop sucrée à mon goût 🕯️",
    "Bon produit ! Les bougies brûlent bien, je recommanderai mais en testant d'autres senteurs",
    "Satisfaite ! Les bougies sont jolies et sentent bon, juste le prix un peu élevé pour la taille",
    "Bien reçu ! Les bougies sont de qualité, j'aurais aimé plus de choix dans les packs 😊",
    "Top ! Les bougies sentent bon mais l'une d'entre elles était un peu abîmée à la réception",
    "Bonnes bougies ! Senteurs agréables, j'aurais préféré un emballage plus écolo 💚",
    "Content ! Les bougies sont sympas, je teste et je reviendrai sûrement 🕯️"
  ],
  3: [
    "Correct. Les bougies font le job mais rien d'exceptionnel. L'odeur s'estompe vite",
    "Moyen. La qualité est OK mais j'ai trouvé mieux ailleurs pour le même prix 😐",
    "Pas mal. Les bougies sentent bon quand elles brûlent mais pas assez puissant à mon goût",
    "Bof. Le pack 5 bougies avait 2 senteurs que je n'aime pas, dommage qu'on ne puisse pas choisir",
    "Mitigé. Une bougie sur trois avait un défaut de mèche, les autres sont bien",
    "Correct sans plus. Les senteurs sont sympas mais durent pas très longtemps",
    "Moyen. Livraison un peu longue et une bougie était cassée. Sinon ça va",
    "Pas terrible. Les bougies sentent artificielles, j'attendais mieux pour du fait main",
    "Décevant. Les bougies sont jolies mais l'odeur ne tient pas 🕯️",
    "Bof. Prix un peu élevé pour la qualité. J'ai eu mieux sur Etsy"
  ],
  2: [
    "Très déçu. Les bougies sentent le chimique, pas naturel du tout 😞",
    "Mauvaise qualité. Une bougie a coulé partout et l'odeur donne mal à la tête",
    "Pas satisfait. Les bougies se consument trop vite et l'odeur n'est pas agréable",
    "Décevant. Pour le prix, je m'attendais à beaucoup mieux. Ne recommande pas",
    "Médiocre. Les bougies sont arrivées cassées et le service client ne répond pas",
    "Pas content. L'odeur est écœurante et artificielle, loin des photos",
    "Mauvais rapport qualité/prix. Les bougies durent 2h max et sentent mauvais",
    "Déçu. Emballage cheap, bougies qui ne sentent rien. Arnaque ?",
    "Nul. J'ai jeté les bougies tellement ça sentait chimique 👎",
    "Pas terrible du tout. Les bougies fument noir et sentent le plastique brûlé"
  ],
  1: [
    "À FUIR ! Arnaque totale, les bougies sont toxiques, odeur insupportable 🤮",
    "Horrible ! J'ai eu mal à la tête pendant 2 jours à cause de l'odeur chimique",
    "CATASTROPHE ! Les bougies ont coulé partout sur ma table, tout gâché 😡",
    "NUL ! Livraison 3 semaines, bougies cassées, remboursement refusé. SCANDALE !",
    "0 ÉTOILE si je pouvais ! Produit dangereux, odeur toxique, j'ai tout jeté",
    "ARNAQUE ! Les bougies ne ressemblent pas du tout aux photos. C'est de la merde",
    "PIRE ACHAT de ma vie ! Bougies qui sentent l'essence, impossible à allumer",
    "À ÉVITER absolument ! Service client inexistant, produit de mauvaise qualité",
    "INADMISSIBLE ! Les bougies ont mis le feu à mes rideaux ! DANGER !!!",
    "Je déconseille fortement ! Produit cheap importé de Chine, pas artisanal du tout"
  ]
}

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2))
const randomChoice = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
const shuffle = <T>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5)

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const generateUsername = (firstName: string, lastName: string): string => {
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${random(10, 99)}`,
    `${lastName.toLowerCase()}.${firstName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase().slice(0, 3)}`,
  ]
  return randomChoice(formats)
}

const generateEmail = (firstName: string, lastName: string): string => {
  const domains = ['gmail.com', 'outlook.fr', 'yahoo.fr', 'hotmail.fr', 'orange.fr', 'free.fr']
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomChoice(domains)}`
}

const generatePhone = (): string => {
  return `06 ${random(10, 99)} ${random(10, 99)} ${random(10, 99)} ${random(10, 99)}`
}

const generateOrderNumber = (index?: number): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const suffix = index !== undefined ? index.toString().padStart(4, '0') : random(1000, 9999).toString()
  return `NC${date}-${suffix}`
}

// ============================================================
// SEED FUNCTIONS
// ============================================================

async function clearAllData() {
  console.log('\n🗑️  Nettoyage des données existantes...')

  // Ordre important pour respecter les foreign keys
  await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('contacts').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('✅ Données nettoyées')
}

async function seedProducts() {
  console.log(`\n🕯️  Création des produits (${PRODUCTS.length} produits NessyCrea)...`)

  const products = PRODUCTS.map(p => ({
    ...p,
    stock_quantity: random(15, 80),
    low_stock_threshold: 5,
    currency: 'EUR',
    is_active: true,
    // Mettre en vedette les produits populaires (Angel, Box Noël, etc.)
    is_featured: p.name.toLowerCase().includes('angel') || 
                 p.name.toLowerCase().includes('box') || 
                 p.name.toLowerCase().includes('diffuseur'),
    cost: parseFloat((p.price * 0.35).toFixed(2)) // Marge ~65% (réaliste pour artisanat)
  }))

  const { data, error } = await supabase.from('products').insert(products).select()

  if (error) {
    console.error('❌ Erreur produits:', error)
    throw error
  }

  console.log(`✅ ${data?.length} produits créés`)
  return data || []
}

async function seedContacts() {
  console.log('\n👥 Création de 100 clients français...')

  const contacts = []
  const now = new Date()

  for (let i = 0; i < 100; i++) {
    const isFemale = Math.random() > 0.5
    const firstName = isFemale ? randomChoice(FIRST_NAMES_F) : randomChoice(FIRST_NAMES_M)
    const lastName = randomChoice(LAST_NAMES)
    const username = generateUsername(firstName, lastName)

    // Distribution: 40% leads, 50% customers, 10% VIP
    let customerType: 'lead' | 'customer' | 'vip' = 'lead'
    if (i < 10) customerType = 'vip'
    else if (i < 60) customerType = 'customer'

    const firstContactDate = randomDate(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), now)
    const lastContactDate = randomDate(firstContactDate, now)

    contacts.push({
      instagram_id: `IG${random(100000000, 999999999)}`,
      username,
      full_name: `${firstName} ${lastName}`,
      email: Math.random() > 0.3 ? generateEmail(firstName, lastName) : null,
      phone: Math.random() > 0.5 ? generatePhone() : null,
      customer_type: customerType,
      priority_score: customerType === 'vip' ? random(80, 100) : customerType === 'customer' ? random(40, 79) : random(10, 39),
      first_contact_at: firstContactDate.toISOString(),
      last_contact_at: lastContactDate.toISOString(),
      total_messages: 0,
      total_orders: 0,
      total_spent: 0,
      sentiment_avg: randomFloat(0.3, 0.9)
    })
  }

  const { data, error } = await supabase.from('contacts').insert(contacts).select()

  if (error) {
    console.error('❌ Erreur contacts:', error)
    throw error
  }

  console.log(`✅ ${data?.length} contacts créés`)
  return data || []
}

async function seedMessages(contacts: any[]) {
  console.log('\n💬 Génération de 300-500 messages Instagram...')

  const messages = []
  const totalMessages = random(300, 500)

  for (let i = 0; i < totalMessages; i++) {
    const contact = randomChoice(contacts)
    const messageType = randomChoice(['question_produit', 'commande', 'remerciement', 'info_livraison', 'suivi'])
    const templates = MESSAGE_TEMPLATES[messageType as keyof typeof MESSAGE_TEMPLATES]
    const messageText = randomChoice(templates)

    const isInbound = Math.random() > 0.4 // 60% inbound, 40% outbound
    const receivedAt = randomDate(
      new Date(contact.first_contact_at),
      new Date(contact.last_contact_at)
    )

    messages.push({
      contact_id: contact.id,
      instagram_message_id: `IG_MSG_${random(1000000, 9999999)}`,
      message_text: messageText,
      message_type: 'text',
      direction: isInbound ? 'inbound' : 'outbound',
      sentiment_score: randomFloat(0.2, 0.95),
      sentiment_label: messageType === 'remerciement' || messageType === 'suivi' ? 'positive' :
                       messageType === 'question_produit' ? 'neutral' : 'positive',
      detected_intent: messageType === 'commande' ? 'purchase_intent' :
                       messageType === 'question_produit' ? 'question' :
                       messageType === 'remerciement' ? 'thanks' : 'info_request',
      urgency_level: messageType === 'info_livraison' && Math.random() > 0.7 ? 'high' : 'normal',
      status: isInbound ? (Math.random() > 0.8 ? 'unread' : 'responded') : 'responded',
      requires_response: isInbound && messageType !== 'remerciement',
      received_at: receivedAt.toISOString()
    })
  }

  const { data, error } = await supabase.from('messages').insert(messages).select()

  if (error) {
    console.error('❌ Erreur messages:', error)
    throw error
  }

  console.log(`✅ ${data?.length} messages créés`)
  return data || []
}

async function seedOrders(contacts: any[], products: any[]) {
  console.log('\n📦 Création de 150-200 commandes...')

  const orders = []
  const orderItems: any[] = []
  const totalOrders = random(150, 200)

  // Filtrer les produits par catégorie
  const packs = products.filter(p => p.category === 'packs' || p.category === 'boxes')
  const candles = products.filter(p => 
    p.category === 'bougies' || 
    p.category === 'bougies_luxe' || 
    p.category === 'bougies_speciales' ||
    p.name.toLowerCase().includes('bougie')
  )
  const allProducts = products.filter(p => p.category !== 'packs' && p.category !== 'boxes')

  for (let i = 0; i < totalOrders; i++) {
    const contact = randomChoice(contacts.filter(c => c.customer_type !== 'lead'))
    const orderNumber = generateOrderNumber(i)
    const createdAt = randomDate(
      new Date(contact.first_contact_at),
      new Date(contact.last_contact_at)
    )

    // 20% boxes/packs, 15% diffuseurs/fondants, 65% bougies individuelles
    const rand = Math.random()
    const items: any[] = []
    let subtotal = 0

    if (rand < 0.20 && packs.length > 0) {
      // Achète un pack/box
      const pack = randomChoice(packs)
      const quantity = 1
      items.push({
        product_id: pack.id,
        product_name: pack.name,
        product_sku: pack.sku,
        quantity,
        unit_price: pack.price,
        total_price: pack.price * quantity
      })
      subtotal = pack.price
    } else if (rand < 0.35 && candles.length > 0) {
      // Achète 1-5 bougies individuelles (moyenne 3)
      const numCandles = random(1, 5)
      const selectedCandles = shuffle(candles).slice(0, numCandles)

      selectedCandles.forEach(candle => {
        const quantity = Math.random() > 0.8 ? 2 : 1 // 20% chance d'acheter 2 de la même
        items.push({
          product_id: candle.id,
          product_name: candle.name,
          product_sku: candle.sku,
          quantity,
          unit_price: candle.price,
          total_price: candle.price * quantity
        })
        subtotal += candle.price * quantity
      })
    } else {
      // Autres produits (diffuseurs, fondants, etc.)
      const numProducts = random(1, 3)
      const selectedProducts = shuffle(allProducts).slice(0, numProducts)
      
      selectedProducts.forEach(product => {
        const quantity = Math.random() > 0.8 ? 2 : 1
        items.push({
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          quantity,
          unit_price: product.price,
          total_price: product.price * quantity
        })
        subtotal += product.price * quantity
      })
    }

    const shippingCost = subtotal >= 20 ? 0 : 3.90 // Frais de port gratuits à partir de 20€
    const totalAmount = subtotal + shippingCost

    // Distribution réaliste des statuts de commandes :
    // 60% delivered, 15% shipped, 8% processing, 7% paid, 5% cancelled, 3% pending_payment, 2% draft
    const statusRand = Math.random()
    let status: string
    let paidAt: Date | null
    let shippedAt: Date | null
    let deliveredAt: Date | null

    if (statusRand < 0.02) {
      // 2% draft - Brouillons (devis, paniers sauvegardés)
      status = 'draft'
      paidAt = null
      shippedAt = null
      deliveredAt = null
    } else if (statusRand < 0.05) {
      // 3% pending_payment - En attente de paiement (virement, PayPal en attente)
      status = 'pending_payment'
      paidAt = null
      shippedAt = null
      deliveredAt = null
    } else if (rand < 0.10) {
      // 5% cancelled - Commandes annulées
      status = 'cancelled'
      // Les commandes annulées peuvent avoir été payées ou non
      paidAt = Math.random() > 0.5
        ? new Date(createdAt.getTime() + random(1, 24) * 60 * 60 * 1000)
        : null
      shippedAt = null
      deliveredAt = null
    } else if (statusRand < 0.17) {
      // 7% paid - Payées, en attente de traitement
      status = 'paid'
      paidAt = new Date(createdAt.getTime() + random(1, 24) * 60 * 60 * 1000)
      shippedAt = null
      deliveredAt = null
    } else if (rand < 0.25) {
      // 8% processing - En préparation
      status = 'processing'
      paidAt = new Date(createdAt.getTime() + random(1, 24) * 60 * 60 * 1000)
      shippedAt = null
      deliveredAt = null
    } else if (statusRand < 0.40) {
      // 15% shipped - En transit
      status = 'shipped'
      paidAt = new Date(createdAt.getTime() + random(1, 24) * 60 * 60 * 1000)
      shippedAt = new Date(paidAt!.getTime() + random(24, 72) * 60 * 60 * 1000)
      deliveredAt = null
    } else {
      // 60% delivered - Livrées
      status = 'delivered'
      paidAt = new Date(createdAt.getTime() + random(1, 24) * 60 * 60 * 1000)
      shippedAt = new Date(paidAt!.getTime() + random(24, 72) * 60 * 60 * 1000)
      deliveredAt = new Date(shippedAt!.getTime() + random(48, 120) * 60 * 60 * 1000)
    }

    const order = {
      order_number: orderNumber,
      contact_id: contact.id,
      status,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping_cost: shippingCost,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: parseFloat(totalAmount.toFixed(2)),
      currency: 'EUR',
      payment_method: randomChoice(['paypal', 'stripe', 'bank_transfer']),
      paid_at: paidAt?.toISOString() || null,
      shipped_at: shippedAt?.toISOString() || null,
      delivered_at: deliveredAt?.toISOString() || null,
      created_at: createdAt.toISOString()
    }

    orders.push(order)

    // Stocker les items pour insert plus tard (besoin order_id)
    items.forEach(item => {
      orderItems.push({ ...item, order_number: orderNumber })
    })
  }

  const { data: ordersData, error: ordersError } = await supabase.from('orders').insert(orders).select()

  if (ordersError) {
    console.error('❌ Erreur orders:', ordersError)
    throw ordersError
  }

  console.log(`✅ ${ordersData?.length} commandes créées`)

  // Insérer les order_items avec les bons order_id
  const orderItemsWithIds = orderItems.map(item => {
    const order = ordersData?.find(o => o.order_number === item.order_number)
    const { order_number, ...itemData } = item
    return { ...itemData, order_id: order?.id }
  })

  const { data: itemsData, error: itemsError } = await supabase.from('order_items').insert(orderItemsWithIds).select()

  if (itemsError) {
    console.error('❌ Erreur order_items:', itemsError)
    throw itemsError
  }

  console.log(`✅ ${itemsData?.length} articles de commande créés`)

  return ordersData || []
}

async function seedPayments(orders: any[]) {
  console.log('\n💳 Génération des paiements...')

  // Filtrer UNIQUEMENT les commandes avec paid_at non null
  // (exclut draft, pending_payment, et certaines cancelled)
  const paidOrders = orders.filter(o => o.paid_at !== null)

  const payments = paidOrders.map(order => {
    const provider = order.payment_method === 'bank_transfer' ? 'stripe' : order.payment_method
    const fee = parseFloat((order.total_amount * 0.029 + 0.30).toFixed(2)) // Frais PayPal/Stripe ~2.9% + 0.30€
    const netAmount = parseFloat((order.total_amount - fee).toFixed(2))

    return {
      order_id: order.id,
      provider,
      transaction_id: `TXN_${provider.toUpperCase()}_${random(10000000, 99999999)}`,
      payment_status: 'completed',
      amount: order.total_amount,
      fee,
      net_amount: netAmount,
      currency: 'EUR',
      payer_email: `payer${random(1000, 9999)}@example.com`,
      payer_name: 'Client NessyCrea',
      completed_at: order.paid_at,
      created_at: order.paid_at
    }
  })

  const { data, error } = await supabase.from('payments').insert(payments).select()

  if (error) {
    console.error('❌ Erreur payments:', error)
    throw error
  }

  console.log(`✅ ${data?.length} paiements créés sur ${orders.length} commandes (${paidOrders.length} payées)`)
  return data || []
}

async function seedReviews(orders: any[], contacts: any[]) {
  console.log('\n⭐ Création de 100-150 avis clients...')

  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const numReviews = Math.min(random(100, 150), deliveredOrders.length)
  const selectedOrders = shuffle(deliveredOrders).slice(0, numReviews)

  const reviews = selectedOrders.map(order => {
    // Distribution notes: 60% 5*, 25% 4*, 10% 3*, 5% 2*-1*
    let rating = 5
    const rand = Math.random()
    if (rand > 0.95) rating = random(1, 2)
    else if (rand > 0.85) rating = 3
    else if (rand > 0.60) rating = 4

    const comments = REVIEW_COMMENTS[rating as 1 | 2 | 3 | 4 | 5]
    const comment = randomChoice(comments)

    const reviewDate = new Date(order.delivered_at)
    reviewDate.setDate(reviewDate.getDate() + random(1, 10)) // Avis 1-10 jours après livraison

    return {
      order_id: order.id,
      contact_id: order.contact_id,
      rating,
      comment,
      product_quality: Math.max(1, Math.min(rating + random(-1, 1), 5)),
      delivery_speed: Math.max(1, Math.min(rating + random(-1, 0), 5)),
      customer_service: Math.max(1, Math.min(rating + random(0, 1), 5)),
      would_recommend: rating >= 4,
      status: 'approved',
      helpful_count: rating === 5 ? random(0, 15) : random(0, 5),
      created_at: reviewDate.toISOString()
    }
  })

  const { data, error } = await supabase.from('reviews').insert(reviews).select()

  if (error) {
    console.error('❌ Erreur reviews:', error)
    throw error
  }

  console.log(`✅ ${data?.length} avis créés`)
  return data || []
}

// ============================================================
// MAIN SCRIPT
// ============================================================

async function main() {
  console.log('\n🚀 SEED DEMO DATA - NessyCrea Dashboard')
  console.log('========================================')
  console.log('📊 Génération de données de démonstration complètes\n')

  try {
    // Test connexion
    const { data: testData, error: testError } = await supabase.from('contacts').select('count').limit(1)
    if (testError) {
      console.error('❌ Erreur de connexion Supabase:', testError)
      process.exit(1)
    }
    console.log('✅ Connexion Supabase OK')
    
    // Afficher info produits chargés
    if (PRODUCTS_REAL.length > 0) {
      console.log(`✅ ${PRODUCTS_REAL.length} produits réels NessyCrea chargés depuis le JSON`)
    } else {
      console.log('⚠️  Utilisation des produits par défaut (produits-nessycrea.json non trouvé)')
    }

    // Nettoyage
    await clearAllData()

    // Génération des données
    const products = await seedProducts()
    const contacts = await seedContacts()
    const messages = await seedMessages(contacts)
    const orders = await seedOrders(contacts, products)
    const payments = await seedPayments(orders)
    const reviews = await seedReviews(orders, contacts)

    // Statistiques finales
    console.log('\n📊 RÉSUMÉ DE LA GÉNÉRATION')
    console.log('==========================')
    console.log(`✅ Produits: ${products.length} produits NessyCrea`)
    console.log(`✅ Contacts: ${contacts.length}`)
    console.log(`   - Leads: ${contacts.filter(c => c.customer_type === 'lead').length}`)
    console.log(`   - Customers: ${contacts.filter(c => c.customer_type === 'customer').length}`)
    console.log(`   - VIP: ${contacts.filter(c => c.customer_type === 'vip').length}`)
    console.log(`✅ Messages: ${messages.length}`)
    console.log(`✅ Commandes: ${orders.length}`)
    console.log(`✅ Paiements: ${payments.length}`)
    console.log(`✅ Avis: ${reviews.length}`)

    const totalRevenue = orders.filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + o.total_amount, 0)
    const avgOrderValue = totalRevenue / payments.length

    console.log(`\n💰 Chiffre d'affaires simulé: ${totalRevenue.toFixed(2)}€`)
    console.log(`📊 Panier moyen: ${avgOrderValue.toFixed(2)}€`)

    console.log('\n🎉 SEED TERMINÉ AVEC SUCCÈS !')
    console.log('👉 Vous pouvez maintenant lancer le dashboard: npm run dev')
    console.log('👉 Toutes les données sont visibles dans l\'interface\n')

  } catch (error) {
    console.error('\n❌ ERREUR LORS DU SEED:', error)
    process.exit(1)
  }
}

// Exécution
main()
