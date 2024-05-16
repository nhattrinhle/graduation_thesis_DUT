import React, { useEffect, useState } from 'react'
import { SegmentedControl } from '@mantine/core'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import ExchangePolicy from './ExchangePolicy'
import { createPaymentIntent } from '../../service/StripeService'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Transaction.module.scss'

export default function TransactionComponent() {
  const navigate = useNavigate()
  const param = useLocation()
  if (!param.state) {
    navigate('/seller')
  }

  const [clientSecret, setClientSecret] = useState<string>()
  const [resetPayment, setResetPayment] = useState(false)
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!,
  )
  const [value, setValue] = useState('Proceed To Payment')

  const [intentId, setIntentId] = useState('')

  const handleBuyCredit = async () => {
    try {
      if (param.state.creditAmount > 0) {
        const paymentIntents = await createPaymentIntent(
          Number(param.state.creditAmount),
          Number(param.state.conversionRate),
        )
        setClientSecret(paymentIntents.client_secret as string)
        setIntentId(paymentIntents.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    handleBuyCredit()
  }, [])

  useEffect(() => {
    setClientSecret('')
  }, [resetPayment])
  return (
    <div className="my-7.5 xl:mx-5 lg:mx-5 ">
      <div className={styles.outer}>
        <div className={styles.segment}>
          <SegmentedControl
            transitionDuration={300}
            transitionTimingFunction="linear"
            styles={{
              root: {
                paddingTop: '5px',
                paddingBottom: '5px',
              },
              label: {
                fontWeight: 'bold',
                color: '#396652',
                fontSize: '18px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
            value={value}
            onChange={setValue}
            data={[
              { label: 'Exchange Policy', value: 'Exchange Policy' },
              {
                label: 'Proceed To Payment',
                value: 'Proceed To Payment',
                // disabled: shouldShowCheckoutForm ? false : true,
              },
            ]}
          />
          {value === 'Exchange Policy' && (
            <ExchangePolicy conversionRate={param.state.conversionRate} />
          )}
          {value === 'Proceed To Payment' && (
            <div className="col-span-6 flex flex-col p-5">
              {clientSecret && stripePromise && param.state && (
                <div className="w-full px-3">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      conversionRate={param.state.conversionRate}
                      intentId={intentId}
                      setResetPayment={setResetPayment}
                      total={
                        Number(param.state.creditAmount) *
                        Number(param.state.conversionRate)
                      }
                      setValue={setValue}
                    />
                  </Elements>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
