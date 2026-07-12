import { http } from "@/lib/http";

export type Status = "UP" | "DOWN";

export type HealthInfo = {
  status: Status;
  db: Status;
  diskSpace: {
    status: Status;
    totalGb: number;
    freeGb: number;
    usedPercent: number;
    path: string;
    exists: boolean;
  };
  ping: Status;
  ssl: Status;
};

export type MetricsInfo = {
  systemCpuUsage: number;
  processCpuUsage: number;
  heapUsed: number;
  heapMax: number;
  nonHeapUsed: number;
  liveThreads: number;
  daemonThreads: number;
  peakThreads: number;
  gcCount: number;
  gcPauseTimeMillis: number;
  successRequestCount: number;
  processUptime: number;
};

export const getHealthInfo = () =>
  http.get<HealthInfo>(`/api/monitoring/health`).then((r) => r.data);

export const getMetricsInfo = () =>
  http.get<MetricsInfo>(`/api/monitoring/metrics`).then((r) => r.data);
