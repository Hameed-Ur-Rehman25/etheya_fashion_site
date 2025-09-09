"use client";

import React from "react";
import { InfiniteMovingCards } from "@/shared/components/ui/infinite-moving-cards";
import { Spotlight } from "@/shared/components/ui/spotlight";

export function ReviewsSection() {
  return (
    <section className="relative py-8 px-6 bg-black/[0.96] overflow-hidden">
      {/* Grid pattern background */}
      <div className="pointer-events-none absolute inset-0 [background-size:40px_40px] select-none [background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]" />
      
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl md:text-4xl font-playfair font-bold text-transparent mb-4">
            What Our Customers Say
          </h2>
        </div>
        
        <div className="h-[20rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={fashionTestimonials}
            direction="right"
            speed="slow"
            pauseOnHover={true}
          />
        </div>
      </div>
    </section>
  );
}

const fashionTestimonials = [
  {
    quote:
      "The quality of Etheya's clothing is exceptional. Every piece I've ordered has exceeded my expectations. The attention to detail and craftsmanship is truly remarkable. I've received so many compliments!",
    name: "Sarah Johnson",
    title: "Fashion Blogger",
  },
  {
    quote:
      "Etheya has completely transformed my wardrobe. Their designs are elegant, modern, and versatile. I can easily transition from work to evening events with their stunning pieces.",
    name: "Amira Khan",
    title: "Marketing Executive",
  },
  {
    quote:
      "I love how Etheya combines traditional Pakistani craftsmanship with contemporary designs. Their clothes make me feel confident and beautiful. The customer service is also outstanding!",
    name: "Fatima Ali",
    title: "Interior Designer",
  },
  {
    quote:
      "The fit and finish of Etheya's garments is perfection. I've been a customer for over two years and every purchase has been worth every penny. Highly recommend to anyone looking for premium fashion.",
    name: "Zara Malik",
    title: "Business Owner",
  },
  {
    quote:
      "Etheya's collection strikes the perfect balance between elegance and comfort. Their fabrics are luxurious and the designs are timeless. I always feel my best when wearing their pieces.",
    name: "Ayesha Rahman",
    title: "Doctor",
  },
  {
    quote:
      "Outstanding quality and unique designs! Etheya has become my go-to brand for special occasions. Their attention to customer satisfaction and quick delivery makes shopping a pleasure.",
    name: "Hina Sheikh",
    title: "Teacher",
  },
];
