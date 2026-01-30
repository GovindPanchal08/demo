import { Link } from "react-router";
import { ArrowLeft, Plus, Search } from "lucide-react";
import Button from "../ui/button/Button";

interface PageHeaderProps {
  title: string;
  description?: string;

  // Back button
  showBack?: boolean;
  backTo?: string;

  // Search
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  // Filters (custom JSX)
  filters?: React.ReactNode;

  // Primary action
  actionLabel?: string;
  onActionClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,

  showBack = false,
  backTo = "/",

  showSearch = false,
  searchPlaceholder = "Search...",
  onSearchChange,

  filters,

  actionLabel,
  onActionClick,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {showBack && (
            <Link
              to={backTo}
              className="mt-1 inline-flex items-center justify-center
              rounded-lg border border-gray-200 p-2
              text-gray-600 hover:bg-gray-100
              dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
            >
              <ArrowLeft size={18} />
            </Link>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showSearch && (
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="h-9 w-56 rounded-lg border border-gray-200 pl-9 pr-3
                text-sm text-gray-700 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-primary-500
                dark:border-gray-800 dark:bg-gray-dark dark:text-gray-300"
              />
            </div>
          )}

          {filters && filters}

          {actionLabel && (
            <Button
              onClick={onActionClick}
              startIcon={<Plus size={16} />}
              size="sm"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

{
  /* <PageHeader title="Dashboard" />
<PageHeader
  title="Users"
  description="Manage all registered users"
  showBack
  backTo="/admin"
/>
<PageHeader
  title="Forms"
  description="Create and manage dynamic forms"
  showBack
  backTo="/dashboard"
  showSearch
  onSearchChange={(v) => console.log(v)}
  filters={
    <select className="h-9 rounded-lg border px-3 text-sm dark:bg-gray-dark">
      <option>All</option>
      <option>Active</option>
      <option>Archived</option>
    </select>
  }
  actionLabel="Add Form"
  onActionClick={() => console.log("Add clicked")}
/> */
}
