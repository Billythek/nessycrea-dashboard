import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Merci de définir SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL) et SUPABASE_SERVICE_ROLE_KEY avant d\'exécuter ce script.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const ORDER_STATUS_BLUEPRINT = [
  { orderStatus: 'paid', paymentStatus: 'completed' },
  { orderStatus: 'processing', paymentStatus: 'completed' },
  { orderStatus: 'shipped', paymentStatus: 'completed' },
  { orderStatus: 'delivered', paymentStatus: 'completed' },
  { orderStatus: 'pending_payment', paymentStatus: 'pending' },
  { orderStatus: 'draft', paymentStatus: null },
  { orderStatus: 'cancelled', paymentStatus: 'failed' },
  { orderStatus: 'pending', paymentStatus: 'pending' },
  { orderStatus: 'refunded', paymentStatus: 'refunded' },
]

const CUSTOMER_TYPES = ['lead', 'customer', 'vip']
const PAYMENT_PROVIDERS = ['stripe', 'paypal']
const PAYMENT_METHODS = ['card', 'paypal', 'bank_transfer']

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generateProducts() {
  const catalog = [
    { name: 'Pack Réseaux Sociaux', price: 129 },
    { name: 'Coaching Reels', price: 89 },
    { name: 'Bundle Branding', price: 249 },
    { name: 'Template Canva Premium', price: 49 },
    { name: 'Audit Instagram', price: 159 },
  ]

  const products = []
  const itemsCount = randomInt(1, 4)

  for (let i = 0; i < itemsCount; i += 1) {
    const chosen = sample(catalog)
    const quantity = randomInt(1, 3)
    products.push({
      product_id: crypto.randomUUID(),
      product_name: chosen.name,
      quantity,
      price: chosen.price,
      subtotal: chosen.price * quantity,
    })
  }

  return products
}

function computeOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const shipping = subtotal > 200 ? 0 : 9.9
  const taxAmount = Number((subtotal * 0.2).toFixed(2))
  const discount = subtotal > 300 ? Number((subtotal * 0.05).toFixed(2)) : 0
  const total = Number((subtotal + shipping + taxAmount - discount).toFixed(2))

  return {
    subtotal,
    shipping_cost: shipping,
    tax_amount: taxAmount,
    discount_amount: discount,
    total_amount: total,
  }
}

function generateDateWithinMonths(months = 6) {
  const now = new Date()
  const past = new Date()
  past.setMonth(now.getMonth() - months)
  const timestamp = randomInt(past.getTime(), now.getTime())
  return new Date(timestamp)
}

async function purgePreviousDemoData() {
  console.log('🧹 Suppression des données de démonstration existantes...')
  await supabase.from('payments').delete().like('transaction_id', 'demo-%')
  await supabase.from('orders').delete().like('order_number', 'DEMO-%')
  await supabase.from('contacts').delete().like('username', 'demo_user_%')
}

function buildContactsPayload(count = 100) {
  const contacts = []
  for (let i = 1; i <= count; i += 1) {
    const createdAt = generateDateWithinMonths(12)
    const updatedAt = new Date(createdAt.getTime() + randomInt(1, 15) * 24 * 60 * 60 * 1000)
    contacts.push({
      id: crypto.randomUUID(),
      instagram_id: `insta_demo_${i}`,
      username: `demo_user_${i}`,
      full_name: `Client Demo ${i}`,
      email: `demo_user_${i}@example.com`,
      phone: `+336${randomInt(10000000, 99999999)}`,
      customer_type: sample(CUSTOMER_TYPES),
      priority_score: randomInt(10, 90),
      total_messages: randomInt(5, 120),
      total_orders: 0,
      total_spent: 0,
      sentiment_avg: Math.random() * 2 - 1,
      first_contact_at: createdAt.toISOString(),
      last_contact_at: updatedAt.toISOString(),
      created_at: createdAt.toISOString(),
      updated_at: updatedAt.toISOString(),
    })
  }
  return contacts
}

