import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/Header/Header";
import WayGoPlane from "../components/FlyingPlane/WayGoPlane";
import { PlaneProvider} from "../hooks/usePlaneContext";

const Layout = () => {
  const { pathname } = useLocation();

  const hideHeader =
    /^\/[^/]+\/housing\/(create|register)(\/|$)/.test(pathname) ||
    /^\/housing\/(create|register)(\/|$)/.test(pathname);

  return (
    <PlaneProvider>
      <div className="min-h-screen bg-gray-50">

        <WayGoPlane /> 

        {!hideHeader && <Header />}

        <main>
          <Outlet />
        </main>
      </div>
    </PlaneProvider>
  );
};

export default Layout;
