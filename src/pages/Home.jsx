import React from "react";
import HeroSection from "../components/HeroSection";
import CTASection from "../components/CTASection";
import EventsSection from "../components/EventsSection";
import FeaturesSection from "../components/FeaturesSection";
import DotGrid from "../components/DotGrid";
import PolygonBackground from "../components/PolygonBackground";
import ImageSlider from "../components/ImageSlider";



const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 sm:pt-28">
      <HeroSection />
      <EventsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default Home;
