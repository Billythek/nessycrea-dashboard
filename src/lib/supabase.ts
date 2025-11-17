import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use mock data if Supabase credentials are not provided
let supabase: any

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Import mock client for local development without Supabase
  const { supabase: mockSupabase } = require('./supabase-mock')
  supabase = mockSupabase
}

export { supabase }

// Database Types
export interface Contact {
  id: string
  instagram_id: string
  username: string
  full_name?: string
  profile_pic_url?: string
  email?: string
  phone?: string
  customer_type: 'lead' | 'customer' | 'vip'
  priority_score: number
  total_messages: number
  total_orders: number
  total_spent: number
  sentiment_avg?: number
  first_contact_at: string
  last_contact_at: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  contact_id: string
  instagram_message_id?: string
  message_text?: string
  message_type: string
  media_url?: string
  direction: 'inbound' | 'outbound'
  sentiment_score?: number
  sentiment_label?: string
  detected_intent?: string
  detected_products?: string[]
  urgency_level: 'low' | 'normal' | 'high' | 'urgent'
  status: 'unread' | 'read' | 'responded' | 'archived'
  requires_response: boolean
  response_time_seconds?: number
  received_at: string
  responded_at?: string
  created_at: string
}

export interface Product {
  id: string
  sku?: string
  name: string
  description?: string
  category?: string
  price: number
  cost?: number
  currency: string
  stock_quantity: number
  low_stock_threshold: number
  image_url?: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  contact_id?: string
  status: 'draft' | 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  payment_method?: string
  payment_link?: string
  paid_at?: string
  shipped_at?: string
  delivered_at?: string
  customer_notes?: string
  internal_notes?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  order_id?: string
  provider: 'paypal' | 'stripe'
  transaction_id: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  amount: number
  fee: number
  net_amount?: number
  currency: string
  payer_email?: string
  payer_name?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

// Analytics Views
export interface DailySales {
  sale_date: string
  total_orders: number
  revenue: number
  avg_order_value: number
  unique_customers: number
}

export interface ProductPerformance {
  id: string
  sku?: string
  name: string
  category?: string
  price: number
  times_ordered: number
  total_units_sold: number
  total_revenue: number
  avg_quantity_per_order: number
}

export interface CustomerLTV {
  id: string
  username: string
  full_name?: string
  customer_type: string
  total_orders: number
  total_spent: number
  first_contact_at: string
  last_contact_at: string
  customer_age_days: number
  avg_order_value: number
  sentiment_avg?: number
  priority_score: number
}

export interface ConversionFunnel {
  total_contacts: number
  engaged_contacts: number
  converted_customers: number
  draft_orders: number
  pending_payment: number
  completed_orders: number
  conversion_rate: number
}

// Activity Types
export interface Activity {
  id: string
  message_text: string | null
  direction: 'inbound' | 'outbound'
  status: 'unread' | 'read' | 'responded' | 'archived'
  received_at: string
  contacts: {
    username: string
  } | null
}

// Order Item Type
export interface OrderItem {
  product_id?: string
  product_name: string
  quantity: number
  price: number
  subtotal: number
}

// Review Type
export interface Review {
  id: string
  contact_id?: string
  order_id?: string
  rating: number
  comment?: string
  sentiment_score?: number
  created_at: string
  updated_at: string
}

// Promotion Type
export interface Promotion {
  id: string
  name: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  start_date: string
  end_date: string
  is_active: boolean
  product_ids?: string[]
  created_at: string
  updated_at: string
}
