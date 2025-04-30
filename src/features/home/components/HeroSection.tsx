"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function HeroSection() {
  const plugin = React.useRef( Autoplay({ delay: 1500, stopOnInteraction: true }));
  const images = ["/assets/caro2.jpg", "/assets/caro1.jpg", "/assets/caro3.jpg"];
  

  return (
    <Carousel
    plugins={[plugin.current]}
    className="w-full h-auto md:h-screen"
    onMouseEnter={plugin.current.stop}
    onMouseLeave={plugin.current.reset}
  >
    <CarouselContent>
      {images.map((image, index) => (
        <CarouselItem key={index}>
          <div className="bg-black">
            <img
              src={image}
              alt={`gambar ${index + 1}`}
              className="w-full h-[50vh] md:h-[80vh] object-cover opacity-60"
            />
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>

    {/* Heading */}
    <div className="absolute top-[20%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-3xl md:text-6xl text-center">
      <h1>Welcome to EventNesia!</h1>
    </div>

    {/* Subheading */}
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-xl md:text-3xl text-center px-4 max-w-md md:max-w-3xl">
      <p>Let's Have Some Fun With Us !</p>
    </div>
  </Carousel>
  );
}
