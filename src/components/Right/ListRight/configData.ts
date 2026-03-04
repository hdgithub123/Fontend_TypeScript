import EditForm from "../EditForm/EditForm";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

const fullUrlList = {
  urlGetList: `${backendEndpoint}/auth/right/list`,
  urlPutList: `${backendEndpoint}/auth/right/list`,
  urlUpdate: `${backendEndpoint}/auth/right/detail`,

  urlGetPrintContent: `${backendEndpoint}/template-contents/right/list`,
  urlUpdatePrintDesign: `${backendEndpoint}/template-contents/right/detail`,
  urlDeletePrintDesign: `${backendEndpoint}/template-contents/right/detail`,
  urlInsertPrintDesign: `${backendEndpoint}/template-contents/right/detail/insert`,

  urlGetPrintContents: `${backendEndpoint}/template-contents/rights/list`,
  urlUpdatePrintDesigns: `${backendEndpoint}/template-contents/rights/detail`,
  urlDeletePrintDesigns: `${backendEndpoint}/template-contents/rights/detail`,
  urlInsertPrintDesigns: `${backendEndpoint}/template-contents/rights/detail/insert`,

}


const fullUrlListOwner = {
  urlGetList: `${backendEndpoint}/auth/right/owner/list`,
  urlPutList: `${backendEndpoint}/auth/right/owner/list`,
  urlUpdate: `${backendEndpoint}/auth/right/owner/detail`,

  urlGetPrintContent: `${backendEndpoint}/template-contents/right-of-owner/list`,
  urlUpdatePrintDesign: `${backendEndpoint}/template-contents/right-of-owner/detail`,
  urlDeletePrintDesign: `${backendEndpoint}/template-contents/right-of-owner/detail`,
  urlInsertPrintDesign: `${backendEndpoint}/template-contents/right-of-owner/detail/insert`,

  urlGetPrintContents: `${backendEndpoint}/template-contents/rights-of-owner/list`,
  urlUpdatePrintDesigns: `${backendEndpoint}/template-contents/rights-of-owner/detail`,
  urlDeletePrintDesigns: `${backendEndpoint}/template-contents/rights-of-owner/detail`,
  urlInsertPrintDesigns: `${backendEndpoint}/template-contents/rights-of-owner/detail/insert`,

}



const exportFileInfo = { name: "Right.xlsx", sheetName: "Sheet1", title: "Danh sách quyền", description: null }

const columnsShow: string[] = []

export {
  EditForm,
  fullUrlList,
  fullUrlListOwner,
  exportFileInfo,
  columnsShow,
}
