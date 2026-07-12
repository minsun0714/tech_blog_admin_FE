import { useQuery } from "@tanstack/react-query";
import {
  getHealthInfo,
  getMetricsInfo,
  MetricsInfo,
  HealthInfo,
} from "../monitoring-api";

export function useMonitoringQuery() {
  return useQuery<[HealthInfo, MetricsInfo]>({
    queryKey: ["monitoring"],
    queryFn: () => Promise.all([getHealthInfo(), getMetricsInfo()]),
    refetchInterval: 30000,
  });
}
