import React from 'react';
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { format, startOfDay } from "date-fns";
import { FiltersType } from '../types/filters';
import { DateRange } from "react-day-picker";

interface FiltersProps {
  onFilterChange: (filters: FiltersType) => void;
  oemProviders: string[];
  cities: string[];
}

export function Filters({ onFilterChange, oemProviders, cities }: FiltersProps) {
  // Local state for filters
  const [localFilters, setLocalFilters] = React.useState({
    dateRange: undefined as DateRange | undefined,
    oem: undefined as string | undefined,
    vehicleId: "",
  });

  const handleApplyFilters = () => {
    onFilterChange({
      startDate: localFilters.dateRange?.from,
      endDate: localFilters.dateRange?.to,
      oem: localFilters.oem === 'all' ? undefined : localFilters.oem,
      vehicleId: localFilters.vehicleId || undefined,
      applied: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Date Range</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {localFilters.dateRange?.from ? (
                  localFilters.dateRange.to ? (
                    <>
                      {format(localFilters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(localFilters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(localFilters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Pick a date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={localFilters.dateRange?.from}
                selected={localFilters.dateRange}
                onSelect={(range) => setLocalFilters(prev => ({ ...prev, dateRange: range }))}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* OEM */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">OEM Provider</h3>
          <Select 
            value={localFilters.oem} 
            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, oem: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="Switch">Switch</SelectItem>
              <SelectItem value="Tata">Tata</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle ID */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Vehicle ID</h3>
          <input
            type="text"
            placeholder="Enter vehicle ID"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={localFilters.vehicleId}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, vehicleId: e.target.value }))}
          />
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="flex justify-end pt-2 px-1">
        <Button onClick={handleApplyFilters} className="px-8  mb-4">
          Apply Filters
        </Button>
      </div>
    </div>
  );
} 