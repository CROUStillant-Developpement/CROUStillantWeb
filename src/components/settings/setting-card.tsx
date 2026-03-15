type SettingCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingCard({ children, title }: SettingCardProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground/90 px-1">
        {title}
      </h2>
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-6 w-full">
        {children}
      </div>
    </div>
  );
}
