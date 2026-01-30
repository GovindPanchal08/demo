import DashboardMetrics from "../../components/ecommerce/EcommerceMetrics";
import VisitorsApprovalTable from "../../components/ecommerce/VisitorsApprovalTable";

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <DashboardMetrics />
      </div>

      <div className="col-span-12 xl:col-span-8">
        <VisitorsApprovalTable />
      </div>

      <div className="col-span-12 xl:col-span-4 space-y-6">
        {/* Host summary card */}
        {/* Notifications */}
        {/* Quick actions */}
      </div>
    </div>
  );
}
