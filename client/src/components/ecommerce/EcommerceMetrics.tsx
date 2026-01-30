import { GroupIcon, BoxIconLine, UserIcon } from "../../icons";
import { MetricCard } from "../common/MetricCard";
import Badge from "../ui/badge/Badge";

export default function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      <MetricCard
        title="Total Visitors"
        value="12,480"
        icon={<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />}
        footer={<Badge color="success">+8.2% this month</Badge>}
      />

      <MetricCard
        title="Today's Visits"
        icon={
          <BoxIconLine className="size-6 text-gray-800 dark:text-white/90" />
        }
        value="55"
        footer={
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center">
              <p className="font-semibold text-gray-800 dark:text-white/90">
                32
              </p>
              <p className="text-gray-500">Arrived</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-yellow-600">5</p>
              <p className="text-gray-500">Delayed</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-green-600">18</p>
              <p className="text-gray-500">Completed</p>
            </div>
          </div>
        }
      />

      <MetricCard
        title="Hosts"
        icon={<UserIcon className="size-6 text-gray-800 dark:text-white/90" />}
        value="17"
        footer={
          <div className="flex gap-3">
            <Badge color="success">Active: 14</Badge>
            <Badge color="error">Inactive: 3</Badge>
          </div>
        }
      />
    </div>
  );
}
