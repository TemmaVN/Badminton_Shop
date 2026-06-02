import React from 'react'
import { Phone } from 'lucide-react'

const TuVan = ({ name, phoneNumber }) => {
  return (
    <div className='flex flex-col gap-1'>
      <p className='text-sm font-semibold text-gray-700'>{name}</p>
      <div className='flex items-center gap-1 text-orange-default'>
        <Phone className='w-4 h-4' />
        <a href={`tel:${phoneNumber}`} className='text-sm font-bold hover:underline'>
          {phoneNumber}
        </a>
      </div>
    </div>
  )
}

export default TuVan
