import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

// const zoneId = '98dc9cee-87f8-11f0-9b37-0242ac110002';






// const branchId = '00000000-0000-0000-0000-000000000001'; // chi nhánh tổng
// const departmentId = '00000000-0000-0000-0000-000000000001'; //General
// const organizationIds = ['00000000-0000-0000-0000-000000000001']; // ORG001
// const branchIds = ['00000000-0000-0000-0000-000000000001']; // chi nhánh tổng
// const departmentIds = ['00000000-0000-0000-0000-000000000001']; //General



// const branchId = '5bd05a92-9922-11f0-b711-0242ac110002'; // chi nhánh tổng
// const departmentId = '6fa06ac3-99f6-11f0-9f9a-0242ac110002'; //General
// const organizationIds = ['8c385096-87f6-11f0-9b37-0242ac110002']; // ORG001
// const branchIds = ['5bd05a92-9922-11f0-b711-0242ac110002']; // chi nhánh tổng
// const departmentIds = ['6fa06ac3-99f6-11f0-9f9a-0242ac110002']; //General


// const useAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   const header = useSelector((state: RootState) => state.header);
//   console.log('Header from Redux store in getAuthHeaders:', header);

//   return {
//     "Content-Type": "application/json;charset=utf-8",
//     Authorization: `Bearer ${token}`,
//     branchId: header.branchId,
//     departmentId: header.departmentId,
//     organizationIds: header.organizationIds,
//     branchIds: header.branchIds,
//     departmentIds: header.departmentIds,
//   };
// };

// export default useAuthHeaders;


// getAuthHeaders.ts
import { store } from '../../app/store';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const header = store.getState().header;

  return {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${token}`,
    branchId: header.branchId,
    departmentId: header.departmentId,
    organizationIds: header.organizationIds,
    branchIds: header.branchIds,
    departmentIds: header.departmentIds,
  };
};

export default getAuthHeaders;
