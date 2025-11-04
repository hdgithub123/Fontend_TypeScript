const zoneId = '98dc9cee-87f8-11f0-9b37-0242ac110002';
const organizationId = '8c385096-87f6-11f0-9b37-0242ac110002'; // ORG001
const branchId = '5bd05a92-9922-11f0-b711-0242ac110002'; // chi nhánh tổng
const departmentId = '6fa06ac3-99f6-11f0-9f9a-0242ac110002'; //General


const organizationIds = ['8c385096-87f6-11f0-9b37-0242ac110002']; // ORG001
const branchIds = ['5bd05a92-9922-11f0-b711-0242ac110002']; // chi nhánh tổng
// const departmentIds = ['6fa06ac3-99f6-11f0-9f9a-0242ac110002','51f2c88e-99f6-11f0-9f9a-0242ac110002']; //General
const departmentIds = ['6fa06ac3-99f6-11f0-9f9a-0242ac110002']; //General


// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return {
//     "Content-Type": "application/json;charset=utf-8",
//     Authorization: `Bearer ${token}`,
//     zone: zoneId,
//     is_child_zone: true
//   };
// };

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${token}`,
    branchId: branchId,
    departmentId: departmentId,
    organizationId: organizationId,
    organizationIds: organizationIds,
    branchIds: branchIds,
    departmentIds: departmentIds,
  };
};

export default getAuthHeaders;