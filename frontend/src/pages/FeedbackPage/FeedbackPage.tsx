import React, { MutableRefObject, useRef, useState, useEffect } from 'react'
import {
  Button,
  Divider,
  Radio,
  Rating,
  TextInput,
  Textarea,
} from '@mantine/core'
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react'
import emailjs from '@emailjs/browser'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setIsSmallScreen } from '../../redux/reducers/resizeSlice'
import { yupResolver } from 'mantine-form-yup-resolver'
import * as yup from 'yup'
import { useForm } from '@mantine/form'
import Swal from 'sweetalert2'
import { validateEmail } from '../../utils/validate'
import { confirmBtn } from '../../constants/color.constant'

export default function Feedback() {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.user)
  const [checked, setChecked] = useState('suggestions')
  const [userName, setUserName] = useState(user.fullName ?? '')
  const [userEmail, setUserEmail] = useState(user.email ?? '')
  const [userPhone, setUserPhone] = useState('')
  const [satisfied, setSatisfied] = useState('')
  const [designRating, setDesignRating] = useState('')
  const [searchRating, setSearchRating] = useState('')
  const [postingRating, setPostingRating] = useState('')
  const [likes, setLikes] = useState('')
  const [dislikes, setDislikes] = useState('')
  const [questions, setQuestions] = useState('')
  const isSmallScreen = useAppSelector((state) => state.resize.isSmallScreen)
  const dispatch = useAppDispatch()
  const formRef: MutableRefObject<HTMLFormElement | null> =
    useRef<HTMLFormElement>(null)

  const listSchema = yup.object().shape({
    userName: yup.string().required('Name is required'),
    userEmail: yup
      .string()
      .matches(
        validateEmail,
        'Must match the following pattern: abc123@gmail.com',
      )
      .required('Email is required'),
    userPhone: yup
      .string()
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .length(10, 'The phone number must be 10 digits long.'),
    satisfied:
      checked === 'suggestions'
        ? yup.string().required('Satisfied is required')
        : yup.string().nullable(),
    designRating:
      checked === 'suggestions'
        ? yup.string().required('Rating is required')
        : yup.string().nullable(),
    searchRating:
      checked === 'suggestions'
        ? yup.string().required('Rating is required')
        : yup.string().nullable(),
    postingRating:
      checked === 'suggestions'
        ? yup.string().required('Rating is required')
        : yup.string().nullable(),
    likes: yup.string().nullable(),
    dislikes: yup.string().nullable(),
    questions:
      checked === 'questions'
        ? yup.string().required('Questions is required')
        : yup.string().nullable(),
  })

  const form = useForm({
    initialValues: {
      userName: user.fullName ?? '',
      userEmail: user.email ?? '',
      userPhone: '',
      satisfied: '',
      designRating: '',
      searchRating: '',
      postingRating: '',
      likes: '',
      dislikes: '',
      questions: '',
    },
    validate: yupResolver(listSchema),
  })

  const handleSubmitFeedback = async () => {
    try {
      setLoading(true)
      await emailjs.sendForm(
        'service_qawzvcu',
        checked === 'questions' ? 'template_2oaydwd' : 'template_nel8pm8',
        formRef.current!,
        'zHdWifJiTQZLgIDo8',
      )
      setLoading(false)
      Swal.fire({
        title: 'Thank you for your feedback!',
        text: 'We will get back to you as soon as possible.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: confirmBtn,
        timer: 2500,
      })

      form.reset()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsSmallScreen(window.innerWidth < 600))
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dispatch])

  return (
    <>
      <div className=" w-full   mt-15  xl:px-45 xs:px-20 mobile:px-5 py-25">
        <div className=" outline rounded-md outline-gray-300 xl:px-30 md:px-20 mobile:px-10 pb-10">
          <div className=" flex items-center justify-center md:gap-x-10 mobile-gap-x-5">
            <img
              className="md:w-1/2 mobile:w-2/3"
              src="https://files.jotform.com/jufs/OliviaTrivial/form_files/undraw_sweet_home_dkhr.6167dcae485334.14334369.png?md5=XEds-m-0AseGr_jSSJ8eYg&expires=1708659130"
              alt="feedback"
            />
            <h1 className=" lg:text-5xl md:text-4xl mobile:text-sm mobile:leading-4  w-1/3 ">
              Modern House Feedback Form
            </h1>
          </div>
          <Divider className=" md:my-7 mobile:my-3" />
          <form
            ref={formRef}
            onSubmit={form.onSubmit(() => {
              form.clearErrors()
              handleSubmitFeedback()
            })}
          >
            <div className=" grid md:grid-cols-2 mobile:grid-cols-1 gap-x-10 md:gap-y-7 mobile:gap-y-4">
              <TextInput
                withAsterisk
                name="userName"
                radius="md"
                size={!isSmallScreen ? 'md' : 'sm'}
                placeholder="Full Name"
                leftSection={<IconUser size={16} color="green" />}
                label="Full Name"
                value={userName}
                {...form.getInputProps('userName')}
                onChange={(event) => {
                  form.setFieldValue('userName', event.currentTarget.value)
                  setUserName(event.currentTarget.value)
                }}
              />
              <TextInput
                withAsterisk
                name="userEmail"
                size={!isSmallScreen ? 'md' : 'sm'}
                radius="md"
                leftSection={<IconMail size={16} color="green" />}
                label="Email"
                placeholder="your@email.com"
                value={userEmail}
                {...form.getInputProps('userEmail')}
                onChange={(event) => {
                  form.setFieldValue('userEmail', event.currentTarget.value)
                  setUserEmail(event.currentTarget.value)
                }}
              />

              <TextInput
                name="userPhone"
                size={!isSmallScreen ? 'md' : 'sm'}
                radius="md"
                leftSection={<IconPhone size={16} color="green" />}
                label="Phone"
                placeholder="Phone Number"
                value={userPhone}
                {...form.getInputProps('userPhone')}
                onChange={(event) => {
                  form.setFieldValue('userPhone', event.currentTarget.value)
                  setUserPhone(event.currentTarget.value)
                }}
              />
            </div>
            <Divider className=" md:my-7 mobile:my-4" />
            <div className=" flex flex-col gap-y-3 ">
              <h1 className=" font-bold md:text-xl mobile:text-sm">
                Feedback Type
              </h1>

              <Radio.Group value={checked} onChange={setChecked} withAsterisk>
                <div className=" flex justify-evenly ">
                  <Radio value="suggestions" label="Service Suggestions" />
                  <Radio value="questions" label="Questions" />
                </div>
              </Radio.Group>

              {checked === 'questions' ? (
                <Textarea
                  name="questions"
                  placeholder="Your Questions..."
                  label="Questions"
                  autosize
                  minRows={7}
                  value={questions}
                  {...form.getInputProps('questions')}
                  onChange={(event) => {
                    form.setFieldValue('questions', event.currentTarget.value)
                    setQuestions(event.currentTarget.value)
                  }}
                />
              ) : (
                <div className=" flex flex-col gap-y-1">
                  <div className="flex items-center  md:gap-x-10 mobile:gap-x-2 ">
                    <h1 className=" font-bold md:text-xl mobile:text-sm w-60">
                      Design & Usability:
                    </h1>
                    <div className=" flex flex-col">
                      <Rating
                        name="designRating"
                        value={designRating}
                        fractions={2}
                        p={10}
                        size={!isSmallScreen ? 'lg' : 'md'}
                        styles={{
                          starSymbol: {
                            marginRight: !isSmallScreen ? '5px' : '1px',
                          },
                        }}
                        {...form.getInputProps('designRating')}
                        onChange={(_value) => {
                          form.setFieldValue('designRating', String(_value))
                          setDesignRating(String(_value))
                        }}
                      />
                      <small className=" text-red opacity-80 text-sm">
                        {form.errors.designRating}
                      </small>
                    </div>
                  </div>
                  <div className="flex items-center  md:gap-x-10 mobile:gap-x-2 ">
                    <h1 className=" font-bold md:text-xl mobile:text-sm w-60">
                      Search Functionality:
                    </h1>
                    <div className=" flex flex-col">
                      <Rating
                        name="searchRating"
                        value={searchRating}
                        fractions={2}
                        p={10}
                        size={!isSmallScreen ? 'lg' : 'md'}
                        styles={{
                          starSymbol: {
                            marginRight: !isSmallScreen ? '5px' : '1px',
                          },
                        }}
                        {...form.getInputProps('searchRating')}
                        onChange={(_value) => {
                          form.setFieldValue('searchRating', String(_value))
                          setSearchRating(String(_value))
                        }}
                      />
                      <small className=" text-red opacity-80 text-sm">
                        {form.errors.searchRating}
                      </small>
                    </div>
                  </div>
                  <div className="flex items-center  md:gap-x-10 mobile:gap-x-2 ">
                    <h1 className=" font-bold md:text-xl mobile:text-sm w-60">
                      Property Posting :
                    </h1>
                    <div className=" flex flex-col">
                      <Rating
                        name="postingRating"
                        value={postingRating}
                        fractions={2}
                        p={10}
                        size={!isSmallScreen ? 'lg' : 'md'}
                        styles={{
                          starSymbol: {
                            marginRight: !isSmallScreen ? '5px' : '1px',
                          },
                        }}
                        {...form.getInputProps('postingRating')}
                        onChange={(_value) => {
                          form.setFieldValue('postingRating', String(_value))
                          setPostingRating(String(_value))
                        }}
                      />
                      <small className=" text-red opacity-80 text-sm">
                        {form.errors.postingRating}
                      </small>
                    </div>
                  </div>
                  <div className="my-3 flex flex-col md:gap-y-7 mobile:gap-y-5">
                    <Textarea
                      styles={{ label: { fontSize: '15px' } }}
                      name="likes"
                      value={likes}
                      placeholder="Your Opinions..."
                      label="What other things do you like about our website?"
                      autosize
                      minRows={5}
                      {...form.getInputProps('likes')}
                      onChange={(event) => {
                        form.setFieldValue('likes', event.currentTarget.value)
                        setLikes(event.currentTarget.value)
                      }}
                    />
                    <Textarea
                      styles={{ label: { fontSize: '15px' } }}
                      name="dislikes"
                      value={dislikes}
                      placeholder="Your Opinions..."
                      label="What other things do you dislike about our website?"
                      autosize
                      minRows={5}
                      {...form.getInputProps('dislikes')}
                      onChange={(event) => {
                        form.setFieldValue(
                          'dislikes',
                          event.currentTarget.value,
                        )
                        setDislikes(event.currentTarget.value)
                      }}
                    />
                  </div>

                  <div>
                    <h1 className=" font-bold md:text-xl mobile:text-sm">
                      How satisfied were you with our website services?
                    </h1>

                    <Radio.Group
                      value={satisfied}
                      name="satisfied"
                      withAsterisk
                      {...form.getInputProps('satisfied')}
                      onChange={(_value) => {
                        form.setFieldValue('satisfied', _value)
                        setSatisfied(_value)
                      }}
                    >
                      <div className=" flex flex-col gap-y-3 mt-3">
                        <Radio value="Very Satisfied" label="Very Satisfied" />
                        <Radio value="Satisfied" label="Satisfied" />
                        <Radio value="Neutral" label="Neutral" />
                        <Radio value="Dissatisfied" label="Dissatisfied" />
                        <Radio
                          value="Very Dissatisfied"
                          label="Very Dissatisfied"
                        />
                      </div>
                    </Radio.Group>
                  </div>
                </div>
              )}
            </div>
            <div className=" flex justify-center mt-10 ">
              <Button
                loading={loading}
                w={200}
                size={!isSmallScreen ? 'md' : 'sm'}
                className="bg-primary"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
