import React, { useEffect } from 'react'
import Container from '../../components/Container/Container'
import FeaturedProperties from '../../components/FeaturedProperties/FeaturedProperties'
import BannerValue from '../../components/BannerValue/BannerValue'
import BannerWelcome from '../../components/BannerWelcome/BannerWelcome'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import {
  getAllPropertiesForSale,
  getAllPropertiesForRent,
} from '../../redux/reducers/homeSlice'
import { Properties } from '@/types'
import SlideShow from '../../components/Slideshow/SlideShow'
import MultiCarousel from '../../components/MultiCarousel/MultiCarousel'
import style from './HomePage.module.scss'
import { getAllWishList } from '../../redux/reducers/propertySlice'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'
import MapProperties from '../../components/Map/MapProperties'

const HomePage = () => {
  const salesList: Properties[] = useAppSelector(
    (state) => state.home.propertiesListForSale,
  )
  const rentsList: Properties[] = useAppSelector(
    (state) => state.home.propertiesListForRent,
  )

  const wishList: Properties[] = useAppSelector(
    (state) => state.property.listFavorites,
  )

  const signedIn = useAppSelector((state) => state.session.signedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAllPropertiesForSale())
  }, [dispatch])

  useEffect(() => {
    dispatch(getAllPropertiesForRent())
  }, [dispatch])

  useEffect(() => {
    if (signedIn) {
      dispatch(getAllWishList())
    }
  }, [dispatch])

  return (
    <div>
      <Container>
        <SlideShow />
        {rentsList && (
          <FeaturedProperties
            properties={rentsList}
            title="FEATURED FOR RENT"
          ></FeaturedProperties>
        )}

        <BannerValue />

        {salesList && (
          <FeaturedProperties
            properties={salesList}
            title="FEATURED FOR SALE"
          ></FeaturedProperties>
        )}

        <div className={style.coverWishList}>
          {wishList?.length > 0 && (
            <MultiCarousel properties={wishList} title="YOUR WISHLIST" />
          )}
        </div>

        <div className="lg:px-30 mobile:px-5">
          <div className="text-left text-darkBlue font-archivo text-30 font-semibold">
            Property Distribution
          </div>
          <span className=" w-12.5 h-1 bg-[#209c24] block mt-3 mx-0 mb-7.5"></span>
          <div>
            <MapProperties />
          </div>
        </div>
        <BannerWelcome />
      </Container>
      <ScrollToTop />
    </div>
  )
}

export default HomePage
