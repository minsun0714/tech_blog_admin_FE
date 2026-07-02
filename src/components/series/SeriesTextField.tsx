interface SeriesTextFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  inputMode?: "text" | "numeric";
}

export default function SeriesTextField({
  label,
  value,
  placeholder,
  onChange,
  inputMode = "text",
}: SeriesTextFieldProps) {
  return (
    <label className="block space-y-1 text-sm text-slate-600">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-violet-100 px-3 text-sm text-slate-900 outline-none transition focus:border-violet-400"
        placeholder={placeholder}
        inputMode={inputMode}
      />
    </label>
  );
}
