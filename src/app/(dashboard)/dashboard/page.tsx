'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  AlertCircle,
  Euro,
  TrendingUp,
  Star,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Flame,
  Target,
  Trophy,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Zap,
  Heart,
  X,
  Settings,
  Moon,
  Sun,
  Share2,
  Bell
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ActivityTimeline } from '@/components/advanced'
import { NumberTicker } from '@/components/magic'
import OrderStatusChart from '@/components/charts/OrderStatusChart'
import RevenueChart from '@/components/charts/RevenueChart'
import TopProductsCarousel from '@/components/charts/TopProductsCarousel'
import {
  useDashboardStats,
  useRevenueData,
  useTopProducts,
  useOrderStatus,
  useRecentActivity,
  useRatingDistribution
} from '@/hooks/useDashboard'
import { useTheme } from '@/components/providers/ThemeProvider'

// Greeting personnalisé selon l'heure
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

// Motivation message selon performance
function getMotivationMessage(revenue: number, objective: number): { text: string; emoji: string } {
  const progress = (revenue / objective) * 100
  if (progress >= 100) return { text: "Objectif EXPLOSÉ ! Tu gères 🔥", emoji: "🏆" }
  if (progress >= 75) return { text: "Dernière ligne droite, fonce !", emoji: "🚀" }
  if (progress >= 50) return { text: "À mi-chemin, continue comme ça !", emoji: "💪" }
  if (progress >= 25) return { text: "Bon début, accélère !", emoji: "⚡" }
  return { text: "C'est parti pour un nouveau mois !", emoji: "✨" }
}

// Progress Circle Component - Animé et satisfaisant
function ProgressCircle({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  children
}: {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = Math.min((animatedValue / max) * 100, 100)
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 500)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(16, 65%, 45%)" />
            <stop offset="100%" stopColor="hsl(28, 80%, 52%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

// Quick Stat Pill - Mobile optimized
function StatPill({
  icon,
  label,
  value,
  trend
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border/50 active:scale-95 transition-transform">
      <div className="p-2 rounded-xl bg-primary/10">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-base font-bold truncate">{value}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend.value}%
        </div>
      )}
    </div>
  )
}

// Achievement Badge - Gamification
function AchievementBadge({
  icon,
  title,
  unlocked = false
}: {
  icon: React.ReactNode
  title: string
  unlocked?: boolean
}) {
  return (
    <div className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
      unlocked
        ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 scale-100'
        : 'bg-muted/30 scale-95 opacity-50'
    }`}>
      <div className={`p-2 rounded-xl ${unlocked ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-muted'}`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-center">{title}</span>
    </div>
  )
}

