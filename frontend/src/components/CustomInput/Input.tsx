import React, { ReactNode } from 'react'
import { Input as MantineInput, InputProps } from '@mantine/core'
import style from './Input.module.scss'
interface ICustomInputProps extends InputProps {
  placeholder?: string
  leftS?: ReactNode
  rightS?: ReactNode
  children?: ReactNode
}
const Input = ({ leftS,rightS,children, placeholder, size, radius, ...props }: ICustomInputProps) => {
  return (
    <MantineInput
      size={size}
      radius={radius}
      placeholder={placeholder}
      leftSection={leftS}
      rightSection={rightS}
      classNames={{ input: style.input }}
      {...props}
    >
        {children}
    </MantineInput>
  )
}

export default Input
