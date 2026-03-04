import AddFormOrganization from "../AddForm/AddForm";
import EditFormOrganization from "../EditForm/EditForm";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

const fullUrlList = {
  urlGetList: `${backendEndpoint}/auth/organization/list`,
  urlDeleteList: `${backendEndpoint}/auth/organization/list`,
  urlPostList: `${backendEndpoint}/auth/organization/list`,
  urlPutList: `${backendEndpoint}/auth/organization/list`,
  urlCheck: `${backendEndpoint}/auth/organization/check-organization`,
  urlUpdate: `${backendEndpoint}/auth/organization/detail`,
  urlDelete: `${backendEndpoint}/auth/organization/detail`,
  urlInsert: `${backendEndpoint}/auth/organization/detail/insert`,

  urlGetPrintContent: `${backendEndpoint}/template-contents/organization/list`,
  urlUpdatePrintDesign: `${backendEndpoint}/template-contents/organization/detail`,
  urlDeletePrintDesign: `${backendEndpoint}/template-contents/organization/detail`,
  urlInsertPrintDesign: `${backendEndpoint}/template-contents/organization/detail/insert`,

  urlGetPrintContents: `${backendEndpoint}/template-contents/organizations/list`,
  urlUpdatePrintDesigns: `${backendEndpoint}/template-contents/organizations/detail`,
  urlDeletePrintDesigns: `${backendEndpoint}/template-contents/organizations/detail`,
  urlInsertPrintDesigns: `${backendEndpoint}/template-contents/organizations/detail/insert`,

}

const exportFileInfo = { name: "Organization.xlsx", sheetName: "Sheet1", title: "Danh sách tổ chức", description: null }

const columnsShow: string[] = []

export {
  AddFormOrganization,
  EditFormOrganization,
  fullUrlList,
  exportFileInfo,
  columnsShow,
}
