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
}

export function ComboBoxResponsive({
  values,
  selectedValue,
  setSelectedValue,
  buttonTitle = "+ Select value",
  placeholder = "Search value",
  loading = false,
  loadingText = "Loading...",
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start"
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
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList
            setOpen={setOpen}
            setSelectedValue={setSelectedValue}
            values={values}
            placeholder={placeholder}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start">
          {selectedValue ? (
            <>
              {values.find((value) => value.value === selectedValue)?.label ||
                selectedValue}
            </>
          ) : (
            <>{buttonTitle}</>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            setOpen={setOpen}
            setSelectedValue={setSelectedValue}
            values={values}
            placeholder={placeholder}
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
}: {
  setOpen: (open: boolean) => void;
  setSelectedValue: (value: string | null) => void;
  values: Value[];
  placeholder: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
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
