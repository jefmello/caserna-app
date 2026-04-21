"use client";

import NumberFlow, { type Format } from "@number-flow/react";

type Props = {
  value: number;
  format?: Format;
  suffix?: string;
  prefix?: string;
  className?: string;
};

/**
 * Number that animates smoothly between values (points, wins, etc.).
 * Wraps @number-flow/react with pt-BR defaults.
 */
export default function AnimatedNumber({ value, format, suffix, prefix, className }: Props) {
  return (
    <span className={className}>
      {prefix}
      <NumberFlow
        value={value}
        locales="pt-BR"
        format={format ?? { maximumFractionDigits: 0 }}
        transformTiming={{ duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        spinTiming={{ duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      {suffix}
    </span>
  );
}
