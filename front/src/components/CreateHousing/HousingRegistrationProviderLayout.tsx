import { Outlet } from "react-router-dom";

import { HousingRegistrationProvider } from "./HousingRegistrationContext";

const HousingRegistrationProviderLayout = () => {
  return (
    <HousingRegistrationProvider>
      <Outlet />
    </HousingRegistrationProvider>
  );
};

export default HousingRegistrationProviderLayout;