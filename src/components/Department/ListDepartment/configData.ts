import AddFormDepartment from "../AddForm/AddForm";
import EditFormDepartment from "../EditForm/EditForm";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

const fullUrlList = {
  urlGetList: `${backendEndpoint}/auth/department/list`,
  urlDeleteList: `${backendEndpoint}/auth/department/list`,
  urlPostList: `${backendEndpoint}/auth/department/list/code`,
  urlPutList: `${backendEndpoint}/auth/department/list/code`,
  urlCheck: `${backendEndpoint}/auth/department/check-department`,
  urlUpdate: `${backendEndpoint}/auth/department/detail`,
  urlDelete: `${backendEndpoint}/auth/department/detail`,
  urlInsert: `${backendEndpoint}/auth/department/detail/insert`,

  urlGetPrintContent: `${backendEndpoint}/template-contents/department/list`,
  urlUpdatePrintDesign: `${backendEndpoint}/template-contents/department/detail`,
  urlDeletePrintDesign: `${backendEndpoint}/template-contents/department/detail`,
  urlInsertPrintDesign: `${backendEndpoint}/template-contents/department/detail/insert`,

  urlGetPrintContents: `${backendEndpoint}/template-contents/departments/list`,
  urlUpdatePrintDesigns: `${backendEndpoint}/template-contents/departments/detail`,
  urlDeletePrintDesigns: `${backendEndpoint}/template-contents/departments/detail`,
  urlInsertPrintDesigns: `${backendEndpoint}/template-contents/departments/detail/insert`,

}

const exportFileInfo = { name: "Department.xlsx", sheetName: "Sheet1", title: "Danh sách khu vực", description: null }

const columnsShow = ['code', 'name', 'address', 'description', 'isActive','parentId'];

export {
  AddFormDepartment,
  EditFormDepartment,
  fullUrlList,
  exportFileInfo,
  columnsShow,
}
