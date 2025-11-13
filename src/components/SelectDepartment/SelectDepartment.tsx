// import { useDispatch, useSelector } from 'react-redux';
// import { setUser } from '../../features/userSlice';
// import { setHeader } from '../../features/headerSlice';
// import type { RootState } from '../../app/store';
// import { useEffect, useState } from 'react';
// import { getData } from '../../utils/axios/index';

// function SelectDepartment() {

//   const user = useSelector((state: RootState) => state.user);
//   console.log('User from Redux store:', user);
//   const urlGetOrganizations = 'http://localhost:3000/auth/organization/list';
//   const urlGetBranches = 'http://localhost:3000/auth/branch/setting/list';
//   const urlGetDepartments = 'http://localhost:3000/auth/department/setting/list';


//   const [organizations, setOrganizations] = useState<object[]>([]);
//   const [branchId, setBranchId] = useState<string | null>(null);
//   const [branchIds, setBranchIds] = useState<object[]>([]);
//   const [departmentId, setDepartmentId] = useState<string | null>(null);
//   const [departmentIds, setDepartmentIds] = useState<object[]>([]);

//   useEffect(() => {
//           const handleGetList = async () => {
//               let result = await getData({ url: urlGetOrganizations });
//               if (result.data) {
//                 setOrganizations(result.data);
//               }
//               result = await getData({ url: urlGetBranches });
//               if (result.data) {
//                 setBranchIds(result.data);
//               }
//               result = await getData({ url: urlGetDepartments });
//               if (result.data) {
//                 setDepartmentIds(result.data);
//               }
//           };
//           handleGetList();
//   }, []);




//   return (
//     <div>
//       <button onClick={() => { console.log('User from Redux store:', user); }}>user</button>
//     </div>
//   );
// }

// export default SelectDepartment;



import { useEffect, useState } from 'react';
import { getData } from '../../utils/axios/index';
import type { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader } from '../../redux/slice/headerSlice';
import { useNavigate } from 'react-router-dom';

function SelectDepartment() {
  const myState = useSelector((state: RootState) => state);
  console.log('User from Redux store:', myState);

  const urlGetOrganizations = 'http://localhost:3000/auth/organization/list';
  const urlGetBranches = 'http://localhost:3000/auth/branch/setting/list';
  const urlGetDepartments = 'http://localhost:3000/auth/department/setting/list';

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [branchIds, setBranchIds] = useState<any[]>([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [departmentIds, setDepartmentIds] = useState<any[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);

  useEffect(() => {
    const handleGetList = async () => {
      let result = await getData({ url: urlGetOrganizations });
      if (result.data) setOrganizations(result.data);

      result = await getData({ url: urlGetBranches });
      if (result.data) setBranchIds(result.data);

      result = await getData({ url: urlGetDepartments });
      if (result.data) setDepartmentIds(result.data);
    };
    handleGetList();
  }, []);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const getInfoHeader = () => {
    dispatch(setHeader({
      branchId: branchId,
      departmentId: departmentId,
      branchIds: selectedBranchIds,
      departmentIds: selectedDepartmentIds,
    }));
    navigate('/');
  };

  const handleBranchSelection = (id: string) => {
    setSelectedBranchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDepartmentSelection = (id: string) => {
    setSelectedDepartmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chọn thông tin tổ chức và phòng ban</h2>

      {/* Tổ chức */}
      <label>Organization:</label>
      <select>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>

      {/* Chi nhánh đơn */}
      <label>Branch:</label>
      <select value={branchId ?? ''} onChange={(e) => setBranchId(e.target.value)}>
        <option value="">-- Chọn chi nhánh --</option>
        {branchIds.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>

      {/* Chọn nhiều chi nhánh */}
      <label>All Branches:</label>
      <div>
        {branchIds.map((branch) => (
          <div key={branch.id}>
            <input
              type="checkbox"
              checked={selectedBranchIds.includes(branch.id)}
              onChange={() => handleBranchSelection(branch.id)}
            />
            <span>{branch.name}</span>
          </div>
        ))}
      </div>

      {/* Phòng ban đơn */}
      <label>Department:</label>
      <select value={departmentId ?? ''} onChange={(e) => setDepartmentId(e.target.value)}>
        <option value="">-- Chọn phòng ban --</option>
        {departmentIds.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      {/* Chọn nhiều phòng ban */}
      <label>All Departments:</label>
      <div>
        {departmentIds.map((dept) => (
          <div key={dept.id}>
            <input
              type="checkbox"
              checked={selectedDepartmentIds.includes(dept.id)}
              onChange={() => handleDepartmentSelection(dept.id)}
            />
            <span>{dept.name}</span>
          </div>
        ))}
      </div>

      <button
        onClick={getInfoHeader}
        style={{ marginTop: '20px' }}
      >
        Lưu thông tin
      </button>
    </div>
  );
}

export default SelectDepartment;

