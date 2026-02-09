import { Outlet } from "react-router-dom";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";

const AuthLayout = () => {
  return (
    <StarsBackground
      starColor="#334155"
      speed={20}
      pointerEvents={false}
      className="min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden font-sans text-slate-100"
    >
      <div className="absolute inset-0 bg-slate-950/40" />

      <div className="relative z-10 w-full max-w-md p-4 auth-scroll">
        <Outlet />
      </div>
    </StarsBackground>
  );
};

export default AuthLayout;
