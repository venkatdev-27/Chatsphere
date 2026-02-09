import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ animateOnHover = false, size = 40, className = '' }) => {
    const spinVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
            },
        },
        hover: {
            rotate: 360,
            transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: 'linear',
            },
        },
    };

    return (
        <motion.div
            className={`inline-flex items-center justify-center ${className}`}
            variants={spinVariants}
            animate={!animateOnHover ? 'animate' : undefined}
            whileHover={animateOnHover ? 'hover' : undefined}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="60 40"
                    className="text-indigo-500"
                />
            </svg>
        </motion.div>
    );
};

export default Loader;
