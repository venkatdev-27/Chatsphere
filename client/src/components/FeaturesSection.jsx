import React, { useRef, useState, useEffect } from "react";
import { MessageSquare, Globe, Shield, Image, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";

const FeaturesSection = () => {
    const features = [
        {
            icon: <MessageSquare size={40} className="text-white" />,
            title: "Real-time Messaging",
            description: "Instant messaging with zero latency.",
            color: "from-indigo-600 to-violet-600",
            shadow: "shadow-indigo-500/20"
        },
        {
            icon: <Globe size={40} className="text-white" />,
            title: "Online Presence",
            description: "See who's online. Never miss a moment.",
            color: "from-cyan-500 to-blue-600",
            shadow: "shadow-cyan-500/20"
        },
        {
            icon: <Shield size={40} className="text-white" />,
            title: "Secure Authentication",
            description: "Industry-standard encryption. Your data is safe.",
            color: "from-emerald-500 to-green-600",
            shadow: "shadow-emerald-500/20"
        },
        {
            icon: <Image size={40} className="text-white" />,
            title: "Media Sharing",
            description: "Share photos, videos, and files seamlessly.",
            color: "from-pink-500 to-rose-600",
            shadow: "shadow-pink-500/20"
        },
        {
            icon: <Users size={40} className="text-white" />,
            title: "Group Chats",
            description: "Create groups. Chat with multiple friends.",
            color: "from-orange-500 to-red-600",
            shadow: "shadow-orange-500/20"
        },
    ];

    // Duplicate features for infinite loop effect if needed, 
    // but for a simple draggable slider, we can just list them.
    // To make it look "full", let's ensure we have enough cards or center them.

    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const x = useMotionValue(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Card width + check gap logic (280px min width on mobile for better 300px screen fit)
    // On mobile, card is 280px. On Desktop 350px.
    const CARD_WIDTH_MOBILE = 280;
    const CARD_WIDTH_DESKTOP = 350;
    const GAP = 24;

    useEffect(() => {
        const updateWidth = () => {
            if (ref.current) {
                setWidth(ref.current.scrollWidth - ref.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const getSnapPosition = (direction) => {
        const containerWidth = ref.current?.offsetWidth || 0;
        const isMobile = containerWidth < 768;
        const itemSize = (isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP) + GAP;

        const currentScroll = x.get();
        // Calculate the current simplistic index based on scroll position
        // We round to find the "nearest" card we are currently looking at
        const rawIndex = Math.abs(currentScroll) / itemSize;

        // Determine next index
        let nextIndex;
        if (direction === 'next') {
            // Moving right (showing next cards), so we want to increase index (move scroll more negative)
            // If we are partly scrolled, floor(rawIndex) + 1 might be just the next one
            nextIndex = Math.floor(rawIndex) + 1;
        } else {
            // Moving left (showing previous cards), decrease index (move scroll towards 0)
            nextIndex = Math.ceil(rawIndex) - 1;
        }

        // Clamp index
        if (nextIndex < 0) nextIndex = 0;
        // Logic for max index is implicit by clamping scroll to 'width'

        let newScroll = -(nextIndex * itemSize);

        // Constraint check
        if (newScroll > 0) newScroll = 0;
        if (newScroll < -width) newScroll = -width;

        return newScroll;
    };

    const slideLeft = () => {
        const newX = getSnapPosition('prev');
        animate(x, newX, {
            type: "spring",
            stiffness: 300,
            damping: 30
        });
    };

    const slideRight = () => {
        const newX = getSnapPosition('next');
        animate(x, newX, {
            type: "spring",
            stiffness: 300,
            damping: 30
        });
    };

    return (
        <section className="py-24 bg-gray-950 text-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">ChatSphere</span>?
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Next-gen communication
                    </p>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    <div ref={ref} className="cursor-grab active:cursor-grabbing overflow-hidden">
                        <motion.div
                            style={{ x }}
                            drag="x"
                            dragConstraints={{ right: 0, left: -width }}
                            whileTap={{ cursor: "grabbing" }}
                            className="flex gap-6 pb-8 pl-4" // Added padding-left for better start alignment
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className={`min-w-[280px] md:min-w-[350px] h-[400px] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 bg-gray-900 border border-gray-800/50 ${feature.shadow} shadow-lg`}
                                >
                                    {/* Gradient Background overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                    {/* Top Icon */}
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-indigo-300 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Decorative bottom line */}
                                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${feature.color} mt-6`} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Buttons - Positioned on Sides */}
                    <button
                        onClick={slideLeft}
                        className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-gray-800/50 md:bg-gray-800/80 hover:bg-indigo-600/30 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 group backdrop-blur-sm"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={20} className="md:hidden text-gray-400 group-hover:text-indigo-400" />
                        <ChevronLeft size={24} className="hidden md:block text-gray-400 group-hover:text-indigo-400" />
                    </button>
                    <button
                        onClick={slideRight}
                        className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-gray-800/50 md:bg-gray-800/80 hover:bg-indigo-600/30 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 group backdrop-blur-sm"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={20} className="md:hidden text-gray-400 group-hover:text-indigo-400" />
                        <ChevronRight size={24} className="hidden md:block text-gray-400 group-hover:text-indigo-400" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
