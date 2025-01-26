import React from "react";
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
import { specialties } from "./public/specialties"; // Adjust import path

export function SpecialtyAutocomplete({
  formData,
  setFormData,
  placeholder = "Search by specialty...",
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-6 py-4 h-[54px] bg-white text-gray-900 shadow-lg rounded-lg" // Added text-gray-900
        >
          <span className="truncate">{formData.specialty || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search specialties..."
            value={formData.specialty}
            onValueChange={(value) =>
              setFormData({ ...formData, specialty: value })
            }
          />
          <CommandList>
            <CommandEmpty>No specialties found.</CommandEmpty>
            <CommandGroup>
              {specialties.map((specialty) => (
                <CommandItem
                  key={specialty}
                  value={specialty}
                  onSelect={(currentValue) => {
                    setFormData({
                      ...formData,
                      specialty:
                        currentValue === formData.specialty ? "" : currentValue,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      formData.specialty === specialty
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {specialty}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
