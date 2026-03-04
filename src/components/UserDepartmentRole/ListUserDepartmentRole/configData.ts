import AddFormDepartment from "../AddForm/AddForm";
import EditFormDepartment from "../EditForm/EditForm";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;


const fullUrlList = {
  urlGetList: `${backendEndpoint}/auth/user-department-role/list`,
  urlDeleteList: `${backendEndpoint}/auth/user-department-role/list`,
  urlPostList: `${backendEndpoint}/auth/user-department-role/list`,
  urlPutList: `${backendEndpoint}/auth/user-department-role/list`,
  urlCheck: `${backendEndpoint}/auth/user-department-role/check-user-department-role`,
  urlUpdate: `${backendEndpoint}/auth/user-department-role/detail`,
  urlDelete: `${backendEndpoint}/auth/user-department-role/detail`,
  urlInsert: `${backendEndpoint}/auth/user-department-role/detail/insert`,

  urlGetPrintContent: `${backendEndpoint}/template-contents/user-department-role/list`,
  urlUpdatePrintDesign: `${backendEndpoint}/template-contents/user-department-role/detail`,
  urlDeletePrintDesign: `${backendEndpoint}/template-contents/user-department-role/detail`,
  urlInsertPrintDesign: `${backendEndpoint}/template-contents/user-department-role/detail/insert`,

  urlGetPrintContents: `${backendEndpoint}/template-contents/user-department-roles/list`,
  urlUpdatePrintDesigns: `${backendEndpoint}/template-contents/user-department-roles/detail`,
  urlDeletePrintDesigns: `${backendEndpoint}/template-contents/user-department-roles/detail`,
  urlInsertPrintDesigns: `${backendEndpoint}/template-contents/user-department-roles/detail/insert`,

}

const exportFileInfo = { name: "Phan Quyền .xlsx", sheetName: "Sheet1", title: "Danh sách Phân Quyền", description: null }



export {
  AddFormDepartment,
  EditFormDepartment,
  fullUrlList,
  exportFileInfo,
}
