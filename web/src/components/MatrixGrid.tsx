"use client";

interface MatrixGridProps {
  matrix: number[][];
  editable?: boolean;
  onChange?: (matrix: number[][]) => void;
}

export default function MatrixGrid({ matrix, editable = false, onChange }: MatrixGridProps) {
  const handleChange = (row: number, col: number, value: string) => {
    if (!onChange) return;
    const num = Number(value);
    if (Number.isNaN(num)) return;
    const updated = matrix.map((r) => [...r]);
    updated[row][col] = num;
    onChange(updated);
  };

  if (!matrix.length) return null;

  return (
    <div className="inline-block">
      {matrix.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`flex h-12 w-12 items-center justify-center border border-gray-200 text-sm font-mono ${
                editable
                  ? "cursor-pointer bg-white hover:bg-gray-50 focus-within:bg-gray-100"
                  : "bg-gray-50"
              }`}
            >
              {editable ? (
                <input
                  type="number"
                  value={cell}
                  onChange={(e) => handleChange(ri, ci, e.target.value)}
                  className="h-full w-full bg-transparent text-center outline-none"
                />
              ) : (
                <span>{cell}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
