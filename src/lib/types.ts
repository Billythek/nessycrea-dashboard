/**
 * Types partag?s pour l'application NessyCrea Dashboard
 * 
 * Ce fichier contient tous les types TypeScript r?utilisables dans l'application,
 * notamment pour les donn?es Supabase et les transformations de donn?es.
 */

import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Contact, Message, Order, OrderItem, Payment, Review } from './supabase'

// ============================================================================
// Types Supabase avec relations
// ============================================================================

/**
 * Message avec contact associ? (format retourn? par Supabase)
 */
export interface SupabaseMessage {
  id: string
  message_text: string | null
  direction: 'inbound' | 'outbound'
  status: 'unread' | 'read' | 'responded' | 'archived'
  received_at: string
  sentiment_label?: string | null
  requires_response: boolean
  contacts: SupabaseContactRelation | SupabaseContactRelation[] | null
}

/**
 * Contact relation dans les requ?tes Supabase
 */
export interface SupabaseContactRelation {
  username: string
  full_name?: string | null
}

/**
 * Order avec items et contact (format retourn? par Supabase)
 */
export interface SupabaseOrder {
  id: string
  order_number: string
  total_amount: number
  status: Order['status']
  created_at: string
  shipping_address?: string | null
  contacts: SupabaseContactRelation | SupabaseContactRelation[] | null
}

/**
 * OrderItem complet depuis Supabase
 */
export interface SupabaseOrderItem {
  id?: string
  order_id: string
  product_id?: string | null
  product_name: string
  quantity: number
  price: number
  subtotal: number
}

/**
 * OrderItem avec relation order (pour les requ?tes avec join)
 */
export interface SupabaseOrderItemWithOrder {
  id?: string
  order_id: string
  product_name: string
  quantity: number
  price: number
  orders?: {
    status: Order['status']
  } | null
}

/**
 * Order transform?e pour l'affichage
 */
export interface OrderWithItems extends Order {
  items: SupabaseOrderItem[]
  contacts: SupabaseContactRelation | null
  shipping_address?: string | null
}

/**
 * Payment avec relations (format retourn? par Supabase)
 */
export interface SupabasePayment {
  id: string
  transaction_id: string
  amount: number
  currency: string
  provider: Payment['provider']
  payment_status: Payment['payment_status']
  payer_name?: string | null
  payer_email?: string | null
  completed_at?: string | null
  created_at: string
  orders?: {
    order_number: string
    contacts?: SupabaseContactRelation | SupabaseContactRelation[] | null
  } | null
}

/**
 * Review avec relations (format retourn? par Supabase)
 */
export interface SupabaseReview {
  id: string
  rating: number
  comment?: string | null
  product_quality?: number | null
  delivery_speed?: number | null
  customer_service?: number | null
  would_recommend: boolean
  status: string
  created_at: string
  contacts: SupabaseContactRelation | SupabaseContactRelation[] | null
  orders: {
    order_number: string
  } | SupabaseOrder[] | null
}

// ============================================================================
// Types pour les composants UI
// ============================================================================

/**
 * Configuration de statut pour les badges
 */
export interface StatusConfig {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: ComponentType<{ className?: string }>
}

/**
 * Type pour les ic?nes Lucide
 */
export type StatusIcon = LucideIcon

// ============================================================================
// Types pour les statistiques
// ============================================================================

/**
 * Statistiques de messages
 */
export interface MessageStats {
  all: number
  unread: number
  read: number
  responded: number
}

/**
 * Statistiques de commandes
 */
export interface OrderStats {
  total: number
  revenue: number
  paid: number
  processing: number
  shipped: number
  delivered: number
}

/**
 * Statistiques de contacts
 */
export interface ContactStats {
  total: number
  leads: number
  customers: number
  vip: number
  totalRevenue: number
  avgSpent: number
}

/**
 * Statistiques de paiements
 */
export interface PaymentStats {
  total: number
  revenue: number
  completed: number
  pending: number
  failed: number
  refunded: number
}

/**
 * Statistiques d'avis
 */
export interface ReviewStats {
  total: number
  avgRating: number
  fiveStars: number
  fourStars: number
  threeStars: number
  twoStars: number
  oneStar: number
  wouldRecommend: number
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * V?rifie si une valeur est un tableau de contacts Supabase
 */
export function isContactArray(
  value: SupabaseContactRelation | SupabaseContactRelation[] | null | undefined
): value is SupabaseContactRelation[] {
  return Array.isArray(value) && value.length > 0
}

/**
 * V?rifie si une valeur est un contact unique Supabase
 */
export function isContactSingle(
  value: SupabaseContactRelation | SupabaseContactRelation[] | null | undefined
): value is SupabaseContactRelation {
  return value !== null && value !== undefined && !Array.isArray(value)
}

/**
 * Normalise un contact Supabase (peut ?tre un tableau ou un objet)
 */
export function normalizeContact(
  contact: SupabaseContactRelation | SupabaseContactRelation[] | null | undefined
): SupabaseContactRelation | null {
  if (!contact) return null
  if (Array.isArray(contact)) {
    return contact.length > 0 ? contact[0] : null
  }
  return contact
}

/**
 * Normalise un tableau (peut ?tre un seul ?l?ment ou un tableau)
 */
export function normalizeArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return [value]
}

/**
 * Normalise un ?l?ment unique depuis un tableau Supabase
 */
export function normalizeSingle<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : null
  }
  return value
}
