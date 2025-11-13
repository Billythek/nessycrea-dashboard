'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Users,
  CreditCard,
  Star,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useState, useEffect } from 'react'
import { useNotificationStore } from '@/stores/useNotificationStore'

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const { unreadMessages, pendingOrders, fetchNotifications } = useNotificationStore()

  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications()

    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      badge: unreadMessages,
    },
    {
      name: 'Commandes',
      href: '/orders',
      icon: Package,
      badge: pendingOrders,
    },
    {
      name: 'Contacts',
      href: '/contacts',
      icon: Users,
    },
    {
      name: 'Paiements',
      href: '/payments',
      icon: CreditCard,
    },
    {
      name: 'Avis',
      href: '/reviews',
      icon: Star,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Backdrop mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                N
              </div>
              <span className="text-lg font-bold text-foreground">NessyCrea</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge variant={isActive ? 'secondary' : 'default'} className="ml-auto animate-fade-in">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}

            <Separator className="my-4" />

            {/* Paramètres */}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border',
                pathname === '/settings'
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'
              )}
            >
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3 border border-border">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                NC
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">NessyCrea</p>
                <p className="text-xs text-muted-foreground truncate">admin@nessycrea.fr</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
