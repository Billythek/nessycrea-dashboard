/**
 * VERIFY DEMO DATA - NessyCrea Dashboard
 *
 * Script de v?rification que toutes les donn?es de d?monstration sont pr?sentes
 * et que le syst?me est pr?t pour une d?monstration client.
 *
 * Usage: npx tsx scripts/verify-demo.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Charger les variables d'environnement
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('? ERREUR: Variables d\'environnement Supabase manquantes')
  console.error('V?rifiez .env.local avec NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface VerificationResult {
  table: string
  count: number
  status: 'ok' | 'warning' | 'error'
  message: string
}

async function verifyTable(tableName: string, minCount: number): Promise<VerificationResult> {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    if (error) {
      return {
        table: tableName,
        count: 0,
        status: 'error',
        message: `Erreur: ${error.message}`
      }
    }

    const actualCount = count || 0
    let status: 'ok' | 'warning' | 'error' = 'ok'
    let message = `${actualCount} enregistrements`

    if (actualCount === 0) {
      status = 'error'
      message = 'Aucune donn?e trouv?e - Lancez npm run seed'
    } else if (actualCount < minCount) {
      status = 'warning'
      message = `${actualCount} enregistrements (minimum recommand?: ${minCount})`
    } else {
      message = `? ${actualCount} enregistrements`
    }

    return {
      table: tableName,
      count: actualCount,
      status,
      message
    }
  } catch (error: any) {
    return {
      table: tableName,
      count: 0,
      status: 'error',
      message: `Exception: ${error.message}`
    }
  }
}

async function verifyDataIntegrity() {
  console.log('\n?? V?rification de l\'int?grit? des donn?es...\n')

  // V?rifier que les commandes ont des contacts associ?s
  const { data: ordersWithoutContact } = await supabase
    .from('orders')
    .select('id')
    .is('contact_id', null)
    .limit(1)

  if (ordersWithoutContact && ordersWithoutContact.length > 0) {
    console.log('??  Certaines commandes n\'ont pas de contact associ?')
  }

  // V?rifier que les paiements ont des commandes associ?es
  const { data: paymentsWithoutOrder } = await supabase
    .from('payments')
    .select('id')
    .is('order_id', null)
    .limit(1)

  if (paymentsWithoutOrder && paymentsWithoutOrder.length > 0) {
    console.log('??  Certains paiements n\'ont pas de commande associ?e')
  }

  // V?rifier que les messages ont des contacts associ?s
  const { data: messagesWithoutContact } = await supabase
    .from('messages')
    .select('id')
    .is('contact_id', null)
    .limit(1)

  if (messagesWithoutContact && messagesWithoutContact.length > 0) {
    console.log('??  Certains messages n\'ont pas de contact associ?')
  }

  // V?rifier que les order_items ont des commandes associ?es
  const { data: itemsWithoutOrder } = await supabase
    .from('order_items')
    .select('id')
    .is('order_id', null)
    .limit(1)

  if (itemsWithoutOrder && itemsWithoutOrder.length > 0) {
    console.log('??  Certains articles n\'ont pas de commande associ?e')
  }
}

async function verifyKPIs() {
  console.log('\n?? V?rification des KPIs calcul?s...\n')

  // Calculer le CA total
  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount, status')
    .in('status', ['paid', 'processing', 'shipped', 'delivered'])

  const revenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
  console.log(`?? Chiffre d'affaires: ${revenue.toFixed(2)}?`)

  // Calculer le panier moyen
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'completed')

  const avgOrderValue = payments && payments.length > 0
    ? payments.reduce((sum, p) => sum + Number(p.amount), 0) / payments.length
    : 0
  console.log(`?? Panier moyen: ${avgOrderValue.toFixed(2)}?`)

  // Calculer la note moyenne
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('status', 'approved')

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0
  console.log(`? Note moyenne: ${avgRating.toFixed(2)}/5`)

  // Compter les messages non lus
  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread')
    .eq('requires_response', true)

  console.log(`?? Messages non lus: ${unreadCount || 0}`)
}

async function main() {
  console.log('\n?? V?RIFICATION DES DONN?ES DE D?MONSTRATION')
  console.log('==========================================\n')

  // Test connexion
  const { data: testData, error: testError } = await supabase
    .from('contacts')
    .select('count')
    .limit(1)

  if (testError) {
    console.error('? Erreur de connexion Supabase:', testError.message)
    console.error('\nV?rifiez:')
    console.error('1. Que NEXT_PUBLIC_SUPABASE_URL est correct dans .env.local')
    console.error('2. Que NEXT_PUBLIC_SUPABASE_ANON_KEY est correct')
    console.error('3. Que votre projet Supabase n\'est pas en pause')
    process.exit(1)
  }

  console.log('? Connexion Supabase OK\n')

  // V?rifier chaque table
  const results: VerificationResult[] = []

  results.push(await verifyTable('products', 10))
  results.push(await verifyTable('contacts', 50))
  results.push(await verifyTable('messages', 200))
  results.push(await verifyTable('orders', 100))
  results.push(await verifyTable('order_items', 150))
  results.push(await verifyTable('payments', 80))
  results.push(await verifyTable('reviews', 50))

  // Afficher les r?sultats
  console.log('?? R?SULTATS DE LA V?RIFICATION')
  console.log('================================\n')

  let hasErrors = false
  let hasWarnings = false

  results.forEach(result => {
    const icon = result.status === 'ok' ? '?' : result.status === 'warning' ? '??' : '?'
    console.log(`${icon} ${result.table.padEnd(20)} : ${result.message}`)
    
    if (result.status === 'error') hasErrors = true
    if (result.status === 'warning') hasWarnings = true
  })

  // V?rifier l'int?grit? des donn?es
  await verifyDataIntegrity()

  // V?rifier les KPIs
  await verifyKPIs()

  // R?sum? final
  console.log('\n' + '='.repeat(50))
  if (hasErrors) {
    console.log('\n? ERREURS D?TECT?ES')
    console.log('Certaines tables sont vides ou ont des erreurs.')
    console.log('?? Lancez: npm run seed')
    process.exit(1)
  } else if (hasWarnings) {
    console.log('\n??  AVERTISSEMENTS')
    console.log('Certaines tables ont moins de donn?es que recommand?.')
    console.log('?? Consid?rez relancer: npm run seed')
    process.exit(0)
  } else {
    console.log('\n? TOUT EST OK !')
    console.log('Le syst?me est pr?t pour la d?monstration.')
    console.log('?? Lancez: npm run dev')
    console.log('?? Acc?dez ?: http://localhost:3000/dashboard')
  }
  console.log('='.repeat(50) + '\n')
}

main().catch(error => {
  console.error('\n? ERREUR LORS DE LA V?RIFICATION:', error)
  process.exit(1)
})
