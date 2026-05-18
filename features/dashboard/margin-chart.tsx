"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

type MarginChartDatum = {
  name: string;
  margin: number;
  expenses: number;
  revenue: number;
};

type MarginChartProps = {
  data: MarginChartDatum[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

const CHART_HEIGHT = 288;

function MarginChartContent({ data }: MarginChartProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  const updateWidth = useCallback((element: HTMLDivElement) => {
    const nextWidth = Math.floor(element.getBoundingClientRect().width);
    setWidth(nextWidth > 0 ? nextWidth : null);
  }, []);

  const handleContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      setContainer(element);

      if (element) {
        updateWidth(element);
      }
    },
    [updateWidth],
  );

  useEffect(() => {
    if (!container) {
      return undefined;
    }

    const handleResize = () => {
      updateWidth(container);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [container, updateWidth]);

  return (
    <div className="h-72 w-full min-w-0 overflow-hidden" ref={handleContainerRef}>
      {width ? (
        <BarChart data={data} height={CHART_HEIGHT} margin={{ bottom: 8, left: 0, right: 8, top: 8 }} width={width}>
          <CartesianGrid stroke="#e8dfd1" strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="name"
            interval={0}
            minTickGap={8}
            tick={{ fill: "#6f675d", fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6f675d", fontSize: 11 }}
            tickFormatter={(value) => currencyFormatter.format(Number(value))}
            tickLine={false}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: "#fffdf8",
              border: "1px solid #ddd4c4",
              borderRadius: 8,
              boxShadow: "0 18px 45px rgba(80, 61, 30, 0.08)",
              color: "#171717",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              currencyFormatter.format(Number(value)),
              name === "margin" ? "Marge" : name === "expenses" ? "Depenses" : "Base CA",
            ]}
          />
          <Bar dataKey="revenue" fill="#d8cab7" name="Base CA" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#b7791f" name="Depenses" radius={[4, 4, 0, 0]} />
          <Bar dataKey="margin" fill="#1f766f" name="Marge" radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : null}
    </div>
  );
}

export const MarginChart = dynamic<MarginChartProps>(() => Promise.resolve(MarginChartContent), {
  loading: () => <div aria-hidden className="h-72 w-full min-w-0" />,
  ssr: false,
});
