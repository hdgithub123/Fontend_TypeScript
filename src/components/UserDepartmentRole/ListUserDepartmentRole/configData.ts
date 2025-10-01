import AddFormDepartment from "../AddForm/AddForm";
import EditFormDepartment from "../EditForm/EditForm";



const fullUrlList = {
  urlGetList: 'http://localhost:3000/auth/user-department-role/list',
  urlDeleteList: 'http://localhost:3000/auth/user-department-role/list',
  urlPostList: 'http://localhost:3000/auth/user-department-role/list',
  urlPutList: 'http://localhost:3000/auth/user-department-role/list',
  urlCheck: 'http://localhost:3000/auth/user-department-role/check-user-department-role',
  urlUpdate: "http://localhost:3000/auth/user-department-role/detail",
  urlDelete: "http://localhost:3000/auth/user-department-role/detail",
  urlInsert: 'http://localhost:3000/auth/user-department-role/detail/insert',

  urlGetPrintContent: "http://localhost:3000/template-contents/user-department-role/list",
  urlUpdatePrintDesign: "http://localhost:3000/template-contents/user-department-role/detail",
  urlDeletePrintDesign: "http://localhost:3000/template-contents/user-department-role/detail",
  urlInsertPrintDesign: "http://localhost:3000/template-contents/user-department-role/detail/insert",

  urlGetPrintContents: "http://localhost:3000/template-contents/user-department-roles/list",
  urlUpdatePrintDesigns: "http://localhost:3000/template-contents/user-department-roles/detail",
  urlDeletePrintDesigns: "http://localhost:3000/template-contents/user-department-roles/detail",
  urlInsertPrintDesigns: "http://localhost:3000/template-contents/user-department-roles/detail/insert",

}

const exportFileInfo = { name: "Phan Quyền .xlsx", sheetName: "Sheet1", title: "Danh sách Phân Quyền", description: null }



export {
  AddFormDepartment,
  EditFormDepartment,
  fullUrlList,
  exportFileInfo,
}
