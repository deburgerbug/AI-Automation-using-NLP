// import { useEffect, useState } from "react";
// import { Sun, Moon } from 'lucide-react';
// import { cn } from '../../utils/cn';

// export function DarkModeToggle() {
//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem("theme") === "dark"
//   );

//   useEffect(() => {
//     const root = document.documentElement;
//     if (darkMode) {
//       root.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       root.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   return (
//     <button
//       className={cn(
//         "p-2 rounded-lg transition-colors",
//         "bg-gray-200 dark:bg-gray-800",
//         "text-gray-600 dark:text-gray-400",
//         "hover:bg-gray-300 dark:hover:bg-gray-700"
//       )}
//       onClick={() => setDarkMode((prev) => !prev)}
//       aria-label="Toggle theme"
//     >
//       {darkMode ? (
//         <Sun className="w-5 h-5" />
//       ) : (
//         <Moon className="w-5 h-5" />
//       )}
//     </button>
//   );
// }