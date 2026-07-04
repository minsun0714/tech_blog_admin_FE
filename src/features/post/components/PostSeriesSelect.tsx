import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSeriesQuery } from "@/features/series/hooks/use-series";

const NONE_VALUE = "__none__";

interface PostSeriesSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function PostSeriesSelect({ value, onChange }: PostSeriesSelectProps) {
  const { data: series } = useSeriesQuery();

  return (
    <div className="space-y-2">
      <Label>시리즈</Label>
      <Select
        value={value === null ? NONE_VALUE : String(value)}
        onValueChange={(v) => onChange(v === NONE_VALUE ? null : Number.parseInt(v, 10))}
      >
        <SelectTrigger>
          <SelectValue placeholder="시리즈 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>선택 안 함</SelectItem>
          {(series ?? []).map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
