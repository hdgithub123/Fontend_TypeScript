import AddFormBranch from "../AddForm/AddForm";
import EditFormBranch from "../EditForm/EditForm";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

const fullUrlList = {
  urlGetList: `${backendEndpoint}/auth/branch/list`,
  urlDeleteList: `${backendEndpoint}/auth/branch/list`,
  urlPostList: `${backendEndpoint}/auth/branch/list`,
  urlPutList: `${backendEndpoint}/auth/branch/list`,
  urlCheck: `${backendEndpoint}/auth/branch/check-branch`,
  urlUpdate: `${backendEndpoint}/auth/branch/detail`,
  urlDelete: `${backendEndpoint}/auth/branch/detail`,
  urlInsert: `${backendEndpoint}/auth/branch/detail/insert`,

  urlGetPrintContent: `${backendEndpoint}/template-contents/branch/list`,
  urlUpdatePrintDesign: `${backendEndpoint}/template-contents/branch/detail`,
  urlDeletePrintDesign: `${backendEndpoint}/template-contents/branch/detail`,
  urlInsertPrintDesign: `${backendEndpoint}/template-contents/branch/detail/insert`,

  urlGetPrintContents: `${backendEndpoint}/template-contents/branches/list`,
  urlUpdatePrintDesigns: `${backendEndpoint}/template-contents/branches/detail`,
  urlDeletePrintDesigns: `${backendEndpoint}/template-contents/branches/detail`,
  urlInsertPrintDesigns: `${backendEndpoint}/template-contents/branches/detail/insert`,

}

const exportFileInfo = { name: "Branch.xlsx", sheetName: "Sheet1", title: "Danh sách chi nhánh", description: null }

const columnsShow = ['code', 'name', 'address', 'description', 'isActive', 'isIndependent']

export {
  AddFormBranch,
  EditFormBranch,
  fullUrlList,
  exportFileInfo,
  columnsShow,
}
