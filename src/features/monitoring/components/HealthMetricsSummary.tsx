import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Cpu, Database, Shield, Wifi } from "lucide-react";
import { useMonitoringQuery } from "../hooks/use-health";
import {Status} from "@/features/monitoring/monitoring-api"

function StatusBadge({ status }: { status: Status}) {
  return (
    <Badge
      className={
        status === "UP"
          ? "bg-green-500 hover:bg-green-500"
          : "bg-red-500 hover:bg-red-500"
      }
    >
      {status}
    </Badge>
  );
}

export default function MonitoringGraph() {
  const { data, isLoading, isError } = useMonitoringQuery();

  if (isLoading) return <div>Loading...</div>;

  if (isError || !data) {
    return <div>Error occurred while fetching monitoring data.</div>;
  }

  const [health, metrics] = data;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Health */}
      <Card>
        <CardHeader>
          <CardTitle>Health Status</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall</span>
            <StatusBadge status={health.status} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={18} />
              DB
            </div>
            <StatusBadge status={health.db} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi size={18} />
              Ping
            </div>
            <StatusBadge status={health.ping} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={18} />
              SSL
            </div>
            <StatusBadge status={health.ssl} />
          </div>
        </CardContent>
      </Card>

      {/* Disk */}
      <Card>
        <CardHeader>
          <CardTitle>Disk Usage</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive size={18} />
            <span>{health.diskSpace.path}</span>
          </div>

          <Progress value={health.diskSpace.usedPercent} />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Used {health.diskSpace.usedPercent}%</span>
            <span>{health.diskSpace.freeGb} GB Free</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total</div>
              <div className="font-semibold">{health.diskSpace.totalGb} GB</div>
            </div>

            <div>
              <div className="text-muted-foreground">Status</div>
              <StatusBadge status={health.diskSpace.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CPU */}
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="flex items-center gap-2">
                <Cpu size={18} />
                System
              </span>

              <span>{metrics.systemCpuUsage}%</span>
            </div>

            <Progress value={metrics.systemCpuUsage} />
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <span>Process</span>

              <span>{metrics.processCpuUsage}%</span>
            </div>

            <Progress value={metrics.processCpuUsage} />
          </div>
        </CardContent>
      </Card>

      {/* Memory */}
      <Card>
        <CardHeader>
          <CardTitle>Memory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Heap Used</span>
            <strong>{metrics.heapUsed} MB</strong>
          </div>

          <Progress value={(metrics.heapUsed / metrics.heapMax) * 100} />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Heap Max</div>
              <div className="font-semibold">{metrics.heapMax} MB</div>
            </div>

            <div>
              <div className="text-muted-foreground">Non Heap</div>
              <div className="font-semibold">{metrics.nonHeapUsed} MB</div>
            </div>

            <div>
              <div className="text-muted-foreground">Live Threads</div>
              <div className="font-semibold">{metrics.liveThreads}</div>
            </div>

            <div>
              <div className="text-muted-foreground">Peak Threads</div>
              <div className="font-semibold">{metrics.peakThreads}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
