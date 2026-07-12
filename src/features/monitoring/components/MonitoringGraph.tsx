import { useMonitoringQuery } from "../hooks/use-health";

export default function MonitoringGraph() {
  const { data, isLoading, isError } = useMonitoringQuery();

  console.log("MonitoringGraph data:", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching monitoring data.</div>;
  }
  return <div>{JSON.stringify(data)}</div>;
}
