import React, { useEffect } from 'react'
import SearchComponent from '../../components/SearchBar/SearchComponent'
import { getAllWishList } from '../../redux/reducers/propertySlice'
import { useAppDispatch } from '../../redux/hooks'

export default function SearchPage() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getAllWishList())
  }, [])

  return (
    <>
      <div className=" py-28 lg:px-14 mobile:px-5">
        <SearchComponent />
      </div>
    </>
  )
}
