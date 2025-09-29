import AddFormDepartment from "../AddForm/AddForm";
import EditFormDepartment from "../EditForm/EditForm";


const fullUrlList = {
  urlGetList: 'http://localhost:3000/auth/department/list',
  urlDeleteList: 'http://localhost:3000/auth/department/list',
  urlPostList: 'http://localhost:3000/auth/department/list/code',
  urlPutList: 'http://localhost:3000/auth/department/list/code',
  urlCheck: 'http://localhost:3000/auth/department/check-department',
  urlUpdate: "http://localhost:3000/auth/department/detail",
  urlDelete: "http://localhost:3000/auth/department/detail",
  urlInsert: 'http://localhost:3000/auth/department/detail/insert',

  urlGetPrintContent: "http://localhost:3000/template-contents/department/list",
  urlUpdatePrintDesign: "http://localhost:3000/template-contents/department/detail",
  urlDeletePrintDesign: "http://localhost:3000/template-contents/department/detail",
  urlInsertPrintDesign: "http://localhost:3000/template-contents/department/detail/insert",

  urlGetPrintContents: "http://localhost:3000/template-contents/departments/list",
  urlUpdatePrintDesigns: "http://localhost:3000/template-contents/departments/detail",
  urlDeletePrintDesigns: "http://localhost:3000/template-contents/departments/detail",
  urlInsertPrintDesigns: "http://localhost:3000/template-contents/departments/detail/insert",

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
