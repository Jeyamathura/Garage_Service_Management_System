import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
export default MainLayout;