function buildOrdersAndPayments(contacts) {
  const orders = []
  const payments = []

  contacts.forEach((contact, index) => {
    const orderCount = randomInt(0, 3)
    let contactOrderTotal = 0
    let contactTotalSpent = 0

    for (let i = 0; i < orderCount; i += 1) {
      const blueprint = sample(ORDER_STATUS_BLUEPRINT)
      const items = generateProducts()
      const totals = computeOrderTotals(items)
      const orderDate = generateDateWithinMonths(6)
      const orderId = crypto.randomUUID()

      const paidAt = ['paid', 'processing', 'shipped', 'delivered'].includes(blueprint.orderStatus)
        ? new Date(orderDate.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000).toISOString()
        : null

      orders.push({
        id: orderId,
        order_number: `DEMO-${String(index + 1).padStart(3, '0')}-${String(i + 1).padStart(2, '0')}`,
        contact_id: contact.id,
        status: blueprint.orderStatus,
        items,
        subtotal: totals.subtotal,
        shipping_cost: totals.shipping_cost,
        tax_amount: totals.tax_amount,
        discount_amount: totals.discount_amount,
        total_amount: totals.total_amount,
        currency: 'EUR',
        payment_method: sample(PAYMENT_METHODS),
        payment_link: `https://pay.nessycrea.com/${orderId}`,
        paid_at: paidAt,
        shipping_address: `12 rue de la Demo, Paris ${75000 + index}`,
        created_at: orderDate.toISOString(),
        updated_at: orderDate.toISOString(),
      })

      contactOrderTotal += 1
      contactTotalSpent += totals.total_amount

      if (blueprint.paymentStatus) {
        const paymentId = crypto.randomUUID()
        const paymentDate = paidAt || new Date(orderDate.getTime() + randomInt(1, 10) * 24 * 60 * 60 * 1000).toISOString()

        payments.push({
          id: paymentId,
          order_id: orderId,
          provider: sample(PAYMENT_PROVIDERS),
          transaction_id: `demo-${orderId.substring(0, 8)}-${i + 1}`,
          payment_status: blueprint.paymentStatus,
          amount: totals.total_amount,
          fee: Number((totals.total_amount * 0.029 + 0.25).toFixed(2)),
          net_amount: Number((totals.total_amount - (totals.total_amount * 0.029 + 0.25)).toFixed(2)),
          currency: 'EUR',
          payer_email: contact.email,
          payer_name: contact.full_name,
          completed_at: blueprint.paymentStatus === 'completed' ? paymentDate : null,
          created_at: orderDate.toISOString(),
          updated_at: paymentDate,
        })
      }
    }

    contact.total_orders = contactOrderTotal
    contact.total_spent = Number(contactTotalSpent.toFixed(2))
  })

  return { orders, payments }
}

async function insertBatch(table, rows, chunkSize = 50) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize)
    const { error } = await supabase.from(table).insert(batch)
    if (error) {
      console.error(`❌ Erreur d'insertion dans ${table}:`, error)
      process.exit(1)
    }
  }
}

async function upsertContacts(contacts) {
  const { error } = await supabase.from('contacts').insert(contacts)
  if (error) {
    console.error('❌ Erreur lors de l\'insertion des contacts :', error)
    process.exit(1)
  }
}

async function main() {
  console.log('🚀 Seed de données de démonstration NessyCrea')
  console.log('-------------------------------------------')

  await purgePreviousDemoData()

  console.log('👥 Génération de 100 contacts...')
  const contactsPayload = buildContactsPayload(100)
  await upsertContacts(contactsPayload)

  console.log('📦 Génération des commandes et paiements associés...')
  const { orders, payments } = buildOrdersAndPayments(contactsPayload)

  if (orders.length > 0) {
    await insertBatch('orders', orders)
  }

  if (payments.length > 0) {
    await insertBatch('payments', payments)
  }

  console.log(`✅ Seed terminé : ${contactsPayload.length} contacts, ${orders.length} commandes, ${payments.length} paiements.`)
  console.log('ℹ️   Les enregistrements portent le préfixe "demo_" pour être facilement filtrés ou supprimés ultérieurement.')
}

main().catch((error) => {
  console.error('❌ Erreur inattendue :', error)
  process.exit(1)
})
