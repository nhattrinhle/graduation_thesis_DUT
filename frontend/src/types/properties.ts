export interface Properties {
  propertyId: number
  name: string
  code: string
  price: number
  currencyCode: string
  status: string
  landArea: string
  areaOfUse: string
  numberOfBedRoom: number
  numberOfToilet: number
  numberOfFloor: number
  direction: string
  description: string
  createdAt: string
  updatedAt: string
  feature: Feature
  category: Category
  location: Location
  images: Image[]
  seller: Seller
  remainingTime: number
  expiresAt: string
  savedRemainingRentalTime: number
  fullLocationText: string
}

export interface Feature {
  featureId: number
  name: string
}

export interface Category {
  categoryId: number
  name: string
}

export interface Location {
  locationId: number
  wardCode: string
  districtCode: string
  provinceCode: string
  street: string
  address: string
  lat: string
  lng: string
}

export interface Image {
  imageId: number
  imageUrl: string
}

export interface Seller {
  userId: number
  fullName: string
  email: string
  phone: string
  avatar: string
}
