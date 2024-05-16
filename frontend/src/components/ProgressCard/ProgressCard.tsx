import React from 'react'
import { IconCreditCardRefund, IconCreditCardPay } from '@tabler/icons-react'

function ProgressCard() {
  return (
    <div>
      <div className="w-full flex items-center gap-6 p-4 ">
        <div className="w-1/2">
          <div className="flex gap-8 w-full mt-6">
            <div className="w-1/2">
              <div className="bg-white rounded-[16px] shadow-xl flex items-center justify-center p-3 ">
                <div className=" flex flex-col items-between w-full px-5">
                  <div className="flex items-center justify-between ">
                    <h2 className="text-[24px] font-extrabold p-0 m-0 text-primary">
                      2,356
                    </h2>
                    <IconCreditCardRefund className="text-primary" size={40} />
                  </div>
                  <div>
                    <h3 className="font-semibold mt-3 ">
                      Total Deposited Credits
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-white rounded-[16px] shadow-xl flex items-center justify-center p-3 ">
                <div className=" flex flex-col items-between w-full px-5">
                  <div className="flex items-center justify-between ">
                    <h2 className="text-[24px] text-primary font-extrabold p-0 m-0">
                      2,356
                    </h2>
                    <IconCreditCardPay className="text-primary" size={40} />
                  </div>
                  <div>
                    <h3 className="font-semibold mt-3">Total Used Credits</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressCard
