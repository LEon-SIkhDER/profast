import { motion } from "framer-motion";

const checkVariants = {
    rest: {
        pathLength: 0,
        opacity: 0,
        scale: 1,
    },
    hover: {
        pathLength: 1,
        opacity: 1,
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.6,
            ease: "easeInOut",
        },
    },
};

const packageVariants = {
    rest: {
        y: 0,
        rotate: 0,
    },
    hover: {
        y: [0, -2, 0],
        rotate: [0, -2, 2, 0],
        transition: {
            duration: 0.6,
            ease: "easeInOut",
        },
    },
};

const AnimatedPackageCheck = ({ className = "size-6", strokeWidth = 2 }) => {
    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="rest"
            animate="rest"
            whileHover="hover"
        >
            <motion.g variants={packageVariants} style={{ transformOrigin: "center" }}>
                <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                <path d="m7.5 4.27 9 5.15" />
                <path d="M3.29 7 12 12l8.71-5" />
                <path d="M12 22V12" />
            </motion.g>

            <motion.path
                d="m16 16 2 2 4-4"
                variants={checkVariants}
                style={{ transformOrigin: "center" }}
            />
        </motion.svg>
    );
};

export default AnimatedPackageCheck;
