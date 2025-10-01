import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Login/Login';
import Loguot from './pages/Loguot/Loguot';
import NotFound from './pages/NotFound/NotFound';
import Register from './pages/Register/Register';
import User from './pages/User/User';
import Organization from './pages/Organization/Organization';
import Right from './pages/Right/Right';
import Role from './pages/Role/Role';
import RoleRight from './pages/RoleRight/RoleRight';
import Branch from './pages/Branch/Branch';
import Department from './pages/Department/Department';
import UserDepartmentRole from './pages/UserDepartmentRole/UserDepartmentRole';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route không dùng layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Loguot />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        {/* Route dùng layout chung */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="user" element={<User />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/right" element={<Right />} />
          <Route path="/role" element={<Role />} />
          <Route path="/roleright" element={<RoleRight />} />
          <Route path="/branch" element={<Branch />} />
          <Route path="/department" element={<Department />} />
          <Route path="/userdepartmentrole" element={<UserDepartmentRole />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

