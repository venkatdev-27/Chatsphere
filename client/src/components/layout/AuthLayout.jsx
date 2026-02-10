import { Outlet } from "react-router-dom";
import LightRays from "@/components/animate-ui/components/backgrounds/LightRays";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AuthLayout = () => {
    return (
        <div
            className="
        relative
        min-h-screen w-full
        flex flex-col
        overflow-y-auto
        font-sans
        text-slate-100
      "
            style={{ backgroundColor: '#0E1117' }} // Deep Graphite
        >
            {/* Navbar */}
            <Navbar />

            {/* Light Rays Container - Top portion only */}
            <div className="absolute inset-x-0 top-0 h-[60vh] z-0 pointer-events-none overflow-hidden">
                <div
                    className="w-full h-full"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)'
                    }}
                >
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#FFFFFF"
                        raysSpeed={0.5}
                        lightSpread={0.6}
                        rayLength={1.4}
                        pulsating={true}
                        fadeDistance={0.6}
                        saturation={1}
                        followMouse={false}
                        mouseInfluence={0}
                        className="w-full h-full opacity-40 mix-blend-screen bloom-sm"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md mx-auto p-4 pt-20 pb-8">
                <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center">
                    <Outlet />
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AuthLayout;
