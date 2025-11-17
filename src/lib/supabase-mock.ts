// Mock Supabase client pour fonctionner sans base de données
import type { Contact, Message, Product, Order, Payment, Review, DailySales, Activity, Promotion } from './supabase'

// Données de démonstration
const mockContacts: Contact[] = [
  {
    id: '1',
    instagram_id: 'IG123456789',
    username: 'marie.dubois',
    full_name: 'Marie Dubois',
    email: 'marie.dubois@gmail.com',
    phone: '06 12 34 56 78',
    customer_type: 'vip',
    priority_score: 95,
    total_messages: 45,
    total_orders: 12,
    total_spent: 156.80,
    sentiment_avg: 0.92,
    first_contact_at: '2024-09-15T10:00:00Z',
    last_contact_at: '2025-01-10T15:30:00Z',
    created_at: '2024-09-15T10:00:00Z',
    updated_at: '2025-01-10T15:30:00Z'
  },
  {
    id: '2',
    instagram_id: 'IG987654321',
    username: 'sophie.martin',
    full_name: 'Sophie Martin',
    email: 'sophie.martin@outlook.fr',
    customer_type: 'customer',
    priority_score: 65,
    total_messages: 18,
    total_orders: 5,
    total_spent: 67.50,
    sentiment_avg: 0.85,
    first_contact_at: '2024-10-20T14:00:00Z',
    last_contact_at: '2025-01-08T10:15:00Z',
    created_at: '2024-10-20T14:00:00Z',
    updated_at: '2025-01-08T10:15:00Z'
  }
]

const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'BG-ANGEL-001',
    name: 'Bougie Angel',
    description: 'Bougie parfumée Angel, senteur douce et envoûtante',
    category: 'bougies_luxe',
    price: 4.50,
    cost: 1.58,
    currency: 'EUR',
    stock_quantity: 45,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z'
  },
  {
    id: '2',
    sku: 'DF-VOIT-001',
    name: 'Diffuseur Voiture Vanille',
    description: 'Diffuseur pour voiture senteur vanille',
    category: 'diffuseurs',
    price: 3.50,
    cost: 1.23,
    currency: 'EUR',
    stock_quantity: 67,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z'
  },
  {
    id: '3',
    sku: 'BOX-NOEL-001',
    name: 'Box Noël',
    description: 'Coffret cadeau pour les fêtes',
    category: 'boxes',
    price: 25.00,
    cost: 8.75,
    currency: 'EUR',
    stock_quantity: 23,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z'
  }
]

const mockMessages: Message[] = [
  {
    id: '1',
    contact_id: '1',
    instagram_message_id: 'IG_MSG_1234567',
    message_text: 'Bonjour ! J\'aimerais savoir si vous avez des bougies Angel en stock ? 💜',
    message_type: 'text',
    direction: 'inbound',
    sentiment_score: 0.85,
    sentiment_label: 'positive',
    detected_intent: 'question',
    urgency_level: 'normal',
    status: 'responded',
    requires_response: false,
    received_at: '2025-01-10T10:00:00Z',
    responded_at: '2025-01-10T10:15:00Z',
    created_at: '2025-01-10T10:00:00Z'
  },
  {
    id: '2',
    contact_id: '2',
    instagram_message_id: 'IG_MSG_7654321',
    message_text: 'Je voudrais commander 2 bougies Angel svp !',
    message_type: 'text',
    direction: 'inbound',
    sentiment_score: 0.92,
    sentiment_label: 'positive',
    detected_intent: 'purchase_intent',
    urgency_level: 'high',
    status: 'unread',
    requires_response: true,
    received_at: '2025-01-11T14:30:00Z',
    created_at: '2025-01-11T14:30:00Z'
  }
]

