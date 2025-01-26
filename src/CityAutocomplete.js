import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./components/ui/command";
import { Button } from "./components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./components/lib/utils";
import { cities } from "./public/cities";

export function CityAutocomplete({
  formData,
  setFormData,
  placeholder = "Search by city...",
}) {
  const [open, setOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const handleInputChange = (value) => {
    const filtered = cities
      .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 100); // Limit to first 100 results

    setFilteredCities(filtered);
    setFormData({ ...formData, city: value });
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
          <span className="truncate">{formData.city || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search cities..."
            value={formData.city}
            onValueChange={handleInputChange}
            className="w-full"
          />
          <CommandList>
            <CommandEmpty>No cities found.</CommandEmpty>
            <CommandGroup>
              {filteredCities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    setFormData({
                      ...formData,
                      city: currentValue === formData.city ? "" : currentValue,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      formData.city === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
