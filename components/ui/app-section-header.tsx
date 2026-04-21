"use client";

export default function AppSectionHeader({
  title,
  subtitle,
  right,
  isDarkMode,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  isDarkMode?: boolean;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2
          className={`text-[20px] font-semibold tracking-[0.01em] ${isDarkMode ? "text-white" : "text-zinc-950"}`}
        >
          {title}
        </h2>

        {subtitle && (
          <p className={`mt-1 text-sm ${isDarkMode ? "text-white/50" : "text-zinc-500"}`}>
            {subtitle}
          </p>
        )}
      </div>

      {right && <div>{right}</div>}
    </div>
  );
}
