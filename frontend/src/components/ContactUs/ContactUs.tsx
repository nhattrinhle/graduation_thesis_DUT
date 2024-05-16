import React, { useState } from 'react'
import style from './ContactUs.module.scss'
import * as yup from 'yup'
import { MdPerson2, MdEmail } from 'react-icons/md'
import { FaPhoneAlt } from 'react-icons/fa'
import { Avatar, Button, Group, TextInput, Textarea } from '@mantine/core'
import { Properties } from '../../types/properties'
import { useForm } from '@mantine/form'
import { yupResolver } from 'mantine-form-yup-resolver'
import { validateEmail } from '../../utils/validate'
import { sendContactToSeller } from '../../service/ContactService'
import Swal from 'sweetalert2'

interface ContactUsProps {
  property: Properties
}
const ContactUs = ({ property }: ContactUsProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const listSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .matches(
        validateEmail,
        'Must match the following pattern: abc123@gmail.com',
      )
      .required('Email is required'),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .length(10, 'The phone number must be 10 digits long.'),
    message: yup.string().required('Message is required'),
  })

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    validate: yupResolver(listSchema),
  })

  const handleContactSeller = async (values: any) => {
    try {
      setIsLoading(true)
      await sendContactToSeller({
        ...values,
        propertyId: property.propertyId,
        sellerId: property.seller.userId,
      })
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Message sent successfully!',
        showConfirmButton: false,
        timer: 2000,
      })
      form.reset()
    } catch (err) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Sorry, something went wrong!',
        showConfirmButton: false,
        timer: 1400,
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={style.ContactContainer}>
      <div className={style.ContactContent}>
        <div className={style.ContactInfoSeller}>
          <div className={style.ContactAvatar}>
            <Avatar src={property?.seller.avatar} size={100}></Avatar>
          </div>
          <div className={style.ContactInfoDetail}>
            <div className={style.ContactNameSeller}>
              {property?.seller.fullName}
            </div>
            <div className={style.ContactPhoneEmail}>
              <FaPhoneAlt size={20} color="green" />
              <a
                href={`tel:${property?.seller.phone}`}
                className={style.ContactTextSeller}
              >
                {property?.seller.phone}
              </a>
            </div>
            <div className={style.ContactPhoneEmail}>
              <MdEmail size={20} color="green" />
              <a
                href={`mailto:${property?.seller.email}`}
                className={style.ContactTextSeller}
              >
                {property?.seller.email}
              </a>
            </div>
          </div>
        </div>
        <div className={style.ContactInputContainer}>
          <form
            onSubmit={form.onSubmit((values) => handleContactSeller(values))}
          >
            <div className={style.ContactInputRow}>
              <TextInput
                size="md"
                radius="xl"
                placeholder="Full Name"
                className={style.ContactInput}
                leftSection={<MdPerson2 size={16} color="green" />}
                {...form.getInputProps('name')}
                onChange={(event: any) => {
                  form.setFieldValue('name', event.currentTarget.value)
                }}
              />
            </div>
            <div className={style.ContactInputRow}>
              <TextInput
                size="md"
                radius="xl"
                placeholder="Email"
                className={style.ContactInput}
                leftSection={<MdEmail size={16} color="green" />}
                {...form.getInputProps('email')}
                onChange={(event: any) => {
                  form.setFieldValue('email', event.currentTarget.value)
                }}
              />
            </div>
            <div className={style.ContactInputRow}>
              <TextInput
                size="md"
                radius="xl"
                placeholder="Phone Number"
                className={style.ContactInput}
                leftSection={<FaPhoneAlt size={16} color="green" />}
                {...form.getInputProps('phone')}
                onChange={(event: any) => {
                  form.setFieldValue('phone', event.currentTarget.value)
                }}
              />
            </div>
            <div className={style.ContactInputRow}>
              <Textarea
                size="xl"
                autosize
                minRows={6}
                maxRows={7}
                placeholder="Message"
                {...form.getInputProps('message')}
                onChange={(event: any) => {
                  form.setFieldValue('message', event.currentTarget.value)
                }}
              />
            </div>
            <div className={style.ContactSubmit}>
              <Group>
                <Button
                  loading={isLoading}
                  variant="filled"
                  classNames={{ root: style.btnSendSeller }}
                  type="submit"
                >
                  SEND TO SELLER
                </Button>
              </Group>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
