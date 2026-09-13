import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/Header/Header";

const Layout = () => {
  const { pathname } = useLocation();

  const hideHeader =
    /^\/[^/]+\/housing\/(create|register)(\/|$)/.test(pathname) ||
    /^\/housing\/(create|register)(\/|$)/.test(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
