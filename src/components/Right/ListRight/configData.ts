import EditForm from "../EditForm/EditForm";


const fullUrlList = {
  urlGetList: 'http://localhost:3000/auth/right/list',
  urlPutList: 'http://localhost:3000/auth/right/list',
  urlUpdate: "http://localhost:3000/auth/right/detail",

  urlGetPrintContent: "http://localhost:3000/template-contents/right/list",
  urlUpdatePrintDesign: "http://localhost:3000/template-contents/right/detail",
  urlDeletePrintDesign: "http://localhost:3000/template-contents/right/detail",
  urlInsertPrintDesign: "http://localhost:3000/template-contents/right/detail/insert",

  urlGetPrintContents: "http://localhost:3000/template-contents/rights/list",
  urlUpdatePrintDesigns: "http://localhost:3000/template-contents/rights/detail",
  urlDeletePrintDesigns: "http://localhost:3000/template-contents/rights/detail",
  urlInsertPrintDesigns: "http://localhost:3000/template-contents/rights/detail/insert",

}


const fullUrlListOwner = {
  urlGetList: 'http://localhost:3000/auth/right/owner/list',
  urlPutList: 'http://localhost:3000/auth/right/owner/list',
  urlUpdate: "http://localhost:3000/auth/right/owner/detail",

  urlGetPrintContent: "http://localhost:3000/template-contents/right-of-owner/list",
  urlUpdatePrintDesign: "http://localhost:3000/template-contents/right-of-owner/detail",
  urlDeletePrintDesign: "http://localhost:3000/template-contents/right-of-owner/detail",
  urlInsertPrintDesign: "http://localhost:3000/template-contents/right-of-owner/detail/insert",

  urlGetPrintContents: "http://localhost:3000/template-contents/rights-of-owner/list",
  urlUpdatePrintDesigns: "http://localhost:3000/template-contents/rights-of-owner/detail",
  urlDeletePrintDesigns: "http://localhost:3000/template-contents/rights-of-owner/detail",
  urlInsertPrintDesigns: "http://localhost:3000/template-contents/rights-of-owner/detail/insert",

}



const exportFileInfo = { name: "Right.xlsx", sheetName: "Sheet1", title: "Danh sách quyền", description: null }



export {
  EditForm,
  fullUrlList,
  fullUrlListOwner,
  exportFileInfo
}
