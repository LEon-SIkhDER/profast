import { Moon, Sun } from 'lucide-react';
import { useContext, } from 'react';
import { IoIosMoon } from "react-icons/io";
import { AuthContext } from '../Context/AuthContext';

const ThemeToggle = () => {
    const { theme, handleTheme } = useContext(AuthContext)

    //  [--tglbg:#CAEB66]
    //  checked:[--tglbg:#03373D]
    //  dark:[--tglbg:#03373D]
    //  dark:checked:[--tglbg:#CAEB66]

    // bg-[#03373D]
    return (
        <div className="flex w-full min-w-40 items-center justify-between gap-4 rounded-xl border border-base-300 bg-white dark:bg-[#071A1D] px-3 py-2.5 text-zinc-900 shadow-sm transition-all duration-200   hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-white  dark:hover:bg-zinc-800">
            <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#03373D] text-[#CAEB66] shadow-sm ">
                    <IoIosMoon size={21} />
                </span>

                <h1 className="text-nowrap text-sm font-bold leading-none">
                    Dark Mode
                </h1>
            </div>

            <input
                onChange={(e) => handleTheme(e.target.checked)}
                type="checkbox"
                defaultChecked={theme === "dark"}
                className="toggle toggle-sm

                text-gray-500 dark:text-[#AAB8B4]
                checked:text-[#CAEB66]

                
                border-gray-300 dark:border-white/10
                checked:border-[#CAEB66]
                dark:border-[#CAEB66] 
                dark:checked:border-white/5
                
                bg-gray-200
                checked:bg-[#CAEB66]
                dark:bg-[#CAEB66] 
                dark:checked:bg-[#03373D]"
                
            />
        </div>
    );
};

export default ThemeToggle;

