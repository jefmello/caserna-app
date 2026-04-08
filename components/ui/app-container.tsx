"use client";

export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
      {children}
    </div>
  );
}