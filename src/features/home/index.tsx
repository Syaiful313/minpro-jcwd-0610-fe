import { Navbar } from '@/components/Navbar'
import React from 'react'
import Footer from '@/components/Footer'
import { HeroSection } from './components/HeroSection'
import Event from './components/Event'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      {/* <Event /> */}
      <Footer />
    </>
  )
}

export default HomePage