const mockOrders: Order[] = [
  {
    id: '1',
    order_number: 'NC20250110-0001',
    contact_id: '1',
    status: 'delivered',
    subtotal: 13.50,
    shipping_cost: 3.90,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 17.40,
    currency: 'EUR',
    payment_method: 'paypal',
    paid_at: '2025-01-10T11:00:00Z',
    shipped_at: '2025-01-11T09:00:00Z',
    delivered_at: '2025-01-12T15:00:00Z',
    created_at: '2025-01-10T10:30:00Z',
    updated_at: '2025-01-12T15:00:00Z'
  },
  {
    id: '2',
    order_number: 'NC20250109-0002',
    contact_id: '2',
    status: 'shipped',
    subtotal: 25.00,
    shipping_cost: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 25.00,
    currency: 'EUR',
    payment_method: 'stripe',
    paid_at: '2025-01-09T14:00:00Z',
    shipped_at: '2025-01-10T10:00:00Z',
    created_at: '2025-01-09T13:45:00Z',
    updated_at: '2025-01-10T10:00:00Z'
  },
  {
    id: '3',
    order_number: 'NC20250116-0003',
    contact_id: '1',
    status: 'pending_payment',
    subtotal: 9.00,
    shipping_cost: 3.90,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 12.90,
    currency: 'EUR',
    payment_method: 'paypal',
    created_at: '2025-01-16T08:00:00Z',
    updated_at: '2025-01-16T08:00:00Z'
  },
  {
    id: '4',
    order_number: 'NC20250116-0004',
    contact_id: '2',
    status: 'draft',
    subtotal: 4.50,
    shipping_cost: 3.90,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 8.40,
    currency: 'EUR',
    created_at: '2025-01-16T09:30:00Z',
    updated_at: '2025-01-16T09:30:00Z'
  }
]

// Générer des données de ventes sur 30 jours
const generateDailySales = (): DailySales[] => {
  const sales: DailySales[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    sales.push({
      sale_date: date.toISOString().split('T')[0],
      total_orders: Math.floor(Math.random() * 10) + 2,
      revenue: Math.floor(Math.random() * 300) + 50,
      avg_order_value: Math.floor(Math.random() * 30) + 15,
      unique_customers: Math.floor(Math.random() * 8) + 2
    })
  }

  return sales
}

const mockDailySales = generateDailySales()

const mockReviews: Review[] = [
  {
    id: '1',
    contact_id: '1',
    order_id: '1',
    rating: 5,
    comment: 'Incroyable ! Les bougies sentent tellement bon, j\'en ai commandé 3 autres juste après. La lavande est ma préférée 💜',
    sentiment_score: 0.95,
    created_at: '2025-01-13T10:00:00Z',
    updated_at: '2025-01-13T10:00:00Z'
  },
  {
    id: '2',
    contact_id: '2',
    order_id: '2',
    rating: 4,
    comment: 'Très bien ! Les bougies sentent bon, juste un peu plus petites que ce que je pensais 😊',
    sentiment_score: 0.78,
    created_at: '2025-01-12T15:00:00Z',
    updated_at: '2025-01-12T15:00:00Z'
  }
]

let mockPromotions: Promotion[] = [
  {
    id: 'promo_1',
    name: 'Soldes Hiver',
    description: '-15% sur toutes les bougies',
    discount_type: 'percentage',
    discount_value: 15,
    start_date: '2025-01-01',
    end_date: '2025-01-31',
    is_active: true,
    product_ids: ['1', '2'],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'promo_2',
    name: 'Box Noël Promo',
    description: '-5€ sur les box',
    discount_type: 'fixed',
    discount_value: 5,
    start_date: '2024-12-01',
    end_date: '2025-12-31',
    is_active: true,
    product_ids: ['3'],
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  }
]

// Mutable storage for CRUD operations
let productsStore = [...mockProducts]
let promotionsStore = [...mockPromotions]

