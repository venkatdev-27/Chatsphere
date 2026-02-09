import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const LightRays = ({
    raysOrigin = 'top-center',
    raysColor = '#ffffff',
    raysSpeed = 0.6,
    lightSpread = 4,
    rayLength = 1.6,
    pulsating = false,
    fadeDistance = 0.5,
    saturation = 1.1,
    followMouse = false, // Disabled by default for mobile performance
    mouseInfluence = 0.1,
    className,
    style,
    ...props
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const timeRef = useRef(0);
    const isMobileRef = useRef(window.innerWidth <= 640);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            const container = containerRef.current;
            isMobileRef.current = window.innerWidth <= 640;

            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const handleMouseMove = (e) => {
            if (!followMouse) return;
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        if (followMouse) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        const draw = () => {
            if (!canvas) return;
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // Determine origin
            let originX = width / 2;
            let originY = 0; // top-center

            if (raysOrigin === 'center') {
                originY = height / 2;
            }

            // Mouse influence
            if (followMouse) {
                originX += (mouseRef.current.x - width / 2) * mouseInfluence;
                originY += (mouseRef.current.y - height / 2) * mouseInfluence;
            }

            // Time for animation
            timeRef.current += raysSpeed * 0.16;

            // Draw Rays
            // Draw Rays
            const rayCount = isMobileRef.current ? 5 : 7; // Fewer rays on mobile for cleanliness

            const baseAngle = Math.PI / 2; // Pointing down

            ctx.save();
            ctx.translate(originX, originY);
            // Softer blur for cinematic effect
            ctx.filter = isMobileRef.current ? 'blur(4px)' : 'blur(11px)';

            // Global composition for "gentle" look
            ctx.globalCompositeOperation = 'screen';

            for (let i = 0; i < rayCount; i++) {
                const angleOffset = (Math.sin(timeRef.current * 0.7 + i) * 0.6) * lightSpread; // Slower movement
                const lengthVariation = (Math.cos(timeRef.current * 0.35 + i * 2) * 0.25 + 1) * rayLength;
                const opacityVariation = (Math.sin(timeRef.current + i) * 0.5 + 0.5) * 0.3;

                const angle = baseAngle + (i - rayCount / 2) * (Math.PI / (rayCount * 1.5)) * lightSpread + angleOffset;

                // Ray gradient
                const rayLengthPx =
                    Math.max(width, height) *
                    (isMobileRef.current ? 1.3 : 1.5) *
                    scaleLength(lengthVariation);

                const endX = Math.cos(angle) * rayLengthPx;
                const endY = Math.sin(angle) * rayLengthPx;

                const gradient = ctx.createLinearGradient(0, 0, endX, endY);

                // Parse hex color to rgb for opacity handling
                const color = hexToRgb(raysColor);
                const baseOpacity = isMobileRef.current ? 0.22 : 0.12; // Lower opacity for mobile
                const opacity = pulsating
                    ? opacityVariation * baseOpacity * 2
                    : baseOpacity;

                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
                gradient.addColorStop(fadeDistance * 0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.5})`);
                gradient.addColorStop(fadeDistance, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                // Wider, softer rays
                const baseWidth = isMobileRef.current ? 70 : 180;
                const rayWidth = (Math.sin(i * 123.45) * 0.5 + 1) * baseWidth * saturation;

                ctx.lineTo(Math.cos(angle + 0.08) * rayWidth + endX, Math.sin(angle + 0.08) * rayWidth + endY);
                ctx.lineTo(Math.cos(angle - 0.08) * rayWidth + endX, Math.sin(angle - 0.08) * rayWidth + endY);

                ctx.fillStyle = gradient;
                ctx.fill();
            }
            ctx.filter = 'none';
            ctx.restore();
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (followMouse) window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence]);

    return (
        <div
            ref={containerRef}
            className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
            style={style}
            {...props}
        >
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

// Helper
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
}

function scaleLength(val) {
    if (isNaN(val)) return 1;
    return Math.max(0.1, val);
}

export default LightRays;
