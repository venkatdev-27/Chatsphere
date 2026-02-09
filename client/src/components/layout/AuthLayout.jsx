import { Outlet } from "react-router-dom";
import LightRays from "@/components/animate-ui/components/backgrounds/LightRays";

const AuthLayout = () => {
    return (
        <div
            className="
        relative
        min-h-screen w-full
        flex items-center justify-center
        overflow-hidden
        font-sans
        text-slate-100
      "
            style={{ backgroundColor: '#0E1117' }} // Deep Graphite
        >
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
            <div className="relative z-10 w-full max-w-md p-4 auth-scroll">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
