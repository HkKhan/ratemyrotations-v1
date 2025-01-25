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

// Debounce utility function
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
  csvPath = "/deduplicated_hospitals_interactive.csv",
}) {
  const [open, setOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  // Load hospitals from CSV on component mount
  useEffect(() => {
    async function loadHospitals() {
      try {
        const response = await fetch(csvPath);
        const csvText = await response.text();
        console.log("text", csvText);

        // Basic CSV parsing
        const rows = csvText.split("\n").slice(1); // Skip header
        const uniqueHospitals = [
          ...new Set(
            rows
              .map((row) => row.split(",")[3]?.trim()) // Hospital name is 4th column
              .filter((name) => name && name.length > 0)
          ),
        ];

        setHospitals(uniqueHospitals);
      } catch (error) {
        console.error("Error loading hospitals:", error);
      }
    }

    loadHospitals();
  }, [csvPath]);

  // Debounced filter function
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
        .slice(0, 50); // Limit to first 50 results

      setFilteredHospitals(filtered);
    }, 300),
    [hospitals]
  );

  // Handle input change
  const handleInputChange = (value) => {
    setFormData({ ...formData, hospitalName: value });
    console.log("hospitals", hospitals);
    debouncedFilterHospitals(value);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Hospital Name</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {formData.hospitalName || "Select hospital..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search hospitals..."
              value={formData.hospitalName}
              onValueChange={handleInputChange}
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
    </div>
  );
}
