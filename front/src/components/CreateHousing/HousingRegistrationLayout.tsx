import type { ReactNode } from "react";

interface HousingRegistrationLayoutProps {
  children: ReactNode;
  progress: number;
  onBack: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showHelp?: boolean;
}

const HousingRegistrationLayout = ({
  children,
  progress,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Далі",
  showHelp = true,
}: HousingRegistrationLayoutProps) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const segmentProgress = (segment: number) => {
    const segmentStart = segment * (100 / 3);
    const segmentEnd = (segment + 1) * (100 / 3);

    if (safeProgress <= segmentStart) return 0;
    if (safeProgress >= segmentEnd) return 100;

    return ((safeProgress - segmentStart) / (segmentEnd - segmentStart)) * 100;
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-[650px] max-w-[1440px] flex-col px-6 py-8 lg:px-16 xl:px-24">
        <div className="flex items-start justify-between">
          <img
            src="/images/logos/MiniLogo_WayGo.png"
            alt="WayGo"
            className="h-10 w-10 object-contain"
          />

          {showHelp && (
            <button
              type="button"
              className="rounded-lg border border-[#616D75] px-4 py-2 text-xs font-medium text-[#29353B] transition hover:bg-slate-50"
            >
              Виникли запитання?
            </button>
          )}
        </div>

        <div className="flex flex-1 justify-center py-8">
          {children}
        </div>

        <div className="pb-6">
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((segment) => (
              <div
                key={segment}
                className="relative h-1 overflow-hidden bg-[#D9DDE0]"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[#243C4E] transition-all duration-300"
                  style={{ width: `${segmentProgress(segment)}%` }}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 text-sm font-medium text-[#616D75] transition hover:text-black"
            >
              Назад
            </button>

            {onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="min-w-[105px] rounded-[6px] bg-[#243C4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3241] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HousingRegistrationLayout;