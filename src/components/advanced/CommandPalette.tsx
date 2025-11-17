"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { log } from "@/lib/logger"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  LayoutDashboard,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  Star,
  Users,
  Settings,
  Search,
  FileText,
  Bell,
} from "lucide-react"

interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode
  action: () => void
  keywords?: string[]
}

interface CommandGroup {
  heading: string
  items: CommandItem[]
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commandGroups: CommandGroup[] = [
    {
      heading: "Navigation",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
          action: () => {
            router.push("/dashboard")
            setOpen(false)
          },
          keywords: ["accueil", "home", "stats"],
        },
        {
          id: "messages",
          label: "Messages",
          icon: <MessageSquare className="mr-2 h-4 w-4" />,
          action: () => {
            router.push("/messages")
            setOpen(false)
          },
          keywords: ["messages", "conversations", "chat"],
        },
        {
          id: "orders",
          label: "Commandes",
          icon: <ShoppingCart className="mr-2 h-4 w-4" />,
          action: () => {
            router.push("/orders")
            setOpen(false)
          },
          keywords: ["commandes", "orders", "achats"],
        },
        {
          id: "payments",
          label: "Paiements",
          icon: <CreditCard className="mr-2 h-4 w-4" />,
          action: () => {
            router.push("/payments")
            setOpen(false)
          },
          keywords: ["paiements", "payments", "transactions"],
        },
        {
          id: "reviews",
          label: "Avis",
          icon: <Star className="mr-2 h-4 w-4" />,
          action: () => {
            router.push("/reviews")
            setOpen(false)
          },
          keywords: ["avis", "reviews", "commentaires"],
        },
        {
          id: "contacts",
          label: "Contacts",
          icon: <Users className="mr-2 h-4 w-4" />,
          action: () => {
            router.push("/contacts")
            setOpen(false)
          },
          keywords: ["contacts", "clients", "customers"],
        },
      ],
    },
    {
      heading: "Actions Rapides",
      items: [
        {
          id: "new-order",
          label: "Nouvelle commande",
          icon: <ShoppingCart className="mr-2 h-4 w-4" />,
          action: () => {
            // TODO: Open new order modal
            console.log("New order")
            setOpen(false)
          },
          keywords: ["nouvelle", "commande", "créer"],
        },
        {
          id: "new-contact",
          label: "Nouveau contact",
          icon: <Users className="mr-2 h-4 w-4" />,
          action: () => {
            // TODO: Open new contact modal
            console.log("New contact")
            setOpen(false)
          },
          keywords: ["nouveau", "contact", "client"],
        },
        {
          id: "search-messages",
          label: "Rechercher dans les messages",
          icon: <Search className="mr-2 h-4 w-4" />,
          action: () => {
            router.push("/messages?search=true")
            setOpen(false)
          },
          keywords: ["rechercher", "messages", "search"],
        },
      ],
    },
    {
      heading: "Paramètres",
      items: [
        {
          id: "settings",
          label: "Paramètres",
          icon: <Settings className="mr-2 h-4 w-4" />,
          action: () => {
            // TODO: Navigate to settings
            console.log("Settings")
            setOpen(false)
          },
          keywords: ["paramètres", "settings", "config"],
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: <Bell className="mr-2 h-4 w-4" />,
          action: () => {
            // TODO: Open notifications
            log.info("Notifications - fonctionnalité à implémenter")
            setOpen(false)
          },
          keywords: ["notifications", "alerts"],
        },
      ],
    },
  ]

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez une commande ou recherchez..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          {commandGroups.map((group) => (
            <React.Fragment key={group.heading}>
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={item.action}
                    className="cursor-pointer"
                    keywords={item.keywords}
                  >
                    {item.icon}
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
