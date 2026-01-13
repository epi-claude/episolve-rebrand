import { useState, useMemo } from "react";
import { format, addDays, startOfDay, isWeekend, isBefore } from "date-fns";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingSlotPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const TIME_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
];

const formatTimeSlot = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export function BookingSlotPicker({ value, onChange }: BookingSlotPickerProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate weekdays for the current week view
  const weekDays = useMemo(() => {
    const today = startOfDay(new Date());
    const startDate = addDays(today, weekOffset * 7);
    const days: Date[] = [];
    
    // Find the next 5 weekdays from startDate
    let currentDate = startDate;
    while (days.length < 5) {
      if (!isWeekend(currentDate) && !isBefore(currentDate, today)) {
        days.push(currentDate);
      }
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  }, [weekOffset]);

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    // Clear time when date changes
    setSelectedTime(null);
    onChange("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      // Combine date and time into ISO format
      const dateTime = `${selectedDate}T${time}:00`;
      onChange(dateTime);
    }
  };

  const canGoBack = weekOffset > 0;

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {weekDays.length > 0 && (
            <>
              {format(weekDays[0], "MMM d")} - {format(weekDays[weekDays.length - 1], "MMM d, yyyy")}
            </>
          )}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setWeekOffset((prev) => prev + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Select a date (Mon-Fri)</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {weekDays.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const isSelected = selectedDate === dateStr;
            
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleDateSelect(date)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border transition-all",
                  "hover:border-primary hover:bg-primary/5",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground"
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(date, "EEE")}
                </span>
                <span className="text-lg font-bold">
                  {format(date, "d")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Select a time (10:00 AM - 3:00 PM EST)</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((time) => {
              const isSelected = selectedTime === time;
              
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={cn(
                    "py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                    "hover:border-primary hover:bg-primary/5",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  )}
                >
                  {formatTimeSlot(time)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Summary */}
      {value && selectedDate && selectedTime && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-primary font-medium">
            Selected: {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")} at {formatTimeSlot(selectedTime)} EST
          </p>
        </div>
      )}
    </div>
  );
}
