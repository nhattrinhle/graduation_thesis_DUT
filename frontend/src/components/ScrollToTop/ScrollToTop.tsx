import { Button } from '@mantine/core'
import { IconArrowUp } from '@tabler/icons-react'
import React from 'react'

export default function ScrollToTop() {
  window.onscroll = function () {
    scrollFunction()
  }

  function scrollFunction() {
    const myButton = document.getElementById('myBtn')
    if (myButton) {
      if (
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
      ) {
        myButton.style.display = 'block'
      } else {
        myButton.style.display = 'none'
      }
    }
  }

  function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Button
        className="hidden w-[60px] h-[60px] rounded-[100px] fixed bottom-5 right-7 z-50 border-none outline-none
         bg-[#f0edfe] hover:bg-[#edddfb] opacity-80 text-white cursor-pointer p-4 "
        onClick={topFunction}
        id="myBtn"
      >
        <IconArrowUp size={50} className="text-[#c4b3fb]" />
      </Button>
    </>
  )
}