// Mock du client Supabase
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string, options?: any) => {
      let data: any[] = []

      switch (table) {
        case 'contacts':
          data = mockContacts
          break
        case 'messages':
          data = mockMessages
          break
        case 'products':
          data = productsStore
          break
        case 'orders':
          data = mockOrders
          break
        case 'daily_sales':
          data = mockDailySales
          break
        case 'reviews':
          data = mockReviews
          break
        case 'promotions':
          data = promotionsStore
          break
        case 'conversion_funnel':
          return {
            single: () => Promise.resolve({
              data: { conversion_rate: 0.35 },
              error: null
            })
          }
        case 'order_items':
          data = [
            { product_name: 'Bougie Angel', quantity: 3, order_id: '1', orders: { status: 'delivered' } },
            { product_name: 'Diffuseur Voiture Vanille', quantity: 2, order_id: '1', orders: { status: 'delivered' } },
            { product_name: 'Box Noël', quantity: 1, order_id: '2', orders: { status: 'shipped' } }
          ]
          break
      }

      // Handle head: true for count only queries
      const isCountOnly = options?.head === true && options?.count === 'exact'
      const returnCount = options?.count === 'exact'

      return {
        eq: (column: string, value: any) => {
          const filteredByFirst = data.filter((item: any) => item[column] === value)
          return {
            eq: (col2: string, val2: any) => {
              const filtered = filteredByFirst.filter((item: any) => item[col2] === val2)
              return Promise.resolve({
                data: isCountOnly ? null : filtered,
                count: filtered.length,
                error: null
              })
            },
            in: (col2: string, values: any[]) => {
              const filtered = filteredByFirst.filter((item: any) => values.includes(item[col2]))
              return Promise.resolve({
                data: isCountOnly ? null : filtered,
                count: filtered.length,
                error: null
              })
            },
            then: (resolve: any) => {
              return resolve({
                data: isCountOnly ? null : filteredByFirst,
                count: filteredByFirst.length,
                error: null
              })
            }
          }
        },
        in: (column: string, values: any[]) => {
          const filtered = data.filter((item: any) => values.includes(item[column]))
          return {
            then: (resolve: any) => resolve({
              data: isCountOnly ? null : filtered,
              count: returnCount ? filtered.length : undefined,
              error: null
            })
          }
        },
        gte: (column: string, value: any) => ({
          order: (col: string, opts: any) => Promise.resolve({
            data: data.filter((item: any) => new Date(item[column]) >= new Date(value))
              .sort((a: any, b: any) => opts.ascending
                ? new Date(a[col]).getTime() - new Date(b[col]).getTime()
                : new Date(b[col]).getTime() - new Date(a[col]).getTime()
              ),
            error: null
          })
        }),
        order: (column: string, options: any) => ({
          limit: (n: number) => Promise.resolve({
            data: [...data].sort((a: any, b: any) => {
              if (options.ascending) {
                return a[column] > b[column] ? 1 : -1
              }
              return a[column] < b[column] ? 1 : -1
            }).slice(0, n),
            error: null
          }),
          then: (resolve: any) => resolve({
            data: [...data].sort((a: any, b: any) => {
              if (options.ascending) {
                return a[column] > b[column] ? 1 : -1
              }
              return a[column] < b[column] ? 1 : -1
            }),
            error: null
          })
        }),
        limit: (n: number) => Promise.resolve({
          data: data.slice(0, n),
          error: null
        }),
        single: () => Promise.resolve({
          data: data[0] || null,
          error: null
        }),
        then: (resolve: any) => resolve({
          data,
          count: options?.count === 'exact' ? data.length : undefined,
          error: null
        })
      }
    },
    insert: (newData: any[]) => {
      if (table === 'products') {
        productsStore = [...productsStore, ...newData]
      } else if (table === 'promotions') {
        promotionsStore = [...promotionsStore, ...newData]
      }
      return Promise.resolve({ data: newData, error: null })
    },
    update: (updateData: any) => ({
      eq: (column: string, value: any) => {
        if (table === 'products') {
          productsStore = productsStore.map((item: any) =>
            item[column] === value ? { ...item, ...updateData } : item
          )
        } else if (table === 'promotions') {
          promotionsStore = promotionsStore.map((item: any) =>
            item[column] === value ? { ...item, ...updateData } : item
          )
        }
        return Promise.resolve({ data: updateData, error: null })
      }
    }),
    delete: () => ({
      eq: (column: string, value: any) => {
        if (table === 'products') {
          productsStore = productsStore.filter((item: any) => item[column] !== value)
        } else if (table === 'promotions') {
          promotionsStore = promotionsStore.filter((item: any) => item[column] !== value)
        }
        return Promise.resolve({ data: null, error: null })
      }
    })
  })
}
