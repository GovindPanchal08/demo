import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
// import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/User/UserProfiles";
import Calendar from "./pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Blank from "./pages/Blank";
import VisitForm from "./pages/VisitSchedule/VisitScheduling";
import Home from "./pages/Dashboard/Home";
import { FacilityManagement } from "./pages/Facility/FacilityManagement";
import { AuthProvider } from "./context/AuthContext";
import Menu from "./pages/Menu/Menu";
import Role from "./pages/Role/Role";
import RoleAssign from "./pages/RoleAssign/roleAssign";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/visit-scheduling" element={<VisitForm />} />
              <Route path="/facility" element={<FacilityManagement />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/role-permission" element={<Blank />} />
              <Route path="/visitors" element={<Calendar />} />
              <Route path="/setting" element={<Blank />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/role" element={<Role />} />
              <Route path="/role-assign" element={<RoleAssign />} />
            </Route>

            <Route path="/signin" element={<SignIn />} />

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
