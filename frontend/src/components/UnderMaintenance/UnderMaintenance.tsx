import { Modal } from '@mantine/core'
import React from 'react'

interface UnderMaintenanceProps {
  status: boolean
  setStatus: React.Dispatch<React.SetStateAction<boolean>>
  maintenanceMessage?: string
}
const UnderMaintenance = ({
  status,
  setStatus,
  maintenanceMessage,
}: UnderMaintenanceProps) => {
  return (
    <Modal
      className=" bg-zinc-900"
      classNames={{
        content: 'rounded-2xl',
      }}
      centered
      size="lg"
      opened={status}
      onClose={() => setStatus((_prev) => false)}
      withCloseButton={false}
    >
      <div className="flex flex-col my-10 items-center justify-start gap-12 font-archivo ">
        <div className="max-w-[550px]">
          <img
            src="https://atlassianblog.wpengine.com/wp-content/uploads/2018/05/scheduled-maintenance-message-examples-and-inspiration0a@3x-1560x760.png"
            alt="This service is under maintenance"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl m-0 p-0 font-bold text-center">
            We will be back shortly!
          </h1>
          <p className="text-xl text-center px-5">
            {maintenanceMessage ??
              'This service is under maintenance. Please try again later.'}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default UnderMaintenance
