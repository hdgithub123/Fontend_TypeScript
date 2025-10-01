import {ListSubject} from "../../GeneralSubject"
import insertExcelSetting from './settingImport'
import updateExcelSetting from './settingUpdate'
import columns from "./columns"
import { columnsShow } from "./columns"

import {
  AddFormDepartment,
  EditFormDepartment,
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



const ListUserDepartmentRole = ({authorization = authorizationExample}) => {
  return (
    <ListSubject
      columns={columns}
      columnsShow={columnsShow}
      authorization={authorization}
      urlList={fullUrlList}
      exportFile={exportFileInfo || null}
      insertExcelConfig={insertExcelSetting}
      updateExcelConfig={updateExcelSetting}
      AddFormComponent={AddFormDepartment}
      EditFormComponent={EditFormDepartment}
      titleDesignList="Thiết Kế Mẫu In Danh Sách Phân Quyền"
      header="Quản lý phân quyền"
    />
  );
};

export default ListUserDepartmentRole;