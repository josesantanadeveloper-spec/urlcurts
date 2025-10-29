export interface Variant {
  id?: number
  name: string // ex: 'Tamanho'
  options: string[] // ex: ['P', 'M', 'G']
}

export interface Product {
  id?: number
  name: string
  price: number
  description?: string
  image?: string
  variantsCor?: Variant[]
  variantsSize?: Variant[]
}
