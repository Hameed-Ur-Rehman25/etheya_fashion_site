import Image from "next/image"
import { Heart } from "lucide-react"

export interface ProductCardProps {
  imageSrc: string
  alt: string
  title: string
  description?: string
  price: string
  oldPrice?: string
  discount?: string
  showWishlist?: boolean
  showDiscount?: boolean
  showOldPrice?: boolean
  buttonLabel?: string
  buttonClass?: string
}

export function ProductCard({
  imageSrc,
  alt,
  title,
  description,
  price,
  oldPrice,
  discount,
  showWishlist = false,
  showDiscount = false,
  showOldPrice = false,
  buttonLabel = "Add to Cart",
  buttonClass = "",
}: ProductCardProps) {
  return (
    <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={alt}
            width={300}
            height={400}
            className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-500"
          />
          {showWishlist && (
            <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="text-l font-bold text-gray-900">{price}</p>
            {showOldPrice && oldPrice && (
              <p className="text-xs text-gray-500 line-through">{oldPrice}</p>
            )}
            {showDiscount && discount && (
              <span className="text-xs text-green-600 font-medium">{discount}</span>
            )}
          </div>
          <button className={`relative w-full py-2 px-4 bg-gray-900 text-white border border-gray-900 transition-all duration-500 overflow-hidden group
            hover:bg-white hover:text-gray-900 hover:border-gray-900
            before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-700
            hover:before:left-[100%] hover:before:transition-all hover:before:duration-700
            after:absolute after:inset-0 after:border-2 after:border-transparent after:transition-all after:duration-300
            hover:after:border-gray-300 hover:after:animate-pulse ${buttonClass}`}>
            <span className="relative z-20 text-sm font-medium flex items-center justify-center gap-2">
              {buttonLabel}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
