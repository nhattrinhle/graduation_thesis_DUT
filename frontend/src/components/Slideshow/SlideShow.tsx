import React, { useRef } from 'react'
import { Carousel } from '@mantine/carousel'
import { Image } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import styles from './SlideShow.module.scss'
import TextSearchBar from '../SearchBar/TextSearchBar'

export default function SlideShow() {
  const DELAY_TIME = 7000
  const autoplay = useRef(Autoplay({ delay: DELAY_TIME }))
  const images = [
    'https://cf.bstatic.com/xdata/images/hotel/max1280x900/408497438.jpg?k=de7739e09eae2df6bd51044356ddbd5248ff557b6190edd1ea1c5db94f0454af&o=&hp=1',
    'https://www.riccicoproperty.vn/themes/ricci/images/house_wide_view-min.jpg',
    'https://www.riccicoproperty.vn/themes/ricci/images/9-min.png',

    'https://www.bhg.com/thmb/dgy0b4w_W0oUJUxc7M4w3H4AyDo=/1866x0/filters:no_upscale():strip_icc()/living-room-gallery-shelves-l-shaped-couch-ELeyNpyyqpZ8hosOG3EG1X-b5a39646574544e8a75f2961332cd89a.jpg',
    'https://stay.greatworld.com.sg/wp-content/uploads/2022/08/serviced-apartments-singapore.jpg-scaled.jpg',
  ]

  const slides = images.map((url) => {
    return (
      <Carousel.Slide key={url} classNames={{ slide: styles.slide }}>
        <Image className={styles.slideImage} src={url} />
      </Carousel.Slide>
    )
  })
  return (
    <>
      <div className={styles.outer}>
        <Carousel
          styles={{
            indicator: {
              zIndex: 2,
              background: 'white',
              height: '20px',
              width: '20px',
            },
            controls: {
              zIndex: 2,
            },
            control: {
              background: 'white',
            },
          }}
          withIndicators
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          loop
          dragFree
          height="100%"
        >
          {slides}
        </Carousel>

        <div className={styles.overlay}>
          <div className={styles.flexBox}>
            <h1 className={styles.largeText}>Find The Perfect Building</h1>
            <h6 className={styles.smallText}>
              Your Dreams Are In Trusted Hands
            </h6>
            <TextSearchBar />
          </div>
        </div>
      </div>
    </>
  )
}
