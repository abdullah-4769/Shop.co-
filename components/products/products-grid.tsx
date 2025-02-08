'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { ProductCard } from './product-card'
import { Filters } from './filters'
import { cn } from '@/lib/utils'
import { satoshi } from '@/app/ui/fonts'
import Link from 'next/link'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const sortOptions = [
  { label: 'Most Popular', value: 'most-popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
]

// Fetch products from API
async function fetchProducts() {
  try {
    const res = await fetch('/api/product', { cache: 'no-store' }) // Disable caching
    if (!res.ok) throw new Error('Failed to fetch products')

    const data = await res.json()
    console.log("Fetched Products:", data) // Debugging

    return data
  } catch (error) {
    console.error("Error fetching products:", error)
    return [] // Return empty array to avoid crashes
  }
}


export function ProductGrid() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        // setError("Failed to load products. Please try again.")
        setLoading(false)
      })
  }, [])
  

  if (loading) return <p className="text-center text-gray-500">Loading products...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">All Products</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className={cn("text-xl sm:text-2xl lg:text-3xl font-bold", satoshi.className)}>
            All Products
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-gray-500 text-sm sm:text-base font-normal">
              Showing {products.length} Products
            </span>
            <div className="flex items-center gap-4">
              <button
                className="sm:hidden flex items-center gap-2 px-3 py-2 border rounded-lg"
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filters</span>
              </button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:border-black transition-colors">
                  <span className="text-sm">Sort by: {selectedSort.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border p-1 min-w-[200px]">
                    {sortOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option.value}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                          option.value === selectedSort.value ? "bg-gray-100" : "hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedSort(option)}
                      >
                        {option.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <Filters />
          </div>

          {/* Mobile Filters */}
          <Filters isMobile isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {products.map((product: any) => (
                <div 
                  key={product._id} 
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="cursor-pointer"
                >
                  <ProductCard 
                    title={product.name} 
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating || 0}
                    reviews={product.reviews || 0}
                    image={product.imageUrl}
                    discount={product.discountPercent}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 sm:mt-12 flex items-center justify-center gap-1 sm:gap-2">
              <button className="p-1 sm:p-2 border rounded-lg hover:border-black transition-colors">
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              {[1, 2, 3, '...', 9, 10].map((page, i) => (
                <button
                  key={i}
                  className={cn(
                    "px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base",
                    page === 1 ? "bg-black text-white" : "hover:bg-gray-100"
                  )}
                >
                  {page}
                </button>
              ))}
              <button className="p-1 sm:p-2 border rounded-lg hover:border-black transition-colors">
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
