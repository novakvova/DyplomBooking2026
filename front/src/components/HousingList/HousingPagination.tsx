import type { ReactNode } from "react";

interface HousingPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  pageNumbers: (number | "...")[];
  onPageChange: (page: number) => void;
}

const HousingPagination = ({
  page,
  pageSize,
  totalItems,
  totalPages,
  pageNumbers,
  onPageChange,
}: HousingPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex flex-col items-center gap-3">
      <p className="text-sm text-slate-500">
        Показано {(page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, totalItems)} з {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <PaginationButton
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          ‹
        </PaginationButton>

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span
              key={`dots-${index}`}
              className="flex h-9 w-9 items-center justify-center text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                page === pageNumber
                  ? "bg-[#355F7D] text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}

        <PaginationButton
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(Math.min(totalPages, page + 1))
          }
        >
          ›
        </PaginationButton>
      </div>
    </div>
  );
};

const PaginationButton = ({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30"
  >
    {children}
  </button>
);

export default HousingPagination;
