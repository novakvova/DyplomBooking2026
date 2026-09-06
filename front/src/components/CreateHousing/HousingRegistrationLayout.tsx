import type { ReactNode } from "react";

import useLocalizedNavigate from "../../hooks/useLocalizedNavigate";

interface HousingRegistrationLayoutProps {
  children: ReactNode;

  // Великий етап реєстрації: 1, 2 або 3
  step: 1 | 2 | 3;

  // Прогрес усередині поточного етапу: 0–100
  progress: number;

  onBack: () => void;
  onNext?: () => void;

  nextDisabled?: boolean;
  nextLabel?: string;
  showHelp?: boolean;
}

const HousingRegistrationLayout = ({
  children,
  step,
  progress,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Далі",
  showHelp = true,
}: HousingRegistrationLayoutProps) => {
  const navigate = useLocalizedNavigate();

  const safeProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  const getSegmentProgress = (
    segment: 1 | 2 | 3
  ) => {
    if (segment < step) return 100;
    if (segment > step) return 0;

    return safeProgress;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 py-5 sm:px-10 lg:px-16 xl:px-[86px]">
        {/* Верхня панель */}
        <header className="flex items-start justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="На головну WayGo"
            className="rounded-full transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#355F7D] focus-visible:ring-offset-2"
          >
            <img
              src="/images/logos/MiniLogo_WayGo.png"
              alt="WayGo"
              className="h-[42px] w-[42px] object-contain"
            />
          </button>

          {showHelp && (
            <button
              type="button"
              className="rounded-[7px] border border-[#61737F] px-4 py-2 text-[12px] font-medium text-[#2B3942] transition hover:bg-[#F5F7F8]"
            >
              Виникли запитання?
            </button>
          )}
        </header>

        {/* Контент */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-8">
          {children}
        </div>

        {/* Нижня навігація */}
        <footer className="mt-auto pb-2">
          <div className="grid grid-cols-3 gap-4">
            {([1, 2, 3] as const).map(
              (segment) => (
                <div
                  key={segment}
                  className="relative h-[4px] overflow-hidden bg-[#D9DDE0]"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-[#243C4E] transition-[width] duration-300"
                    style={{
                      width: `${getSegmentProgress(
                        segment
                      )}%`,
                    }}
                  />
                </div>
              )
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="min-h-[44px] px-8 text-[13px] font-medium text-[#616D75] transition hover:text-[#243C4E]"
            >
              Назад
            </button>

            {onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="min-h-[44px] min-w-[105px] rounded-[6px] bg-[#243C4E] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1D3241] disabled:cursor-not-allowed disabled:bg-[#AAB4BB]"
              >
                {nextLabel}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HousingRegistrationLayout;
