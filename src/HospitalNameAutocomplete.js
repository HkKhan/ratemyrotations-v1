import React, { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./components/lib/utils";
import { Button } from "./components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import hospitalData from "./public/deduplicated_hospitals_interactive.csv";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function HospitalNameAutocomplete({
  formData,
  setFormData,
  placeholder = "Search by hospital name...",
}) {
  const [open, setOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  useEffect(() => {
    async function loadHospitals() {
      try {
        const response = await fetch(hospitalData);
        const csvText = await response.text();

        const rows = csvText.split("\n").slice(1);
        const uniqueHospitals = [
          ...new Set(
            rows
              .map((row) => row.split(",")[3]?.trim())
              .filter((name) => name && name.length > 0)
          ),
        ];

        setHospitals(uniqueHospitals);
      } catch (error) {
        console.error("Error loading hospitals:", error);
      }
    }

    loadHospitals();
  }, []);

  const debouncedFilterHospitals = useCallback(
    debounce((value) => {
      if (!value) {
        setFilteredHospitals([]);
        return;
      }

      const filtered = hospitals
        .filter((hospital) =>
          hospital.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 50);

      setFilteredHospitals(filtered);
    }, 300),
    [hospitals]
  );

  const handleInputChange = (value) => {
    setFormData({ ...formData, hospitalName: value });
    debouncedFilterHospitals(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-6 py-4 h-[54px] bg-white text-gray-900 shadow-lg rounded-lg" // Added text-gray-900
        >
          <span className="truncate">
            {formData.hospitalName || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search hospitals..."
            value={formData.hospitalName}
            onValueChange={handleInputChange}
            className="w-full"
          />
          <CommandList>
            <CommandEmpty>No hospitals found.</CommandEmpty>
            <CommandGroup>
              {filteredHospitals.map((hospital) => (
                <CommandItem
                  key={hospital}
                  value={hospital}
                  onSelect={(currentValue) => {
                    setFormData({
                      ...formData,
                      hospitalName:
                        currentValue === formData.hospitalName
                          ? ""
                          : currentValue,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      formData.hospitalName === hospital
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {hospital}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
