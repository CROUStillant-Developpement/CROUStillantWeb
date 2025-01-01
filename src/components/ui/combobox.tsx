"use client";

import * as React from "react";

import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronRight } from "lucide-react";

type Value = {
  value: string;
  label: string;
};

interface ComboBoxProps {
  values: Value[];
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  buttonTitle?: string;
  placeholder?: string;
  loading?: boolean;
  loadingText?: string;
  noResultsText?: string;
}

export function ComboBoxResponsive({
  values,
  selectedValue,
  setSelectedValue,
  buttonTitle = "+ Select value",
  placeholder = "Search value",
  loading = false,
  loadingText = "Loading...",
  noResultsText = "No results found.",
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full items-center justify-between"
            disabled={loading}
          >
            {loading ? (
              <>{loadingText}</>
            ) : (
              <>
                {selectedValue ? (
                  <>
                    {values.find((value) => value.value === selectedValue)
                      ?.label || selectedValue}
                  </>
                ) : (
                  <>{buttonTitle}</>
                )}
              </>
            )}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <StatusList
            setOpen={setOpen}
            setSelectedValue={setSelectedValue}
            values={values}
            placeholder={placeholder}
            noResultsText={noResultsText}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full items-center justify-between"
        >
          {selectedValue ? (
            <>
              {values.find((value) => value.value === selectedValue)?.label ||
                selectedValue}
            </>
          ) : (
            <>{buttonTitle}</>
          )}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            setOpen={setOpen}
            setSelectedValue={setSelectedValue}
            values={values}
            placeholder={placeholder}
            noResultsText={noResultsText}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedValue,
  values,
  placeholder,
  noResultsText = "No results found.",
}: {
  setOpen: (open: boolean) => void;
  setSelectedValue: (value: string | null) => void;
  values: Value[];
  placeholder: string;
  noResultsText?: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{noResultsText}</CommandEmpty>
        <CommandGroup>
          {values.map((value) => (
            <CommandItem
              key={value.value}
              value={value.label}
              onSelect={(value) => {
                setSelectedValue(
                  values.find((v) => v.label === value)?.value || null
                );
                setOpen(false);
              }}
            >
              {value.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
