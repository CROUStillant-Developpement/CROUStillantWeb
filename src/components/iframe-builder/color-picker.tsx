"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s /= 100; v /= 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

function hsvToHex(h: number, s: number, v: number): string {
  return rgbToHex(...hsvToRgb(h, s, v));
}

function hexToHsv(hex: string): [number, number, number] {
  if (hex.length !== 6) return [0, 100, 100];
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const v = max * 100;
  const s = max === 0 ? 0 : (d / max) * 100;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [h, s, v];
}

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#84cc16",
  "#22c55e", "#14b8a6", "#3b82f6", "#6366f1",
  "#8b5cf6", "#ec4899", "#64748b", "#0f172a",
];

interface Props {
  value: string;       // hex without #, e.g. "ef4444"
  onChange: (hex: string) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  const hex = value.length === 6 ? value : "ef4444";

  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(hex));
  const [hexInput, setHexInput] = useState(hex);

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const draggingSV = useRef(false);
  const draggingHue = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync incoming value → internal HSV (only when value changes from outside)
  useEffect(() => {
    const incoming = value.length === 6 ? value : "ef4444";
    const current = hsvToHex(...hsv);
    if (incoming !== current) {
      setHsv(hexToHsv(incoming));
      setHexInput(incoming);
    }
  }, [value]);

  // Debounced external onChange — UI updates instantly, API call waits 500 ms
  const debouncedOnChange = useCallback((newHex: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => onChange(newHex), 500);
  }, [onChange]);

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const commit = useCallback((h: number, s: number, v: number) => {
    const newHex = hsvToHex(h, s, v);
    setHsv([h, s, v]);
    setHexInput(newHex);
    debouncedOnChange(newHex);
  }, [debouncedOnChange]);

  const readSV = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100;
    const v = (1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))) * 100;
    commit(hsv[0], s, v);
  }, [hsv, commit]);

  const onSVMouseDown = (e: React.MouseEvent) => {
    draggingSV.current = true;
    readSV(e);
  };

  const readHue = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const h = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 360;
    commit(h, hsv[1], hsv[2]);
  }, [hsv, commit]);

  const onHueMouseDown = (e: React.MouseEvent) => {
    draggingHue.current = true;
    readHue(e);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (draggingSV.current) readSV(e);
      if (draggingHue.current) readHue(e);
    };
    const onUp = () => {
      draggingSV.current = false;
      draggingHue.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [readSV, readHue]);

  const onHexChange = (raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    setHexInput(clean);
    if (clean.length === 6) {
      const [h, s, v] = hexToHsv(clean);
      setHsv([h, s, v]);
      debouncedOnChange(clean);
    }
  };

  const [h, s, v] = hsv;
  const pureHue = `hsl(${h}, 100%, 50%)`;
  const cursorX = `${s}%`;
  const cursorY = `${100 - v}%`;
  const hueX = `${(h / 360) * 100}%`;
  const displayHex = `#${hsvToHex(h, s, v)}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 h-9 px-3 rounded-md border border-input bg-transparent shadow-xs hover:bg-primary/5 transition-colors w-full text-left"
          aria-label="Pick colour"
        >
          <span
            className="shrink-0 w-5 h-5 rounded-md border border-black/10 shadow-xs"
            style={{ backgroundColor: displayHex }}
          />
          <span className="font-mono text-sm text-foreground uppercase tracking-wider">{displayHex}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3 space-y-3" align="start" sideOffset={6}>

        {/* SV picker */}
        <div
          ref={svRef}
          onMouseDown={onSVMouseDown}
          className="relative w-full h-40 rounded-lg cursor-crosshair select-none overflow-hidden"
          style={{
            background: `
              linear-gradient(to bottom, transparent, #000),
              linear-gradient(to right, #fff, ${pureHue})
            `,
          }}
        >
          <span
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{ left: cursorX, top: cursorY, backgroundColor: displayHex }}
          />
        </div>

        {/* Hue slider */}
        <div
          ref={hueRef}
          onMouseDown={onHueMouseDown}
          className="relative w-full h-3 rounded-full cursor-pointer select-none"
          style={{
            background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
          }}
        >
          <span
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{ left: hueX, backgroundColor: pureHue }}
          />
        </div>

        {/* Hex input + preview */}
        <div className="flex items-center gap-2">
          <span
            className="shrink-0 w-8 h-8 rounded-lg border border-input shadow-xs"
            style={{ backgroundColor: displayHex }}
          />
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none">#</span>
            <input
              type="text"
              value={hexInput.toUpperCase()}
              onChange={(e) => onHexChange(e.target.value)}
              maxLength={6}
              className="flex h-8 w-full rounded-md border border-input bg-transparent pl-6 pr-2 text-xs font-mono shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring text-foreground uppercase"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-6 gap-1.5">
          {PRESETS.map((preset) => {
            const presetHex = preset.slice(1);
            const isActive = hsvToHex(h, s, v) === presetHex;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  const [ph, ps, pv] = hexToHsv(presetHex);
                  commit(ph, ps, pv);
                }}
                className={`w-full aspect-square rounded-md border transition-all duration-150 hover:scale-110 ${
                  isActive
                    ? "border-foreground ring-1 ring-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: preset }}
                aria-label={preset}
              />
            );
          })}
        </div>

      </PopoverContent>
    </Popover>
  );
}
