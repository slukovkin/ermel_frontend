export interface ProductCreationAttributes {
  code: number
  article: string
  title: string
  brand: string
  categoryId: number
  price: number
  qty: number
  imageUrl: string
}

export interface IProduct {
  id: number
  code: number
  article: string
  title: string
  brand: string
  categoryId: number
  price: number
  qty: number
  imageUrl: string
  cross: number
  updatedAt: string,
  createdAt: string
}

export interface IProductInStockAttributes {
  id: number
  code: number
  article: string
  title: string
  brand: string
  categoryId: number
  price: number
  qty: number
  imageUrl: string
  cross: number
  createdAt: string
  updatedAt: string
  stores: [
    {
      id: number
      title: string
      description: string
      createdAt: string
      updatedAt: string
      ProductStore: {
        id: number
        productId: number
        storeId: number
        qty: number
        priceIn: number
        priceOut: number
        createdAt: string
        updatedAt: string
      }
    }
  ]
}

export interface IProductInBasket {
  id: number
  code: number
  article: string
  title: string
  brand: string
  categoryId: number
  imageUrl: string
  cross: number
  storeId: number
  qty: number
  priceIn: number
  priceOut: number
}
