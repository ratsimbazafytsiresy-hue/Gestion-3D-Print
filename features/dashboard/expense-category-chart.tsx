"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

type ExpenseCategoryDatum = {
  category: string;
  total: number;
};

type ExpenseCategoryChartProps = {
  data: ExpenseCategoryDatum[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
});

const CHART_HEIGHT = 288;

function ExpenseCategoryChartContent({ data }: ExpenseCategoryChartProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  const measureWidth = useCallback(() => {
    if (!container) {
      return;
    }

    const nextWidth = Math.floor(container.getBoundingClientRect().width);
    setWidth(nextWidth > 0 ? nextWidth : null);
  }, [container]);

  useEffect(() => {
    if (!container) {
      return undefined;
    }

    let frameId = window.requestAnimationFrame(measureWidth);
    const handleResize = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(measureWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [container, measureWidth]);

  return (
    <div className="h-72 w-full min-w-0 overflow-hidden" ref={setContainer}>
      {width ? (
        <BarChart
          data={data}
          height={CHART_HEIGHT}
          layout="vertical"
          margin={{ bottom: 8, left: 8, right: 16, top: 8 }}
          width={width}
        >
          <CartesianGrid stroke="#e8dfd1" strokeDasharray="4 4" horizontal={false} />
          <XAxis
            axisLine={false}
            tick={{ fill: "#6f675d", fontSize: 11 }}
            tickFormatter={(value) => currencyFormatter.format(Number(value))}
            tickLine={false}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="category"
            tick={{ fill: "#6f675d", fontSize: 11 }}
            tickLine={false}
            type="category"
            width={92}
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
            formatter={(value) => [currencyFormatter.format(Number(value)), "Depenses"]}
          />
          <Bar dataKey="total" fill="#b7791f" name="Depenses" radius={[0, 4, 4, 0]} />
        </BarChart>
      ) : null}
    </div>
  );
}

export const ExpenseCategoryChart = dynamic<ExpenseCategoryChartProps>(() => Promise.resolve(ExpenseCategoryChartContent), {
  loading: () => <div aria-hidden className="h-72 w-full min-w-0" />,
  ssr: false,
});
