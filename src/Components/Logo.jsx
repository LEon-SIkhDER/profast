import React from 'react';
import logo from "../assets/logo.png"
import { Link } from 'react-router';
import { motion } from "framer-motion"
// import { motion } from "motion/react"
// import "./Logo.css"

const Logo = ({ className, textColor = "#03373d" }) => {
    //
    return (
        <Link to={"/"} className={`inline-flex shrink-0 group  ${className}`}>
            <motion.div
                className='flex items-center text-xl xxs:text-2xl  font-extrabold cursor-pointer'>
                <span className='
                    translate-x-3 xxs:translate-x-[15px] group-hover:translate-x-[13px]
                    -translate-y-[7px] xxs:-translate-y-2.5 group-hover:-translate-y-3
                     relative  duration-300 '>
                    <motion.img
                        initial={{
                            x: 30, y: 6
                        }}
                        animate={{
                            x: 0, y: 0
                        }}
                        transition={
                            {
                                type: "spring",
                                bounce: 0.4,
                                duration: .6
                            }
                        }
                        className='h-8 xxs:h-10'


                        src={logo} alt="" />
                </span>
                <motion.h1
                    initial={{
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    transition={{
                        // type: "spring",
                        bounce: 0.2,
                        duration: .3
                    }}
                    className='' style={{ color: textColor }}>Profast</motion.h1>
                <span className='
                    -translate-x-[11px] xxs:-translate-x-3.5  group-hover:-translate-x-3
                    translate-y-[7px] xxs:translate-y-2 group-hover:translate-y-2.5
                    rotate-180 relative duration-300
                    '>

                    <motion.img
                        initial={{
                            x: 30, y: 6
                        }}
                        animate={{
                            x: 0, y: 0
                        }}
                        transition={
                            {
                                type: "spring",
                                bounce: 0.4,
                                duration: .6
                            }
                        }
                        className=' h-8 xxs:h-10 '
                        src={logo} alt="" />
                </span>
            </motion.div>
        </Link>
    );
};

export default Logo;
