import { Link } from "react-router-dom";
import SelectDepartment from "../../SelectDepartment/SelectDepartment";

const link: Record<string, string> = {
  home: "/",
  user: "/user",
  register: "/register",
  logout: "/logout",
  organization: "/organization",
  right: "/right",
  role: "/role",
  roleright: "/roleright",
  branch: "/branch",
  department: "/department",
  userdepartmentrole: "/userdepartmentrole",
  selectDepartment: "/select-department",
};



function Sidebar() {
  return (
    <div style={{ width: '200px', background: '#eee', padding: '1rem' }}>
      <ul>
        {Object.entries(link).map(([name, url]) => (
          <li key={name}>
            {/* <a href={url}>{name}</a> */}
            <Link to={url}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;