import AddFormOrganization from "../AddForm/AddForm";
import EditFormOrganization from "../EditForm/EditForm";


const fullUrlList = {
  urlGetList: 'http://localhost:3000/auth/organization/list',
  urlDeleteList: 'http://localhost:3000/auth/organization/list',
  urlPostList: 'http://localhost:3000/auth/organization/list',
  urlPutList: 'http://localhost:3000/auth/organization/list',
  urlCheck: 'http://localhost:3000/auth/organization/check-organization',
  urlUpdate: "http://localhost:3000/auth/organization/detail",
  urlDelete: "http://localhost:3000/auth/organization/detail",
  urlInsert: 'http://localhost:3000/auth/organization/detail/insert',

  urlGetPrintContent: "http://localhost:3000/template-contents/organization/list",
  urlUpdatePrintDesign: "http://localhost:3000/template-contents/organization/detail",
  urlDeletePrintDesign: "http://localhost:3000/template-contents/organization/detail",
  urlInsertPrintDesign: "http://localhost:3000/template-contents/organization/detail/insert",

  urlGetPrintContents: "http://localhost:3000/template-contents/organizations/list",
  urlUpdatePrintDesigns: "http://localhost:3000/template-contents/organizations/detail",
  urlDeletePrintDesigns: "http://localhost:3000/template-contents/organizations/detail",
  urlInsertPrintDesigns: "http://localhost:3000/template-contents/organizations/detail/insert",

}

const exportFileInfo = { name: "Organization.xlsx", sheetName: "Sheet1", title: "Danh sách tổ chức", description: null }



export {
  AddFormOrganization,
  EditFormOrganization,
  fullUrlList,
  exportFileInfo
}
