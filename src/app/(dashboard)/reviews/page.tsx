'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Star,
  Search,
  ThumbsUp,
  ThumbsDown,
  Package,
  Truck,
  MessageCircle,
  TrendingUp
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { log } from '@/lib/logger'

interface Review {
  id: string
  rating: number
  comment?: string
  product_quality?: number
  delivery_speed?: number
  customer_service?: number
  would_recommend: boolean
  status: string
  created_at: string
  contacts: {
    username: string
    full_name?: string
  } | null
  orders: {
    order_number: string
  } | null
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [recommendFilter, setRecommendFilter] = useState<string>('all')

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviews, searchQuery, ratingFilter, recommendFilter])

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          product_quality,
          delivery_speed,
          customer_service,
          would_recommend,
          status,
          created_at,
          contacts (
            username,
            full_name
          ),
          orders (
            order_number
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      // Transform data: Supabase returns contacts and orders as arrays, but Review type expects objects
      const transformedData = data?.map(review => ({
        ...review,
        contacts: Array.isArray(review.contacts) && review.contacts.length > 0
          ? review.contacts[0]
          : null,
        orders: Array.isArray(review.orders) && review.orders.length > 0
          ? review.orders[0]
          : null
      })) || []

      setReviews(transformedData)
      setFilteredReviews(transformedData)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterReviews() {
    let filtered = [...reviews]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (review) =>
          review.contacts?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.contacts?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.orders?.order_number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter((review) => review.rating === parseInt(ratingFilter))
    }

    // Recommendation filter
    if (recommendFilter !== 'all') {
      filtered = filtered.filter(
        (review) => review.would_recommend === (recommendFilter === 'yes')
      )
    }

    setFilteredReviews(filtered)
  }

  const stats = {
    total: reviews.length,
    avgRating: reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0,
    fiveStars: reviews.filter((r) => r.rating === 5).length,
    fourStars: reviews.filter((r) => r.rating === 4).length,
    threeStars: reviews.filter((r) => r.rating === 3).length,
    twoStars: reviews.filter((r) => r.rating === 2).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
    wouldRecommend: reviews.filter((r) => r.would_recommend).length,
  }

  function renderStars(rating: number, size: 'sm' | 'md' = 'md') {
    const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Avis Clients</h1>
        <p className="text-muted-foreground">Consultez tous les avis de vos clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total avis</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Note moyenne</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">{stats.avgRating.toFixed(1)}</p>
                <Star className="h-5 w-5 text-primary fill-primary" />
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Star className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">5 étoiles</p>
              <p className="text-2xl font-bold text-foreground">{stats.fiveStars}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? ((stats.fiveStars / stats.total) * 100).toFixed(0) : 0}% des avis
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recommandations</p>
              <p className="text-2xl font-bold text-foreground">{stats.wouldRecommend}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0
                  ? ((stats.wouldRecommend / stats.total) * 100).toFixed(0)
                  : 0}
                % des clients
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <ThumbsUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="p-6 bg-card border border-white/10">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Distribution des notes</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              rating === 5
                ? stats.fiveStars
                : rating === 4
                ? stats.fourStars
                : rating === 3
                ? stats.threeStars
                : rating === 2
                ? stats.twoStars
                : stats.oneStar
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-foreground">{rating}</span>
                  <Star className="h-4 w-4 text-primary fill-primary" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Filters & Search */}
      <Card className="p-4 bg-card border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un avis..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Note" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="5">5 étoiles</SelectItem>
              <SelectItem value="4">4 étoiles</SelectItem>
              <SelectItem value="3">3 étoiles</SelectItem>
              <SelectItem value="2">2 étoiles</SelectItem>
              <SelectItem value="1">1 étoile</SelectItem>
            </SelectContent>
          </Select>

          {/* Recommendation Filter */}
          <Select value={recommendFilter} onValueChange={setRecommendFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Recommandation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="yes">Recommande</SelectItem>
              <SelectItem value="no">Ne recommande pas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length === 0 ? (
          <Card className="p-8 bg-card border border-white/10">
            <p className="text-center text-muted-foreground">Aucun avis trouvé</p>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6 bg-card border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {review.contacts?.username.substring(0, 2).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">@{review.contacts?.username}</p>
                      {review.would_recommend ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Recommande
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Ne recommande pas
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      {review.orders?.order_number && (
                        <span className="text-xs text-muted-foreground">
                          • Commande {review.orders.order_number}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Comment */}
              {review.comment && (
                <div className="mb-4">
                  <p className="text-foreground">{review.comment}</p>
                </div>
              )}

              {/* Detailed Ratings */}
              {(review.product_quality || review.delivery_speed || review.customer_service) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  {review.product_quality && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Qualité produit</span>
                      </div>
                      {renderStars(review.product_quality, 'sm')}
                    </div>
                  )}

                  {review.delivery_speed && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Rapidité livraison</span>
                      </div>
                      {renderStars(review.delivery_speed, 'sm')}
                    </div>
                  )}

                  {review.customer_service && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Service client</span>
                      </div>
                      {renderStars(review.customer_service, 'sm')}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Affichage de {filteredReviews.length} avis sur {reviews.length}
      </div>
    </div>
  )
}
