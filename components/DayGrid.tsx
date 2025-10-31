import { useMemo } from 'react';

type Props = {
  year: number;
  month: number; // 1-12
  selected: number[];
  onChange: (days: number[]) => void;
};

export default function DayGrid({ year, month, selected, onChange }: Props) {
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const toggle = (d: number) => {
    if (d > daysInMonth) return; // ignore disabled
    const set = new Set(selected);
    set.has(d) ? set.delete(d) : set.add(d);
    onChange(Array.from(set).sort((a, b) => a - b));
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        const disabled = d > daysInMonth;
        const isSelected = selected.includes(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => toggle(d)}
            disabled={disabled}
            className={`rounded-lg py-3 text-base min-h-[44px] border ${
              disabled
                ? 'bg-gray-100 text-gray-400 border-gray-200'
                : isSelected
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            aria-pressed={isSelected}
          >
            {d}
          </button>
        );
      })}
    </div>
  );
}
