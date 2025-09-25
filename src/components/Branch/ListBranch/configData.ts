import AddFormBranch from "../AddForm/AddForm";
import EditFormBranch from "../EditForm/EditForm";


const fullUrlList = {
  urlGetList: 'http://localhost:3000/auth/branch/list',
  urlDeleteList: 'http://localhost:3000/auth/branch/list',
  urlPostList: 'http://localhost:3000/auth/branch/list',
  urlPutList: 'http://localhost:3000/auth/branch/list',
  urlCheck: 'http://localhost:3000/auth/branch/check-branch',
  urlUpdate: "http://localhost:3000/auth/branch/detail",
  urlDelete: "http://localhost:3000/auth/branch/detail",
  urlInsert: 'http://localhost:3000/auth/branch/detail/insert',

  urlGetPrintContent: "http://localhost:3000/template-contents/branch/list",
  urlUpdatePrintDesign: "http://localhost:3000/template-contents/branch/detail",
  urlDeletePrintDesign: "http://localhost:3000/template-contents/branch/detail",
  urlInsertPrintDesign: "http://localhost:3000/template-contents/branch/detail/insert",

  urlGetPrintContents: "http://localhost:3000/template-contents/branches/list",
  urlUpdatePrintDesigns: "http://localhost:3000/template-contents/branches/detail",
  urlDeletePrintDesigns: "http://localhost:3000/template-contents/branches/detail",
  urlInsertPrintDesigns: "http://localhost:3000/template-contents/branches/detail/insert",

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
