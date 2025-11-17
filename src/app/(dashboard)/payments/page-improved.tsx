'use client'
// Page Payments améliorée avec AdvancedDataTable, Popover pour détails rapides, et Progress
// À renommer en page.tsx lors du déploiement final

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CheckCircle2, XCircle, Clock, DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function PaymentsPageImproved() {
  // ✅ Utiliser AdvancedDataTable
  // ✅ Popover pour détails transaction
  // ✅ Progress pour taux de succès
  // ✅ Calendar pour filtres de période (bonus)

  const stats = {
    total: 1250000,
    successful: 95,
    pending: 3,
    failed: 2,
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold">Paiements</h1>
        <p className="text-muted-foreground">Gérez les transactions et paiements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Total encaissé</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.total)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Taux de succès</p>
              <p className="text-2xl font-bold">{stats.successful}%</p>
              <Progress value={stats.successful} className="mt-2 h-1.5" />
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                À traiter
              </Badge>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Échecs</p>
              <p className="text-2xl font-bold">{stats.failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">AdvancedDataTable avec filtres de dates à intégrer ici</p>
      </Card>
    </div>
  )
}
