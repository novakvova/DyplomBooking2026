import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocalizedPath from "../../hooks/useLocalizedPath";

interface FooterProps {
  variant?: "full" | "compact";
}

const Footer = ({ variant = "full" }: FooterProps) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const isCompact = variant === "compact";

  const generalLinks = [
    "about",
    "howWeWork",
    "sustainability",
    "careers",
    "investors",
    "corporateContacts",
    "contentFeedback",
  ];

  const policyLinks = [
    "privacy",
    "terms",
    "accessibility",
    "disputeResolution",
    "modernSlavery",
    "humanRights",
  ];

  const otherLinks = ["carRental", "loyalty", "hotels", "seasonalOffers"];
  const supportLinks = ["manageTrips", "contact", "safety"];

  return (
    <footer
      className={`bg-[#385b75] text-white ${
        isCompact ? "px-[130px] py-[30px]" : "px-10 py-16"
      }`}
    >
      {!isCompact && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
          {/* General information */}
          <div>
            <h3 className="mb-5 text-lg font-bold">{t("footer.general.title")}</h3>

            <ul className="space-y-3 text-sm text-white/90">
              {generalLinks.map((key) => (
                <li key={key}>
                  <Link
                    to={localizedPath()}
                    className="transition hover:text-white"
                  >
                    {t(`footer.general.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="mb-5 text-lg font-bold">{t("footer.policies.title")}</h3>

            <ul className="space-y-3 text-sm text-white/90">
              {policyLinks.map((key) => (
                <li key={key}>
                  <Link
                    to={localizedPath()}
                    className="transition hover:text-white"
                  >
                    {t(`footer.policies.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other */}
          <div>
            <h3 className="mb-5 text-lg font-bold">{t("footer.other.title")}</h3>

            <ul className="space-y-3 text-sm text-white/90">
              {otherLinks.map((key) => (
                <li key={key}>
                  <Link
                    to={localizedPath()}
                    className="transition hover:text-white"
                  >
                    {t(`footer.other.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-lg font-bold">{t("footer.support.title")}</h3>

            <ul className="space-y-3 text-sm text-white/90">
              {supportLinks.map((key) => (
                <li key={key}>
                  <Link
                    to={localizedPath()}
                    className="transition hover:text-white"
                  >
                    {t(`footer.support.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-5">
              <img
                src="/images/fb-logo.svg"
                alt="Facebook"
                className="h-6 w-6 cursor-pointer transition hover:opacity-80"
              />

              <img
                src="/images/instagram-logo.svg"
                alt="Instagram"
                className="h-6 w-6 cursor-pointer transition hover:opacity-80"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div
        className={`mx-auto border-t border-white/80 text-center text-xs text-white/90 ${
          isCompact ? "max-w-none pt-3" : "mt-14 max-w-5xl pt-6"
        }`}
      >
        <p>{t("footer.bottom.copyright")}</p>
        <p className={isCompact ? "mt-1" : "mt-2"}>
          {t("footer.bottom.company")}
        </p>
      </div>
    </footer>
  );
};
/* <Footer variant="compact" /> */
/* <Footer /> */
export default Footer;