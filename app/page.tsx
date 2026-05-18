import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { getDashboardData } from "@/lib/data/repository";

export default function HomePage() {
  return <DashboardScreen data={getDashboardData()} />;
}
