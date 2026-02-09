import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import createGlobe from "cobe";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration Data ---
const FEATURES = [
    {
        title: "Real-time Messaging",
        description: "Send and receive messages instantly with zero latency. Stay connected with friends and teams.",
        color: "from-indigo-400 to-purple-600",
    },
    {
        title: "Secure & Private",
        description: "End-to-end encryption ensures your conversations remain private and secure at all times.",
        color: "from-emerald-400 to-green-600",
    },
    {
        title: "Media Sharing",
        description: "Share photos, videos, and files seamlessly within your conversations.",
        color: "from-pink-400 to-rose-600",
    },
];

const AUTOPLAY_DELAY = 5000; // 5 seconds per slide

// --- Components ---

const Globe = () => {
    const canvasRef = useRef();

    useEffect(() => {
        let phi = 0;
        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 12000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
                { location: [51.5074, -0.1278], size: 0.05 }, // London
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.005; // Slower, smoother rotation
            },
        });

        return () => globe.destroy();
    }, []);

    return (
        <div className="
  flex items-center justify-center
  w-[350px] sm:w-[380px] md:w-[600px]
  h-[350px] sm:h-[380px] md:h-[600px]
  relative z-0 mx-auto
">
            <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "100%" }}
                className="w-full h-full opacity-90 transition-opacity duration-500"
            />
        </div>
    );
};

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % FEATURES.length);
        }, AUTOPLAY_DELAY);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full min-h-screen bg-slate-950 overflow-x-hidden overflow-y-visible flex flex-col md:flex-row ...">

            {/* Mobile: Globe on Top, Text Below */}
            {/* Desktop: Text Left, Globe Right */}

            {/* --- Text Carousel (Order 2 on Mobile, Order 1 on Desktop) --- */}
            <div className="z-10 w-full md:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8 min-h-[300px] md:min-h-auto order-2 md:order-1 mt-8 md:mt-0">

                {/* Animated Text Container */}
                <div className="relative h-[140px] sm:h-[180px] md:h-[250px]">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="absolute top-0 left-0 w-full text-center md:text-left"
                        >


                            <h1 className="text-3xl md:text-6xl font-bold text-white leading-tight mb-4">
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${FEATURES[currentIndex].color}`}>
                                    {FEATURES[currentIndex].title}
                                </span>
                            </h1>

                            <p className="text-slate-400 text-base md:text-xl max-w-lg leading-relaxed mx-auto md:mx-0">
                                {FEATURES[currentIndex].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Carousel Indicators / Progress */}
                <div className="flex gap-3 pt-4 justify-center md:justify-start">
                    {FEATURES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className="group relative h-1 w-12 md:w-16 bg-slate-800 rounded-full overflow-hidden transition-all hover:bg-slate-700"
                        >
                            <div
                                className={`absolute top-0 left-0 h-full w-full bg-white transition-transform duration-[5000ms] ease-linear origin-left ${idx === currentIndex ? "scale-x-100" : "scale-x-0"
                                    } ${idx < currentIndex ? "scale-x-100 duration-0" : ""}`}
                            />
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 pt-6 justify-center md:justify-start">
                    <Link to="/login" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors w-full md:w-auto text-center">
                        Start Now
                    </Link>
                </div>
            </div>

            {/* --- Globe (Order 1 on Mobile, Order 2 on Desktop) --- */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center order-1 md:order-2 py-10 md:py-0">
                {/* Glow Effect */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[300px] h-[250px] md:h-[300px] blur-[80px] md:blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 bg-gradient-to-r ${FEATURES[currentIndex].color} opacity-20`} />

                <Globe />
            </div>

        </section>
    );
}