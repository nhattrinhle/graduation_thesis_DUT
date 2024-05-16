import React, { useState } from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Modal, Image } from '@mantine/core'
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel'
import styles from './DetailsImageList.module.scss'
import { Image as PropertyImage } from '../../types'
import { formatMoneyToUSD } from '../../utils/commonFunctions'

interface DetailsImageListProps {
  images?: PropertyImage[]
  name?: string
  price?: number
  status?: string
  feature?: string
}
export default function DetailsImageList({
  images,
  name,
  price,
  status,
  feature,
}: DetailsImageListProps) {
  const TRANSITION_DURATION = 200
  const [opened, setOpened] = useState(false)
  const [chosenImg, setChosenImg] = useState(0)
  const [embla, setEmbla] = useState<Embla | null>(null)
  useAnimationOffsetEffect(embla, TRANSITION_DURATION)

  const slides = images?.map((image) => {
    return (
      <Carousel.Slide key={image.imageId} classNames={{ slide: styles.slide }}>
        <Image className={styles.slideImage} src={image.imageUrl} />
      </Carousel.Slide>
    )
  })

  return (
    <>
      <div>
        <h1 className={styles.title}>{name}</h1>
        <div className={styles.imgContainer}>
          <div className="relative">
            <img
              src={images ? images[0].imageUrl : ''}
              alt={images ? images[0].imageId.toString() : ''}
              loading="lazy"
              className={styles.img}
              onClick={() => {
                setChosenImg(0)
                setOpened(true)
              }}
            />
            <div className={styles.bottomDiv}>
              <div className={styles.priceDiv}>
                {formatMoneyToUSD(price!)}
                {feature === 'Rent' ? ' /month' : ''}
              </div>
              <div className={styles.statusDiv}>{status}</div>
            </div>
          </div>

          {images && (
            <ImageList className="my-0" cols={2}>
              {images.slice(1).map((item, index) => (
                <ImageListItem key={item.imageId}>
                  <img
                    className={styles.img}
                    srcSet={item.imageUrl}
                    src={item.imageUrl}
                    alt={item.imageId.toString()}
                    loading="lazy"
                    onClick={() => {
                      setChosenImg(Number(index + 1))
                      setOpened(true)
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </div>

        <div>
          <Modal
            opened={opened}
            centered
            size="100%"
            padding={0}
            transitionProps={{ duration: TRANSITION_DURATION }}
            withCloseButton={false}
            onClose={() => setOpened(false)}
          >
            <Carousel
              getEmblaApi={setEmbla}
              initialSlide={chosenImg}
              classNames={{ control: styles.control }}
            >
              {slides}
            </Carousel>
          </Modal>
        </div>
      </div>
    </>
  )
}
