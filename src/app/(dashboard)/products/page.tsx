'use client'

import { useState, useEffect } from 'react'
import { supabase, Product, Promotion } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Tag,
  AlertCircle,
  Check,
  X,
  Image as ImageIcon,
  Percent,
  Euro,
  Calendar,
  Flame,
  Star
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className={`bg-card p-6 rounded-3xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto animate-scale-in`}
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
function Toast({ message, isVisible, type = 'success' }: { message: string; isVisible: boolean; type?: 'success' | 'error' }) {
  if (!isVisible) return null

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium animate-fade-up ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {message}
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'error' })

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    cost: '',
    stock_quantity: '',
    category: 'bougie',
    image_url: '',
    is_active: true,
    is_featured: false,
    low_stock_threshold: '5'
  })

  // Promotion form state
  const [promoForm, setPromoForm] = useState({
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    start_date: '',
    end_date: '',
    is_active: true,
    product_ids: [] as string[]
  })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, visible: true, type })
    setTimeout(() => setToast({ message: '', visible: false, type: 'success' }), 2500)
  }

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      showToast('Erreur de chargement des produits', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPromotions(data || [])
    } catch (err) {
      console.error('Error fetching promotions:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchPromotions()
  }, [])

  // Reset product form
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      sku: '',
      price: '',
      cost: '',
      stock_quantity: '',
      category: 'bougie',
      image_url: '',
      is_active: true,
      is_featured: false,
      low_stock_threshold: '5'
    })
    setEditingProduct(null)
  }

  // Reset promo form
  const resetPromoForm = () => {
    setPromoForm({
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      start_date: '',
      end_date: '',
      is_active: true,
      product_ids: []
    })
    setEditingPromo(null)
  }

  // Open edit product modal
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      sku: product.sku || '',
      price: product.price.toString(),
      cost: product.cost?.toString() || '',
      stock_quantity: product.stock_quantity.toString(),
      category: product.category || 'bougie',
      image_url: product.image_url || '',
      is_active: product.is_active,
      is_featured: product.is_featured,
      low_stock_threshold: product.low_stock_threshold.toString()
    })
    setShowProductModal(true)
  }

  // Save product (create or update)
  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      showToast('Nom et prix sont requis', 'error')
      return
    }

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description || null,
        sku: productForm.sku || null,
        price: parseFloat(productForm.price),
        cost: productForm.cost ? parseFloat(productForm.cost) : null,
        stock_quantity: parseInt(productForm.stock_quantity) || 0,
        category: productForm.category,
        image_url: productForm.image_url || null,
        is_active: productForm.is_active,
        is_featured: productForm.is_featured,
        low_stock_threshold: parseInt(productForm.low_stock_threshold) || 5,
        currency: 'EUR',
        updated_at: new Date().toISOString()
      }

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
        showToast('Produit mis à jour !')
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([{
            ...productData,
            id: `prod_${Date.now()}`,
            created_at: new Date().toISOString()
          }])

        if (error) throw error
        showToast('Produit ajouté !')
      }

      setShowProductModal(false)
      resetProductForm()
      fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err)
      showToast('Erreur lors de la sauvegarde', 'error')
    }
  }

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deletingProduct.id)

      if (error) throw error
      showToast('Produit supprimé !')
      setShowDeleteConfirm(false)
      setDeletingProduct(null)
      fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  // Save promotion
  const handleSavePromo = async () => {
    if (!promoForm.name || !promoForm.discount_value || !promoForm.start_date || !promoForm.end_date) {
      showToast('Tous les champs sont requis', 'error')
      return
    }

    try {
      const promoData = {
        name: promoForm.name,
        description: promoForm.description || null,
        discount_type: promoForm.discount_type,
        discount_value: parseFloat(promoForm.discount_value),
        start_date: promoForm.start_date,
        end_date: promoForm.end_date,
        is_active: promoForm.is_active,
        product_ids: promoForm.product_ids,
        updated_at: new Date().toISOString()
      }

      if (editingPromo) {
        const { error } = await supabase
          .from('promotions')
          .update(promoData)
          .eq('id', editingPromo.id)

        if (error) throw error
        showToast('Promotion mise à jour !')
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert([{
            ...promoData,
            id: `promo_${Date.now()}`,
            created_at: new Date().toISOString()
          }])

        if (error) throw error
        showToast('Promotion ajoutée !')
      }

      setShowPromoModal(false)
      resetPromoForm()
      fetchPromotions()
    } catch (err) {
      console.error('Error saving promotion:', err)
      showToast('Erreur lors de la sauvegarde', 'error')
    }
  }

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get active promotion for a product
  const getProductPromo = (productId: string) => {
    const now = new Date()
    return promotions.find(promo =>
      promo.is_active &&
      promo.product_ids?.includes(productId) &&
      new Date(promo.start_date) <= now &&
      new Date(promo.end_date) >= now
    )
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded-xl w-48" />
          <div className="h-12 bg-muted rounded-xl" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">Mes Produits</h1>
          <p className="text-sm text-muted-foreground">
            Gère ton catalogue de bougies et tes promotions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetPromoForm()
              setShowPromoModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl font-medium active:scale-95 transition-transform"
          >
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter Promo</span>
          </button>
          <button
            onClick={() => {
              resetProductForm()
              setShowProductModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter Produit</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* Active Promotions */}
      {promotions.filter(p => p.is_active).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Tag className="h-5 w-5 text-amber-500" />
            Promotions actives
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {promotions.filter(p => p.is_active).map((promo) => (
              <div
                key={promo.id}
                className="min-w-[250px] p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{promo.name}</span>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : formatCurrency(promo.discount_value)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{promo.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Jusqu'au {new Date(promo.end_date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const promo = getProductPromo(product.id)
          const discountedPrice = promo
            ? promo.discount_type === 'percentage'
              ? product.price * (1 - promo.discount_value / 100)
              : product.price - promo.discount_value
            : null

          return (
            <div
              key={product.id}
              className={`bg-card p-4 rounded-2xl border border-border/50 relative ${
                !product.is_active ? 'opacity-60' : ''
              }`}
            >
              {/* Badges */}
              <div className="absolute top-3 right-3 flex gap-1">
                {promo && (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    PROMO
                  </Badge>
                )}
                {product.is_featured && (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Star className="h-3 w-3 mr-1" />
                    Vedette
                  </Badge>
                )}
                {product.stock_quantity <= product.low_stock_threshold && (
                  <Badge variant="destructive">
                    Stock bas
                  </Badge>
                )}
              </div>

              {/* Product Image */}
              <div className="w-full h-32 bg-muted rounded-xl mb-3 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Flame className="h-10 w-10 text-muted-foreground/50" />
                )}
              </div>

              {/* Product Info */}
              <h4 className="font-semibold mb-1">{product.name}</h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {product.description || 'Pas de description'}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div>
                  {discountedPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">{formatCurrency(discountedPrice)}</span>
                      <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="font-semibold">{product.stock_quantity}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>SKU: {product.sku || 'N/A'}</span>
                <span className="capitalize">{product.category}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-muted rounded-xl text-sm font-medium hover:bg-muted/80 active:scale-95 transition-all"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setDeletingProduct(product)
                    setShowDeleteConfirm(true)
                  }}
                  className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-95 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun produit trouvé</p>
          <button
            onClick={() => {
              resetProductForm()
              setShowProductModal(true)
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Ajouter mon premier produit
          </button>
        </div>
      )}

      {/* Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          resetProductForm()
        }}
        title={editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              placeholder="Bougie Parfumée Lavande"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
              rows={3}
              placeholder="Bougie artisanale au parfum de lavande..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                placeholder="BG-LAV-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="bougie">Bougie</option>
                <option value="diffuseur">Diffuseur</option>
                <option value="box">Box</option>
                <option value="accessoire">Accessoire</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Prix de vente * (€)</label>
              <input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                placeholder="15.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Coût (€)</label>
              <input
                type="number"
                step="0.01"
                value={productForm.cost}
                onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                placeholder="5.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={productForm.stock_quantity}
                onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Seuil stock bas</label>
              <input
                type="number"
                value={productForm.low_stock_threshold}
                onChange={(e) => setProductForm({ ...productForm, low_stock_threshold: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL de l'image</label>
            <input
              type="url"
              value={productForm.image_url}
              onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={productForm.is_active}
                onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Produit actif</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={productForm.is_featured}
                onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Produit vedette</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => {
                setShowProductModal(false)
                resetProductForm()
              }}
              className="flex-1 px-4 py-3 bg-muted rounded-xl font-medium active:scale-95 transition-transform"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveProduct}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium active:scale-95 transition-transform"
            >
              {editingProduct ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Promotion Modal */}
      <Modal
        isOpen={showPromoModal}
        onClose={() => {
          setShowPromoModal(false)
          resetPromoForm()
        }}
        title={editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la promotion *</label>
            <input
              type="text"
              value={promoForm.name}
              onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              placeholder="Soldes d'été"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={promoForm.description}
              onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              placeholder="-20% sur toutes les bougies"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Type de réduction</label>
              <select
                value={promoForm.discount_type}
                onChange={(e) => setPromoForm({ ...promoForm, discount_type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Valeur * {promoForm.discount_type === 'percentage' ? '(%)' : '(€)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={promoForm.discount_value}
                onChange={(e) => setPromoForm({ ...promoForm, discount_value: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
                placeholder={promoForm.discount_type === 'percentage' ? '20' : '5'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date de début *</label>
              <input
                type="date"
                value={promoForm.start_date}
                onChange={(e) => setPromoForm({ ...promoForm, start_date: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de fin *</label>
              <input
                type="date"
                value={promoForm.end_date}
                onChange={(e) => setPromoForm({ ...promoForm, end_date: e.target.value })}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Produits concernés</label>
            <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-muted rounded-xl border border-border">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoForm.product_ids.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPromoForm({ ...promoForm, product_ids: [...promoForm.product_ids, product.id] })
                      } else {
                        setPromoForm({ ...promoForm, product_ids: promoForm.product_ids.filter(id => id !== product.id) })
                      }
                    }}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{product.name}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={promoForm.is_active}
              onChange={(e) => setPromoForm({ ...promoForm, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Promotion active</span>
          </label>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => {
                setShowPromoModal(false)
                resetPromoForm()
              }}
              className="flex-1 px-4 py-3 bg-muted rounded-xl font-medium active:scale-95 transition-transform"
            >
              Annuler
            </button>
            <button
              onClick={handleSavePromo}
              className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium active:scale-95 transition-transform"
            >
              {editingPromo ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setDeletingProduct(null)
        }}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="mb-4">
            Es-tu sûr de vouloir supprimer <strong>{deletingProduct?.name}</strong> ?
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Cette action est irréversible.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowDeleteConfirm(false)
                setDeletingProduct(null)
              }}
              className="flex-1 px-4 py-3 bg-muted rounded-xl font-medium active:scale-95 transition-transform"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteProduct}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium active:scale-95 transition-transform"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      <Toast message={toast.message} isVisible={toast.visible} type={toast.type} />
    </div>
  )
}
