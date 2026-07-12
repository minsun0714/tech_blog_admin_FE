import MonitoringGraph from "@/features/monitoring/components/HealthMetricsSummary";
import PostsDashBoardCards from "@/features/monitoring/components/PostsDashBoardCards";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          대시보드
        </h2>
        <p className="text-sm text-slate-500">
          블로그 관리 현황을 한눈에 확인합니다.
        </p>
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">
        블로그 현황
      </h2>
      <PostsDashBoardCards />
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">
        모니터링 현황
      </h2>
      <MonitoringGraph />
    </div>
  );
}
