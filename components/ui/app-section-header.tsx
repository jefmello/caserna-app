"use client";

export default function AppSectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[20px] font-semibold tracking-[0.01em] text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-white/50">
            {subtitle}
          </p>
        )}
      </div>

      {right && <div>{right}</div>}
    </div>
  );
}