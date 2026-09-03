import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const AppLayout = () => {
  return (
    <>
      <AppHeader />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;