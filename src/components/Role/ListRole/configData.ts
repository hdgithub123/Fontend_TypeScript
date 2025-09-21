import AddFormRole from "../AddForm/AddForm";
import EditFormRole from "../EditForm/EditForm";


const fullUrlList = {
  urlGetList: 'http://localhost:3000/auth/role/list',
  urlDeleteList: 'http://localhost:3000/auth/role/list',
  urlPostList: 'http://localhost:3000/auth/role/list',
  urlPutList: 'http://localhost:3000/auth/role/list',
  urlCheck: 'http://localhost:3000/auth/role/check-role',
  urlUpdate: "http://localhost:3000/auth/role/detail",
  urlDelete: "http://localhost:3000/auth/role/detail",
  urlInsert: 'http://localhost:3000/auth/role/detail/insert',

  urlGetPrintContent: "http://localhost:3000/template-contents/role/list",
  urlUpdatePrintDesign: "http://localhost:3000/template-contents/role/detail",
  urlDeletePrintDesign: "http://localhost:3000/template-contents/role/detail",
  urlInsertPrintDesign: "http://localhost:3000/template-contents/role/detail/insert",

  urlGetPrintContents: "http://localhost:3000/template-contents/roles/list",
  urlUpdatePrintDesigns: "http://localhost:3000/template-contents/roles/detail",
  urlDeletePrintDesigns: "http://localhost:3000/template-contents/roles/detail",
  urlInsertPrintDesigns: "http://localhost:3000/template-contents/roles/detail/insert",

}

const exportFileInfo = { name: "Role.xlsx", sheetName: "Sheet1", title: "Danh sách vai trò", description: null }



export {
  AddFormRole,
  EditFormRole,
  fullUrlList,
  exportFileInfo
}
