import AddFormRole from "../AddForm/AddForm";
import EditFormRole from "../EditForm/EditForm";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

const fullUrlList = {
  urlGetList: `${backendEndpoint}/auth/role/list`,
  urlDeleteList: `${backendEndpoint}/auth/role/list`,
  urlPostList: `${backendEndpoint}/auth/role/list`,
  urlPutList: `${backendEndpoint}/auth/role/list`,
  urlCheck: `${backendEndpoint}/auth/role/check-role`,
  urlUpdate: `${backendEndpoint}/auth/role/detail`,
  urlDelete: `${backendEndpoint}/auth/role/detail`,
  urlInsert: `${backendEndpoint}/auth/role/detail/insert`,

  urlGetPrintContent: `${backendEndpoint}/template-contents/role/list`,
  urlUpdatePrintDesign: `${backendEndpoint}/template-contents/role/detail`,
  urlDeletePrintDesign: `${backendEndpoint}/template-contents/role/detail`,
  urlInsertPrintDesign: `${backendEndpoint}/template-contents/role/detail/insert`,

  urlGetPrintContents: `${backendEndpoint}/template-contents/roles/list`,
  urlUpdatePrintDesigns: `${backendEndpoint}/template-contents/roles/detail`,
  urlDeletePrintDesigns: `${backendEndpoint}/template-contents/roles/detail`,
  urlInsertPrintDesigns: `${backendEndpoint}/template-contents/roles/detail/insert`,

}

const exportFileInfo = { name: "Role.xlsx", sheetName: "Sheet1", title: "Danh sách vai trò", description: null }

const columnsShow: string[] = []

export {
  AddFormRole,
  EditFormRole,
  fullUrlList,
  exportFileInfo,
  columnsShow,
}
