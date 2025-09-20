import ListSubject from "../../GeneralSubjectComponent"
import type { ListSubjectProps } from '../../GeneralSubjectComponent'
import insertExcelSetting from './settingImport'
import updateExcelSetting from './settingUpdate'


import {
  AddFormOrganization,
  EditFormOrganization,
  fullUrlList,
  exportFileInfo,
} from './configData'


const authorizationExample = {
  view: true,
  add: true,
  update: true,
  delete: true,

  viewList: true,
  addList: true,
  updateList: true,
  deleteList: true,

  viewPrintDesign: true,
  addPrintDesign: true,
  updatePrintDesign: true,
  deletePrintDesign: true,

  viewPrintDesignList: true,
  addPrintDesignList: true,
  updatePrintDesignList: true,
  deletePrintDesignList: true,

  print: true,
  printList: true,

  exportExcel: true,
}



const ListOrganization = ({authorization = authorizationExample}) => {
  return (
    <ListSubject
      authorization={authorization}
      urlList={fullUrlList}
      exportFile={exportFileInfo || null}
      insertExcelConfig={insertExcelSetting}
      updateExcelConfig={updateExcelSetting}
      AddFormComponent={AddFormOrganization}
      EditFormComponent={EditFormOrganization}
      titleDesignList="Thiết Kế Mẫu In Danh Sách Tổ chức"
      header="Quản lý Tổ chức"
    />
  );
};

export default ListOrganization;