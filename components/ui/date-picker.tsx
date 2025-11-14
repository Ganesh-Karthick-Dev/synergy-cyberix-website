"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  // Parse date string safely
  const date = React.useMemo(() => {
    if (!value) return undefined
    try {
      const parsed = new Date(value)
      if (isNaN(parsed.getTime())) return undefined
      return parsed
    } catch {
      return undefined
    }
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      onChange(formattedDate)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-[#2a2a2a] text-white border-orange-500/30 hover:bg-[#2a2a2a] hover:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 cursor-pointer",
            !date && "text-gray-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          {date ? format(date, "PPP") : <span className="text-gray-400">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
          maxDate={maxDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

