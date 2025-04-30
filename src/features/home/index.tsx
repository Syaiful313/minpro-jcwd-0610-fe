import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { HeroSection } from './components/HeroSection'
import EventCard from '@/components/EventCard'
import HeroSectionEvent from './components/Event'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HeroSectionEvent />
      <Footer />
    </>
  )
}

export default HomePage