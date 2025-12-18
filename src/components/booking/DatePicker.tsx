import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";
import { DateOption } from "@/types/booking";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  dates: DateOption[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DatePicker = ({
  dates,
  selectedDate,
  onSelectDate,
}: DatePickerProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">
          {t("booking.selectDate")}
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred appointment date
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {dates.map((dateOption) => (
          <button
            key={dateOption.value}
            onClick={() => onSelectDate(dateOption.value)}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl border-2 min-w-[80px] transition-all hover:shadow-md",
              selectedDate === dateOption.value
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/50"
            )}
          >
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {dateOption.day}
            </span>
            <span className="text-2xl font-bold text-foreground my-1">
              {dateOption.date}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {dateOption.month}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
