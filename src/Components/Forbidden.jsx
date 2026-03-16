import React from 'react';
import { useNavigate } from 'react-router';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 bg-base-100 text-center">
            {/* Large Decorative Background Text */}
            <div className="relative">
                <h1
                    className="text-[12rem] md:text-[16rem] font-black leading-none opacity-20 select-none text-[#caeb66]"

                >
                    403
                </h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-red-500">
                        Forbidden
                    </h2>
                    <div className="h-1.5 w-20 rounded-full bg-[#caeb66]"></div>
                </div>
            </div>

            <p className="max-w-md mt-6 text-lg text-base-content/70">
                Oops! It looks like you've reached a restricted area.
                Our digital bouncer says you don't have the right credentials for this page.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <button
                    onClick={() => navigate("/")}
                    className="btn btn-custom2 px-8 border-none"
                    style={{ backgroundColor: "#caeb66", color: "#000" }}
                >
                    Return Home
                </button>
            </div>
        </div>
    );
};

export default Forbidden;