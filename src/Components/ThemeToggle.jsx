import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IoIosMoon } from "react-icons/io";

const getInitialTheme = () => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return localStorage.getItem('theme') || 'light';
}

const ThemeToggle = () => {
    const [theme, setTheme] = useState(getInitialTheme);
    const isDark = theme === 'dark';

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        // <button
        //     type="button"
        //     onClick={() => setTheme(isDark ? 'light' : 'dark')}
        //     className="btn btn-sm w-full justify-start gap-2 rounded-lg border border-base-300 bg-base-100 text-base-content hover:bg-base-200"
        //     aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        //     title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        // >
        //     {isDark ? <Sun size={17} /> : <Moon size={17} />}
        //     {isDark ? 'Light Mode' : 'Dark Mode'}
        // </button>
        <div className='flex w-full min-w-40 items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 px-3 py-2.5 text-base-content shadow-sm transition-all duration-200 hover:border-[#CAEB66]/70 hover:bg-base-200 hover:shadow-md'>
            <div className='flex items-center gap-2.5'>
                <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-[#03373D] text-[#CAEB66] shadow-sm'>
                    <IoIosMoon size={21} />
                </span>
                <h1 className='text-sm font-bold leading-none text-nowrap'>
                    Dark Mode
                </h1>
            </div>
            <input type="checkbox" defaultChecked className="toggle toggle-sm border-[#03373D] bg-[#03373D] [--tglbg:#CAEB66] checked:border-[#CAEB66] checked:bg-[#CAEB66] checked:[--tglbg:#03373D]" />
        </div>
    );
};

export default ThemeToggle;
