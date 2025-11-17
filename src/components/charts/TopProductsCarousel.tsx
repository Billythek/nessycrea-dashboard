"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getStockColor, DASHBOARD_COLORS, STOCK_THRESHOLDS } from "@/lib/colors"
import { ShoppingBag, TrendingUp } from "lucide-react"

interface Product {
  id: string
  name: string
  image: string
  price: number
  sold: number
  stock: number
  revenue: number
}

interface TopProductsCarouselProps {
  products: Product[]
}

export default function TopProductsCarousel({ products }: TopProductsCarouselProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const getStockBadge = (stock: number) => {
    if (stock < STOCK_THRESHOLDS.LOW) {
      return { label: "Stock faible", color: DASHBOARD_COLORS.product.stockLow }
    }
    if (stock < STOCK_THRESHOLDS.MEDIUM) {
      return { label: "Stock moyen", color: DASHBOARD_COLORS.product.stockMedium }
    }
    return { label: "En stock", color: DASHBOARD_COLORS.product.stockHigh }
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Produits les plus vendus</h3>
        <div className="flex gap-2">
          <CarouselPrevious className="relative static translate-y-0" />
          <CarouselNext className="relative static translate-y-0" />
        </div>
      </div>

      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product, index) => {
          const stockBadge = getStockBadge(product.stock)

          return (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Link href={`/products/${product.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all duration-300"
                  style={{
                    borderColor: DASHBOARD_COLORS.product.cardBorder,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = DASHBOARD_COLORS.product.cardBorderHover
                    e.currentTarget.style.boxShadow = `0 0 20px ${DASHBOARD_COLORS.animation.glow}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = DASHBOARD_COLORS.product.cardBorder
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  {/* Rank badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs shadow-lg"
                      style={{
                        backgroundColor: DASHBOARD_COLORS.chart.revenuePrimary,
                        color: "#000",
                      }}
                    >
                      #{index + 1}
                    </div>
                  </div>

                  {/* Stock badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className="rounded-full px-2 py-1 text-xs font-semibold shadow-lg"
                      style={{
                        backgroundColor: `${stockBadge.color}20`,
                        color: stockBadge.color,
                        border: `1px solid ${stockBadge.color}`,
                      }}
                    >
                      {product.stock}
                    </div>
                  </div>

                  {/* Product image */}
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    {product.image && product.image !== '/placeholder-product.jpg' ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="text-center p-8">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-2" />
                        <span className="text-xs text-muted-foreground/50">Image produit</span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="space-y-2">
                    {/* Name */}
                    <h4 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-lg font-bold"
                        style={{ color: DASHBOARD_COLORS.product.priceColor }}
                      >
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp
                          className="h-4 w-4"
                          style={{ color: DASHBOARD_COLORS.product.soldCountColor }}
                        />
                        <span
                          className="text-sm font-semibold tabular-nums"
                          style={{ color: DASHBOARD_COLORS.product.soldCountColor }}
                        >
                          {product.sold}
                        </span>
                        <span className="text-xs text-muted-foreground">vendus</span>
                      </div>

                      <div className="text-right">
                        <div
                          className="text-sm font-bold tabular-nums"
                          style={{ color: DASHBOARD_COLORS.chart.revenuePrimary }}
                        >
                          {formatCurrency(product.revenue)}
                        </div>
                        <div className="text-xs text-muted-foreground">CA total</div>
                      </div>
                    </div>
                  </div>

                  {/* Shimmer effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: DASHBOARD_COLORS.animation.shimmer,
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s linear infinite",
                    }}
                  />
                </motion.div>
              </Link>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}
