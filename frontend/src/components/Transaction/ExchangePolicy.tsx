import React from 'react'

interface ExchangePolicyProps {
  conversionRate?: string
}
export default function ExchangePolicy({
  conversionRate,
}: ExchangePolicyProps) {
  return (
    <>
      <div className=" mt-3 font-sans leading-loose px-10">
        <p className="font-bold text-primary text-center text-3xl mb-2">
          <img
            src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
            className=" inline mr-3"
          />
          Exchange Policy for Purchasing Credits
        </p>
        <p>
          This Exchange Policy outlines the terms and conditions for purchasing,
          using, and returning credits used for publishing posts on our website.
        </p>
        <h2 className="m-0 ">1. Purchasing Credits:</h2>

        <li>
          Each credit purchased is equal to{' '}
          <strong>${conversionRate} USD</strong>.
        </li>
        <li>
          Credits are non-refundable and cannot be exchanged for cash or other
          payment methods.
        </li>
        <li>
          Purchased credits are credited to your user account and displayed in
          your balance.
        </li>

        <h2 className="m-0">2. Using Credits</h2>

        <li>Credits are used to publish posts on our website.</li>
        <li>
          The specific cost of each post type will be clearly displayed before
          publishing.
        </li>
        <li>Credits cannot be used for any other purpose on this website.</li>

        <h2 className="m-0">3. Unused Credits</h2>

        <li>Unused credits remain in your account balance indefinitely.</li>
        <li>
          There are no expiration dates or minimum spending requirements for
          your credits.
        </li>

        <h2 className="m-0">4. Returns and Refunds</h2>

        <li>
          We do not offer refunds or exchanges for unused credits due to their
          non-refundable nature.
        </li>
        <li>
          If you experience technical difficulties resulting in an accidental
          purchase or an issue with credit utilization, please contact our
          customer support team for assistance.
        </li>

        <h2 className="m-0">5. Policy Updates</h2>

        <li>
          We reserve the right to update this Exchange Policy at any time.
        </li>
        <li>
          Any changes will be posted on our website and will be effective
          immediately.
        </li>

        <h3 className="m-0">
          For further inquiries or assistance, please contact our customer
          support team.
        </h3>
      </div>
    </>
  )
}
