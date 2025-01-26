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
import { states } from "./public/states";

export function StateAutocomplete({
  formData,
  setFormData,
  placeholder = "Search by state...",
}) {
  const [open, setOpen] = useState(false);
  const [filteredStates, setFilteredStates] = useState([]);

  const handleInputChange = (value) => {
    const filtered = states
      .filter((state) => state.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 50); // Limit to first 50 results

    setFilteredStates(filtered);
    setFormData({ ...formData, state: value });
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
          <span className="truncate">{formData.state || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search states..."
            value={formData.state}
            onValueChange={handleInputChange}
            className="w-full"
          />
          <CommandList>
            <CommandEmpty>No states found.</CommandEmpty>
            <CommandGroup>
              {filteredStates.map((state) => (
                <CommandItem
                  key={state}
                  value={state}
                  onSelect={(currentValue) => {
                    setFormData({
                      ...formData,
                      state:
                        currentValue === formData.state ? "" : currentValue,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      formData.state === state ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {state}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
