import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HousingRegistrationPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const handleContinue = () => {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) return;

    navigate("/housing/register/details", {
      state: {
        address: trimmedAddress,
      },
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <div
        className="
          mx-auto
          grid
          min-h-[650px]
          max-w-[1440px]
          grid-cols-1
          items-center
          gap-12
          px-6
          py-10
          lg:grid-cols-2
          lg:px-16
          xl:px-24
        "
      >
        {/* LEFT */}
        <section className="flex h-full flex-col justify-center">
          <div className="mx-auto w-full max-w-[560px] lg:mx-0">

            {/* Mini logo */}
            <img
              src="/images/logos/MiniLogo_WayGo.png"
              alt="WayGo"
              className="mb-14 h-[50px] w-[50px] object-contain"
            />

            {/* Title */}
            <h1
              className="
                max-w-[542px]
                text-[38px]
                font-semibold
                leading-[1.08]
                tracking-[-0.02em]
                text-black
                sm:text-[44px]
                lg:text-[50px]
              "
            >
              Налаштуйте
              <br />
              оголошення WayGo
            </h1>

            {/* Subtitle */}
            <p
              className="
                mt-7
                max-w-[500px]
                text-[16px]
                font-semibold
                leading-[1.35]
                text-[#616D75]
                sm:text-[18px]
                lg:text-[22px]
              "
            >
              Створити вдале оголошення дуже просто —
              <br className="hidden sm:block" />
              почнімо з вашої адреси.
            </p>

            {/* Address */}
            <div className="mt-12 max-w-[500px]">
              <div
                className="
                  flex
                  h-[60px]
                  items-center
                  rounded-lg
                  border
                  border-[#7D8790]
                  bg-white
                  px-4
                  transition
                  focus-within:border-[#355872]
                  focus-within:ring-2
                  focus-within:ring-[#355872]/15
                "
              >
                {/* Search icon */}
                <svg
                  className="mr-3 h-5 w-5 shrink-0 text-[#3F4A52]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleContinue();
                    }
                  }}
                  placeholder="Введіть свою адресу"
                  className="
                    h-full
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    text-slate-800
                    outline-none
                    placeholder:text-[#6D7680]
                  "
                />

                {address.trim() && (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="
                      ml-3
                      rounded-lg
                      bg-[#355872]
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-[#2d4b62]
                    "
                  >
                    Далі
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-[691px] overflow-hidden rounded-[20px]">
            <img
              src="/images/items/housing_registration.png"
              alt="Реєстрація житла WayGo"
              className="aspect-[691/603] w-full object-cover"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default HousingRegistrationPage;