import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import OverviewSection from "../components/OverviewSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="bg-gray-950 h-full overflow-y-auto text-white font-sans selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main>
                <div id="hero">
                    <HeroSection />
                </div>
                <div id="overview">
                    <OverviewSection />
                </div>
                <div id="features">
                    <FeaturesSection />
                </div>
                <div id="services">
                    <HowItWorksSection />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
