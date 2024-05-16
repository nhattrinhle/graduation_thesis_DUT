import React, { ReactNode, useEffect, useState } from 'react'
import { Properties } from '@/types'
import PropertyCard from '../Properties/PropertyCard'
import style from './styles.module.scss'
import { Button } from '@mantine/core'
import { FEATURED_FOR_RENT } from '../../constants/category.constant'

const QUANTITY_PROPERTY_TO_SHOW = 8

type Props = {
  title?: string
  properties: Properties[]
  filter?: string | number
  children?: ReactNode
}
const FeaturedProperties = ({ title, properties, children }: Props) => {
  const [showButton, setShowButton] = useState<boolean>(false)
  const [visibleProperty, setVisibleProperty] = useState<number>(QUANTITY_PROPERTY_TO_SHOW)
  const [propertiesToShow, setPropertiesToShow] = useState<Properties[]>([])
  
  useEffect(() => {
    if (properties.length > 0) {
      const initList = properties.slice(0, visibleProperty)
      setPropertiesToShow(initList)
      if (properties.length > visibleProperty) {
        setShowButton(true)
      }
    }
  }, [properties, visibleProperty])

  useEffect(() => {
    if (visibleProperty >= properties.length) {
      setShowButton(false)
    }
  }, [visibleProperty, properties.length])

  const handleViewMore = () => {
    setVisibleProperty((prevCount) => prevCount + QUANTITY_PROPERTY_TO_SHOW)
  }

  return (
    <div className={style.featuredContainer}>
      <div className={style.featuredTitle}>{title}</div>
      <span className={style.featuredLineBreak}></span>
      <div className={style.featuredContent}>
        {propertiesToShow.length > 0 ? (
          propertiesToShow.map((property) => {
            return <PropertyCard key={property.propertyId} data={property} />
          })
        ) : (
          <p>No featured properties available.</p>
        )}
      </div>
      {children}

      <div className={style.buttonContainer}>
        {showButton && (
          <Button
            classNames={{
              root:
                title === FEATURED_FOR_RENT
                  ? style.rootButtonRent
                  : style.rootButtonSale,
            }}
            variant="filled"
            onClick={handleViewMore}
          >
            View more
          </Button>
        )}
      </div>
    </div>
  )
}

export default FeaturedProperties
