import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { navItems } from "../constant/Menu";
import UserDropdown from "../components/header/UserDropdown";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { pathname } = useLocation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const isSidebarOpen = isExpanded || isHovered || isMobileOpen;

  useEffect(() => {
    const parent = navItems.find((item) =>
      item.subItems?.some((sub) => sub.path === pathname),
    );
    setOpenMenuId(parent?.id ?? null);
  }, [pathname]);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-900 
  border-r transition-all duration-300 flex flex-col
  ${isSidebarOpen ? "w-[230px]" : "w-[80px]"}
  ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        {isSidebarOpen && (
          <Link to="/" className="font-bold text-lg tracking-wide">
            CMS
          </Link>
        )}
        <button
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg width="18" height="14" viewBox="0 0 16 12" fill="none">
            <path
              d="M1 1h14M1 6h14M1 11h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav className="px-3 py-4 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.path === pathname;
            const isOpen = openMenuId === item.id;

            return (
              <li key={item.id}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`menu-item ${
                        isOpen ? "menu-item-active" : "menu-item-inactive"
                      } ${!isSidebarOpen ? "lg:justify-center" : ""}`}
                    >
                      <span className="menu-item-icon-size">{item.icon}</span>

                      {isSidebarOpen && (
                        <>
                          <span className="menu-item-text">{item.name}</span>
                          <ChevronDownIcon
                            className={`ml-auto transition-transform ${
                              isOpen ? "rotate-180 text-brand-500" : ""
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {isSidebarOpen && (
                      <ul
                        className={`ml-9 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        {item.subItems.map((sub) => (
                          <li key={sub.path}>
                            <Link
                              to={sub.path}
                              className={`menu-dropdown-item ${
                                pathname === sub.path
                                  ? "menu-dropdown-item-active"
                                  : "menu-dropdown-item-inactive"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path!}
                    className={`menu-item ${
                      isActive ? "menu-item-active" : "menu-item-inactive"
                    }`}
                  >
                    <span className="menu-item-icon-size">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="menu-item-text">{item.name}</span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-3">
        <div
          className={`flex items-center ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          <UserDropdown />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
