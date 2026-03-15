interface ChangelogItemProps {
  date: string;
  version: string;
  shortDescription: string;
  fullDescription: string;
}

export default function ChangelogItem({
  date,
  version,
  shortDescription,
  fullDescription,
}: ChangelogItemProps) {
  return (
    <div className="relative pl-8 sm:pl-32 py-10 group">
      {/* Timeline Vertical Line */}
      <div className="absolute left-2 sm:left-14 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent sm:ml-[1.5px]" />

      {/* Version Floating Label (Caveat font) */}
      <div className="sm:absolute left-0 top-10 sm:w-28 text-right pr-12 hidden sm:block">
        <span className="font-caveat font-bold text-3xl text-primary/40 block -rotate-6">
          {version}
        </span>
      </div>

      {/* Marker & Content Section */}
      <div className="relative">
        {/* Circle Marker */}
        <div className="absolute -left-[27px] sm:-left-[75px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-primary shadow-sm ring-4 ring-primary/10 transition-transform group-hover:scale-125 duration-300" />

        {/* Date Badge */}
        <div className="mb-3">
          <time className="inline-flex items-center justify-center text-[10px] font-black uppercase tracking-widest px-3 py-1 text-primary bg-primary/10 rounded-full">
            {date}
          </time>
          {/* Version for mobile */}
          <span className="ml-3 font-caveat text-xl text-primary/60 sm:hidden">
            {version}
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h3 className="font-black text-xl sm:text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
            {shortDescription}
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {fullDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
