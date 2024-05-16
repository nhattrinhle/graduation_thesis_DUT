export interface SearchProps {
    keyword?: string | null
    featureId?: number | null | string
    categoryId?: number | null | string
    provinceCode?: string | null
    districtCode?: string | null
    wardCode?: string | null
    priceFrom?: number | null
    priceTo?: number | null
    landAreaFrom?: number | null
    landAreaTo?: number | null
    areaOfUseFrom?: number | null
    areaOfUseTo?: number | null
    numberOfFloorFrom?: number | null
    numberOfFloorTo?: number | null
    numberOfBedRoomFrom?: number | null
    numberOfBedRoomTo?: number | null
    numberOfToiletFrom?: number | null
    numberOfToiletTo?: number | null
    page?: number | null
    limit?: number | null
    orderBy?: string | null
    sortBy?: string | null
  }