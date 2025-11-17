/**
 * Helpers typ?s pour les requ?tes Supabase
 * 
 * Ces fonctions facilitent la transformation des donn?es Supabase
 * en format utilisable par l'application, avec une gestion correcte
 * des types et des relations.
 */

import { log } from './logger'
import type {
  SupabaseMessage,
  SupabaseOrder,
  SupabaseOrderItem,
  SupabaseOrderItemWithOrder,
  SupabasePayment,
  SupabaseReview,
  SupabaseContactRelation,
  OrderWithItems,
} from './types'
import {
  normalizeContact,
  normalizeSingle,
  normalizeArray,
} from './types'

// R?-exporter normalizeContact pour faciliter l'utilisation
export { normalizeContact } from './types'
import type { Message, Order, Payment, Review } from './supabase'

/**
 * Transforme un message Supabase en format Message de l'application
 */
export function transformMessage(msg: SupabaseMessage): Message & {
  contacts: {
    username: string
    full_name?: string | null
  } | null
  sentiment?: string
} {
  const normalizedContact = normalizeContact(msg.contacts)
  return {
    ...msg,
    sentiment: msg.sentiment_label || undefined,
    contacts: normalizedContact ? {
      username: normalizedContact.username,
      full_name: normalizedContact.full_name ?? null,
    } : null,
  } as Message & {
    contacts: {
      username: string
      full_name?: string | null
    } | null
    sentiment?: string
  }
}

/**
 * Transforme une commande Supabase en format OrderWithItems
 */
export function transformOrder(
  order: SupabaseOrder | OrderWithItems,
  items: SupabaseOrderItem[] = []
): OrderWithItems {
  const baseOrder = order as unknown as OrderWithItems
  return {
    ...baseOrder,
    items: items.filter((item) => item.order_id === baseOrder.id),
    contacts: normalizeContact((order as SupabaseOrder).contacts),
  }
}

/**
 * Transforme une liste de commandes Supabase avec leurs items
 */
export function transformOrders(
  orders: SupabaseOrder[],
  items: SupabaseOrderItem[] = []
): OrderWithItems[] {
  return orders.map((order) => transformOrder(order, items))
}

/**
 * Transforme un order item Supabase avec sa relation order
 */
export function transformOrderItemWithOrder(
  item: SupabaseOrderItemWithOrder
): SupabaseOrderItem {
  const typedItem = item as unknown as SupabaseOrderItem & SupabaseOrderItemWithOrder
  return {
    id: typedItem.id,
    order_id: typedItem.order_id,
    product_id: ('product_id' in typedItem ? typedItem.product_id : undefined) || undefined,
    product_name: typedItem.product_name,
    quantity: typedItem.quantity,
    price: typedItem.price,
    subtotal: typedItem.price * typedItem.quantity,
  }
}

/**
 * Transforme un paiement Supabase avec ses relations
 */
export function transformPayment(payment: SupabasePayment): Payment & {
  contacts: SupabaseContactRelation | null
  orders: { order_number: string } | null
} {
  const order = normalizeSingle(payment.orders)
  
  return {
    ...payment,
    orders: order
      ? {
          order_number: order.order_number,
        }
      : null,
    contacts: order?.contacts
      ? normalizeContact(order.contacts)
      : null,
  } as Payment & {
    contacts: SupabaseContactRelation | null
    orders: { order_number: string } | null
  }
}

/**
 * Transforme un avis Supabase avec ses relations
 */
export function transformReview(review: SupabaseReview): Review & {
  contacts: SupabaseContactRelation | null
  orders: { order_number: string } | null
} {
  const order = normalizeSingle(review.orders)
  
  return {
    ...review,
    updated_at: review.created_at, // Utiliser created_at comme fallback si updated_at n'existe pas
    contacts: normalizeContact(review.contacts),
    orders: order
      ? {
          order_number: 'order_number' in order ? order.order_number : '',
        }
      : null,
  } as Review & {
    contacts: SupabaseContactRelation | null
    orders: { order_number: string } | null
  }
}

/**
 * G?re une erreur Supabase et retourne un message d'erreur utilisateur-friendly
 */
export function handleSupabaseError(
  error: unknown,
  context: string
): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as { message: string; code?: string }
    log.supabaseError(context, error)
    
    // Messages d'erreur utilisateur-friendly selon le code d'erreur
    const errorMessages: Record<string, string> = {
      'PGRST116': 'Aucun r?sultat trouv?',
      '23505': 'Cette entr?e existe d?j?',
      '23503': 'R?f?rence invalide',
      '42501': 'Permission insuffisante',
    }
    
    if (supabaseError.code && errorMessages[supabaseError.code]) {
      return errorMessages[supabaseError.code]
    }
    
    return supabaseError.message || `Erreur lors de ${context}`
  }
  
  log.error(`Erreur inconnue dans ${context}`, error)
  return `Une erreur est survenue lors de ${context}`
}

/**
 * V?rifie si une r?ponse Supabase contient des donn?es
 */
export function hasData<T>(data: T | null | undefined): data is T {
  return data !== null && data !== undefined
}

/**
 * V?rifie si une r?ponse Supabase contient un tableau non vide
 */
export function hasArrayData<T>(data: T[] | null | undefined): data is T[] {
  return Array.isArray(data) && data.length > 0
}