// Swipeable Insight Card - Mobile gesture friendly
function InsightCard({
  title,
  value,
  description,
  icon,
  color = 'terracotta',
  onClick
}: {
  title: string
  value: string | React.ReactNode
  description: string
  icon: React.ReactNode
  color?: 'terracotta' | 'copper' | 'sage'
  onClick?: () => void
}) {
  const colorClasses = {
    terracotta: 'from-[hsl(16,65%,45%)]/10 to-[hsl(16,65%,45%)]/5 border-[hsl(16,65%,45%)]/20',
    copper: 'from-[hsl(28,80%,52%)]/10 to-[hsl(28,80%,52%)]/5 border-[hsl(28,80%,52%)]/20',
    sage: 'from-[hsl(140,20%,75%)]/20 to-[hsl(140,20%,75%)]/10 border-[hsl(140,20%,75%)]/30'
  }

  return (
    <div
      className={`p-5 rounded-3xl bg-gradient-to-br ${colorClasses[color]} border min-w-[280px] snap-center cursor-pointer active:scale-95 transition-transform`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

// Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-up" onClick={onClose}>
      <div
        className="bg-card p-6 rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Toast notification
function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium animate-fade-up">
      {message}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { data: stats, isLoading: statsLoading, error: statsError, refetch } = useDashboardStats()
  const { data: revenueData = [], isLoading: revenueLoading } = useRevenueData()
  const { data: productData = [], isLoading: productsLoading } = useTopProducts()
  const { data: orderStatusData = [], isLoading: statusLoading } = useOrderStatus()
  const { data: activities = [], isLoading: activitiesLoading } = useRecentActivity()

  const [showCelebration, setShowCelebration] = useState(false)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showObjectiveModal, setShowObjectiveModal] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<{ icon: React.ReactNode; title: string; description: string } | null>(null)
  const [toast, setToast] = useState({ message: '', visible: false })
  const [revenueObjective, setRevenueObjective] = useState(10000)
  const [tempObjective, setTempObjective] = useState('10000')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const isLoading = statsLoading || revenueLoading || productsLoading || statusLoading

  // Show toast helper
  const showToast = (message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast({ message: '', visible: false }), 2500)
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    toggleTheme()
    showToast(theme === 'dark' ? 'Mode clair activé' : 'Mode sombre activé')
  }

  // Share stats
  const handleShare = async () => {
    const shareText = `🚀 Mon business aujourd'hui:\n💰 CA: ${formatCurrency(stats?.revenue || 0)}\n📦 Commandes: ${stats?.totalOrders || 0}\n⭐ Note: ${(stats?.avgRating || 0).toFixed(1)}/5`

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText })
        showToast('Partagé avec succès !')
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      showToast('Copié dans le presse-papier !')
    }
  }

  // Reload data
  const handleReload = () => {
    refetch?.()
    showToast('Données actualisées !')
  }

  // Save objective
  const saveObjective = () => {
    const newObjective = parseInt(tempObjective)
    if (newObjective > 0) {
      setRevenueObjective(newObjective)
      setShowObjectiveModal(false)
      showToast(`Objectif mis à jour: ${formatCurrency(newObjective)}`)
    }
  }

  // Badge click handler
  const handleBadgeClick = (badge: { icon: React.ReactNode; title: string; description: string; unlocked: boolean }) => {
    setSelectedBadge(badge)
    setShowBadgeModal(true)
  }

  useEffect(() => {
    // Celebration effect when objective reached
    if (stats?.revenue && stats.revenue >= revenueObjective && !showCelebration) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [stats?.revenue, showCelebration, revenueObjective])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Erreur de chargement</p>
          <button
            onClick={handleReload}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 mx-auto active:scale-95 transition-transform"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const revenueProgress = Math.min((stats?.revenue || 0) / revenueObjective * 100, 100)
  const avgCart = (stats?.revenue || 0) / (stats?.totalOrders || 1)
  const motivation = getMotivationMessage(stats?.revenue || 0, revenueObjective)

  // Fake streak data (would come from DB)
  const currentStreak = 7
  const bestStreak = 12

  // Badge definitions
  const badges = [
    {
      icon: <Target className="h-5 w-5 text-amber-600" />,
      title: '1er objectif',
      description: 'Atteindre 25% de ton objectif mensuel',
      unlocked: revenueProgress >= 25
    },
    {
      icon: <Zap className="h-5 w-5 text-amber-600" />,
      title: '10 ventes',
      description: 'Réaliser 10 ventes au total',
      unlocked: (stats?.totalOrders || 0) >= 10
    },
    {
      icon: <Flame className="h-5 w-5 text-amber-600" />,
      title: '7j streak',
      description: 'Se connecter 7 jours consécutifs',
      unlocked: currentStreak >= 7
    },
    {
      icon: <Heart className="h-5 w-5 text-amber-600" />,
      title: '5 étoiles',
      description: 'Maintenir une note moyenne de 4.5/5',
      unlocked: (stats?.avgRating || 0) >= 4.5
    }
  ]

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-up">
          <div className="bg-card p-8 rounded-3xl text-center animate-scale-in">
            <Trophy className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2">OBJECTIF ATTEINT ! 🎉</h2>
            <p className="text-muted-foreground">Tu as dépassé les {formatCurrency(revenueObjective)}</p>
          </div>
        </div>
      )}

      {/* HEADER - Mobile optimized with greeting */}
      <header className="p-4 lg:p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-1">
              {getGreeting()} ! {motivation.emoji}
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              {motivation.text}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-muted transition-colors active:scale-95"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl hover:bg-muted transition-colors active:scale-95"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleReload}
              className="p-2 rounded-xl hover:bg-muted transition-colors active:scale-95"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-2xl w-fit">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-bold text-orange-600">{currentStreak}</span>
          <span className="text-xs text-muted-foreground">jours de suite</span>
        </div>
      </header>

      {/* MAIN KPI - Hero Section with Progress Circle */}
      <section className="px-4 lg:px-6 mb-6 animate-fade-up stagger-1">
        <div className="bg-gradient-to-br from-card to-secondary/10 p-6 rounded-3xl border border-border/50">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Progress Circle - Clickable to modify objective */}
            <button
              onClick={() => {
                setTempObjective(revenueObjective.toString())
                setShowObjectiveModal(true)
              }}
              className="relative group active:scale-95 transition-transform"
            >
              <ProgressCircle value={stats?.revenue || 0} max={revenueObjective} size={140} strokeWidth={10}>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-medium">OBJECTIF</p>
                  <p className="text-2xl font-bold">{revenueProgress.toFixed(0)}%</p>
                </div>
              </ProgressCircle>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </button>

            {/* Revenue Info */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm text-muted-foreground font-medium mb-1">CHIFFRE D'AFFAIRES</p>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                <NumberTicker value={stats?.revenue || 0} formatCurrency decimals={0} />
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-600">
                <ArrowUpRight className="h-5 w-5" />
                <span className="font-semibold">+24.5%</span>
                <span className="text-sm text-muted-foreground">vs mois dernier</span>
              </div>
              <div className="mt-3 text-sm">
                <span className="text-muted-foreground">Il te reste </span>
                <span className="font-semibold">{formatCurrency(Math.max(0, revenueObjective - (stats?.revenue || 0)))}</span>
                <span className="text-muted-foreground"> pour l'objectif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS - 2x2 Grid Mobile */}
      <section className="px-4 lg:px-6 mb-6 animate-fade-up stagger-2">
        <div className="grid grid-cols-2 gap-3">
          <div onClick={() => router.push('/messages')} className="cursor-pointer">
            <StatPill
              icon={<MessageSquare className="h-4 w-4 text-primary" />}
              label="Messages"
              value={stats?.totalMessages || 0}
              trend={{ value: 12, positive: true }}
            />
          </div>
          <div onClick={() => router.push('/orders')} className="cursor-pointer">
            <StatPill
              icon={<ShoppingCart className="h-4 w-4 text-primary" />}
              label="Commandes"
              value={stats?.totalOrders || 0}
              trend={{ value: 8, positive: true }}
            />
          </div>
          <div onClick={() => router.push('/reviews')} className="cursor-pointer">
            <StatPill
              icon={<Star className="h-4 w-4 text-amber-500" />}
              label="Note"
              value={`${(stats?.avgRating || 0).toFixed(1)}/5`}
            />
          </div>
          <div onClick={() => router.push('/payments')} className="cursor-pointer">
            <StatPill
              icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
              label="Conversion"
              value={`${(stats?.conversionRate || 0).toFixed(1)}%`}
              trend={{ value: 15, positive: true }}
            />
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS - Gamification */}
      <section className="px-4 lg:px-6 mb-6 animate-fade-up stagger-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Tes badges</h3>
          <button
            onClick={() => showToast(`${badges.filter(b => b.unlocked).length}/${badges.length} badges débloqués !`)}
            className="text-sm text-primary font-medium flex items-center gap-1 active:scale-95 transition-transform"
          >
            Voir tout <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {badges.map((badge, index) => (
            <button
              key={index}
              onClick={() => handleBadgeClick(badge)}
              className="active:scale-95 transition-transform"
            >
              <AchievementBadge
                icon={badge.icon}
                title={badge.title}
                unlocked={badge.unlocked}
              />
            </button>
          ))}
        </div>
      </section>

      {/* INSIGHTS - Horizontally scrollable cards */}
      <section className="mb-6 animate-fade-up stagger-4">
        <div className="px-4 lg:px-6 flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Insights du jour</h3>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 lg:px-6 snap-x snap-mandatory scrollbar-hide">
          <InsightCard
            title="Panier moyen"
            value={formatCurrency(avgCart)}
            description="En hausse de 12% cette semaine"
            icon={<ShoppingCart className="h-5 w-5 text-[hsl(16,65%,45%)]" />}
            color="terracotta"
            onClick={() => {
              router.push('/orders')
              showToast('Voir toutes les commandes')
            }}
          />
          <InsightCard
            title="Meilleur jour"
            value="Mercredi"
            description="68% de tes ventes cette semaine"
            icon={<Trophy className="h-5 w-5 text-[hsl(28,80%,52%)]" />}
            color="copper"
            onClick={() => showToast('Astuce: Concentre tes efforts le mercredi !')}
          />
          <InsightCard
            title="Clients fidèles"
            value={`${Math.floor((stats?.totalMessages || 0) / 5)}`}
            description="Ont commandé plus d'une fois"
            icon={<Users className="h-5 w-5 text-[hsl(140,20%,55%)]" />}
            color="sage"
            onClick={() => {
              router.push('/contacts')
              showToast('Voir tous tes contacts')
            }}
          />
        </div>
      </section>

      {/* REVENUE CHART */}
      <section className="px-4 lg:px-6 mb-6 animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <div className="bg-card p-4 lg:p-6 rounded-3xl border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Évolution CA</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
              +15.3%
            </span>
          </div>

          {revenueData.length > 0 ? (
            <RevenueChart
              data={{
                day: revenueData.slice(-7).map((item, index) => ({
                  label: `J${index + 1}`,
                  revenue: item['Chiffre d\'affaires'] || 0,
                })),
                week: revenueData.slice(-4).map((item, index) => ({
                  label: `S${index + 1}`,
                  revenue: item['Chiffre d\'affaires'] || 0,
                })),
                month: revenueData.map((item) => ({
                  label: item.date || '',
                  revenue: item['Chiffre d\'affaires'] || 0,
                })),
                year: revenueData.slice(-12).map((item, index) => ({
                  label: `M${index + 1}`,
                  revenue: item['Chiffre d\'affaires'] || 0,
                })),
              }}
              trend={15.3}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune donnée encore</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TOP PRODUCTS - Compact for mobile */}
      <section className="px-4 lg:px-6 mb-6 animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
        <div className="bg-card p-4 lg:p-6 rounded-3xl border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top produits</h3>
            <button
              onClick={() => {
                router.push('/orders')
                showToast('Voir tous les produits')
              }}
              className="text-sm text-primary font-medium active:scale-95 transition-transform"
            >
              Voir tout
            </button>
          </div>

          {productData.length > 0 ? (
            <div className="space-y-3">
              {productData.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-2xl">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.name || 'Produit'}</p>
                    <p className="text-sm text-muted-foreground">{item.Ventes || 0} vendus</p>
                  </div>
                  <p className="font-semibold">{formatCurrency((item.Ventes || 0) * avgCart * 0.8)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Aucun produit</p>
            </div>
          )}
        </div>
      </section>

      {/* RECENT ACTIVITY - Timeline compact */}
      <section className="px-4 lg:px-6 mb-6 animate-fade-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
        <div className="bg-card p-4 lg:p-6 rounded-3xl border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Activité récente</h3>
            <span className="text-xs text-muted-foreground">Dernières 24h</span>
          </div>

          {activitiesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <ActivityTimeline activities={activities} />
            </div>
          )}
        </div>
      </section>

      {/* FOOTER - Motivational */}
      <footer className="px-4 lg:px-6 pb-8 text-center">
        <p className="text-sm text-muted-foreground">
          Continue comme ça, tu es sur la bonne voie ! 🌟
        </p>
      </footer>

      {/* MODALS */}
      {/* Badge Detail Modal */}
      <Modal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        title="Détail du badge"
      >
        {selectedBadge && (
          <div className="text-center">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 w-fit mx-auto mb-4">
              {selectedBadge.icon}
            </div>
            <h4 className="text-lg font-bold mb-2">{selectedBadge.title}</h4>
            <p className="text-muted-foreground mb-4">{selectedBadge.description}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              (selectedBadge as any).unlocked
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}>
              {(selectedBadge as any).unlocked ? '✓ Débloqué' : '🔒 Verrouillé'}
            </div>
          </div>
        )}
      </Modal>

      {/* Objective Setting Modal */}
      <Modal
        isOpen={showObjectiveModal}
        onClose={() => setShowObjectiveModal(false)}
        title="Modifier l'objectif"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Objectif de chiffre d'affaires mensuel
          </label>
          <div className="relative mb-4">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="number"
              value={tempObjective}
              onChange={(e) => setTempObjective(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              placeholder="10000"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowObjectiveModal(false)}
              className="flex-1 px-4 py-3 bg-muted rounded-xl font-medium active:scale-95 transition-transform"
            >
              Annuler
            </button>
            <button
              onClick={saveObjective}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium active:scale-95 transition-transform"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notifications */}
      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  )
}
