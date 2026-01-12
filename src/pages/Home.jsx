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
    <>
      <HeroSection />
      <EventsSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
};

export default Home;
