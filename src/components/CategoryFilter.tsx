"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "music", label: "Music" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "art", label: "Art" },
  { value: "food", label: "Food" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "fashion", label: "Fashion" },
]

interface CategoryFilterProps {
  onValueChange?: (value: string) => void
}

export function CategoryFilter({ onValueChange }: CategoryFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("all")

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue || "all")
    if (onValueChange) {
      onValueChange(newValue || "all")
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between sm:w-[200px]">
          {categories.find((category) => category.value === value)?.label || "Select category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 sm:w-[200px]">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem key={category.value} value={category.value} onSelect={handleSelect}>
                  <Check className={cn("mr-2 h-4 w-4", value === category.value ? "opacity-100" : "opacity-0")} />
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
