import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CreateHousingModal, {
  type HousingAddress,
} from "../components/CreateHousing/CreateHousingModal";
import ConfirmHousingAddressModal from "../components/CreateHousing/ConfirmHousingAddressModal";
import { useHousingRegistration } from "../components/CreateHousing/HousingRegistrationContext";

import useLocalizedNavigate from "../hooks/useLocalizedNavigate";
import useLocalizedPath from "../hooks/useLocalizedPath";

const CreateHousingPage = () => {
  const { t } = useTranslation();
  const localizedNavigate = useLocalizedNavigate();
  const localizedPath = useLocalizedPath();
  const { updateData } = useHousingRegistration();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [address, setAddress] = useState<HousingAddress | null>(null);

  const handleContinue = () => {
    if (!address) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAddress = () => {
    if (!address) return;

    updateData({ address });
    setIsConfirmModalOpen(false);
    localizedNavigate("/housing/register");
  };

  const formattedAddress = address
    ? [
        address.street,
        address.apartment
          ? `${t("createHousing.address.apartmentShort")} ${address.apartment}`
          : null,
        address.city,
        address.region,
        address.postalCode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto grid min-h-[650px] max-w-[1440px] grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-2 lg:px-16 xl:px-24">
          <section className="flex h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0">
              <Link to={localizedPath()} className="inline-flex items-center">
                <img
                  src="/images/logos/MiniLogo_WayGo.png"
                  alt="WayGo"
                  className="mb-14 h-[50px] w-[50px] object-contain"
                />
              </Link>

              <h1 className="max-w-[542px] text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] text-black sm:text-[44px] lg:text-[50px]">
                {t("createHousing.title")}
              </h1>

              <p className="mt-7 max-w-[500px] text-[16px] font-semibold leading-[1.35] text-[#616D75] sm:text-[18px] lg:text-[22px]">
                {t("createHousing.subtitle")}
              </p>

              <div className="mt-12 max-w-[500px]">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex h-[60px] w-full items-center gap-3 rounded-lg border border-[#7D8790] bg-white px-4 text-left transition hover:border-[#355872] hover:shadow-sm focus:border-[#355872] focus:outline-none focus:ring-2 focus:ring-[#355872]/15"
                >
                  <svg
                    className="h-5 w-5 shrink-0 text-[#3F4A52]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>

                  <span
                    className={`min-w-0 flex-1 truncate text-sm ${
                      address ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {address
                      ? formattedAddress
                      : t("createHousing.address.enterAddress")}
                  </span>
                </button>

                {address && (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="mt-4 w-full rounded-lg bg-[#355872] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#2d4b62]"
                  >
                    {t("common.next")}
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-[691px] overflow-hidden rounded-[20px]">
              <img
                src="/images/items/housing_registration.png"
                alt={t("createHousing.imageAlt")}
                className="aspect-[691/603] w-full object-cover"
              />
            </div>
          </section>
        </div>
      </main>

      <CreateHousingModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={(newAddress) => {
          setAddress(newAddress);
          setIsAddressModalOpen(false);
        }}
      />

      <ConfirmHousingAddressModal
        isOpen={isConfirmModalOpen}
        address={formattedAddress}
        onEdit={() => {
          setIsConfirmModalOpen(false);
          setIsAddressModalOpen(true);
        }}
        onConfirm={handleConfirmAddress}
      />
    </>
  );
};

export default CreateHousingPage;