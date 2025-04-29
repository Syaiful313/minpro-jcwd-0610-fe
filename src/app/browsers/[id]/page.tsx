import EventPage from '@/features/browsers/EventDetailPage'
import React from 'react'

const page = ({ params }: { params: { id: string }}) => {
  return (
    <>
    <EventPage params={params}/>
    </>
  )
}

export default page