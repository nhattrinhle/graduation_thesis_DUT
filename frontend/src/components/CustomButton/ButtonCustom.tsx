import React, { ReactNode } from 'react'
import { Button as ButtonMantine, ButtonProps } from '@mantine/core'
import style from './styles.module.scss'
interface Props extends ButtonProps {
  text?: string
  children?: ReactNode
}
const Button = ({ children, variant, text, color, size, ...props }: Props) => {
  return (
    <ButtonMantine
      color={color}
      variant={variant}
      size={size}
      classNames={{ root: style.root }}
      {...props}
    >
      {text}
      {children}
    </ButtonMantine>
  )
}

export default Button
