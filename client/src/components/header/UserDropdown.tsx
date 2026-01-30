import { useState } from "react";
import { Link } from "react-router";
import { LogOut } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useSidebar } from "../../context/SidebarContext";

export default function UserDropdown() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  const isSidebarOpen = isExpanded || isHovered || isMobileOpen;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center w-full text-gray-700 dark:text-gray-400
          ${isSidebarOpen ? "gap-3 justify-between px-3" : "justify-center"}
        `}
      >
        <span className="overflow-hidden rounded-full h-11 w-11 shrink-0">
          <img src="/images/user/owner.jpg" alt="User" />
        </span>

        {isSidebarOpen && (
          <>
            <span className="flex-1 text-left font-medium text-theme-sm">
              Hiren
            </span>

            <svg
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
            >
              <path
                d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>

      {/* DROPDOWN */}
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className={`
          absolute bottom-full mb-3
          ${isSidebarOpen ? "left-0" : "left-1/2 -translate-x-1/2"}
          w-[220px]
          rounded-2xl border border-gray-200 bg-white p-3
          shadow-theme-lg
          dark:border-gray-800 dark:bg-gray-dark
        `}
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-300">
            Hiren Panchal
          </span>
          <span className="block mt-0.5 text-theme-xs text-gray-500">
            H.p@gmail.com
          </span>
        </div>

        <Link
          to="/signin"
          className="flex items-center gap-3 px-3 py-2 mt-3
          rounded-lg text-theme-sm font-medium
          text-red-600 hover:bg-red-50
          dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
}
