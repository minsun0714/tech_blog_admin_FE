import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreateSeriesMutation,
  useSeriesQuery,
} from "@/features/series/hooks/use-series";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePopover } from "../hooks/use-pop-over";

const NONE_VALUE = "__none__";

interface PostSeriesSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function PostSeriesSelect({
  value,
  onChange,
}: PostSeriesSelectProps) {
  const { data: series } = useSeriesQuery();
  const seriesCreateMutation = useCreateSeriesMutation();
  const { open, setOpen, close } = usePopover();

  return (
    <div className="space-y-2">
      <Label>시리즈</Label>
      <div className="flex items-center gap-2">
        <Select
          value={value === null ? NONE_VALUE : String(value)}
          onValueChange={(v) =>
            onChange(v === NONE_VALUE ? null : Number.parseInt(v, 10))
          }
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

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button variant="default" size="sm" className="bg-violet-200">
                <Plus color="black" />
              </Button>
            }
          >
            Open Popover
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>New Series</PopoverTitle>
              <PopoverDescription>
                새로운 시리즈를 추가합니다.
              </PopoverDescription>
            </PopoverHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const form = e.currentTarget;
                const formData = new FormData(form);

                const name = formData.get("seriesName");

                if (typeof name !== "string" || !name.trim()) {
                  return;
                }

                const {id} = await seriesCreateMutation.mutateAsync(name);

                form.reset();
                close();
                onChange(id);
              }}
            >
              <Input name="seriesName" placeholder="시리즈 이름" />

              <Button type="submit">시리즈 생성</Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
