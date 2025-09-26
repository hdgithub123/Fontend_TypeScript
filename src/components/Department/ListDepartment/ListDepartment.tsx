import {ListSubject} from "../../GeneralSubjectTreeComponent"
import type { ListSubjectProps } from '../../GeneralSubjectComponent'
import insertExcelSetting from './settingImport'
import updateExcelSetting from './settingUpdate'
import columns from "./colums"

import {
  AddFormDepartment,
  EditFormDepartment,
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



const ListDepartment = ({authorization = authorizationExample}) => {
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
      titleDesignList="Thiết Kế Mẫu In Danh Sách Khu Vực"
      header="Quản lý khu vực"
    />
  );
};

export default ListDepartment;