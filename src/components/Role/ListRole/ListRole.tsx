import {ListSubject} from "../../GeneralSubject/GeneralSubjectComponent"
import type { ListSubjectProps } from '../../GeneralSubject/GeneralSubjectComponent'
import insertExcelSetting from './settingImport'
import updateExcelSetting from './settingUpdate'
import columns from "./colums"

import {
  AddFormRole,
  EditFormRole,
  fullUrlList,
  exportFileInfo,
  columnsShow,  
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



const ListRole = ({authorization = authorizationExample}) => {
  return (
    <ListSubject
      columns={columns}
      columnsShow={columnsShow}
      authorization={authorization}
      urlList={fullUrlList}
      exportFile={exportFileInfo || null}
      insertExcelConfig={insertExcelSetting}
      updateExcelConfig={updateExcelSetting}
      AddFormComponent={AddFormRole}
      EditFormComponent={EditFormRole}
      titleDesignList="Thiết Kế Mẫu In Danh Sách Vai Trò"
      header="Quản lý Vai Trò"
    />
  );
};

export default ListRole;