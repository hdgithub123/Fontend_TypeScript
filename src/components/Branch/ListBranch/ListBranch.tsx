import {ListSubject} from "../../GeneralSubject"
import type { ListSubjectProps } from '../../GeneralSubject'
import insertExcelSetting from './settingImport'
import updateExcelSetting from './settingUpdate'
import columns from "./colums"

import {
  AddFormBranch,
  EditFormBranch,
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



const ListBranch = ({authorization = authorizationExample}) => {
  return (
    <ListSubject
      columns={columns}
      columnsShow={columnsShow}
      authorization={authorization}
      urlList={fullUrlList}
      exportFile={exportFileInfo || null}
      insertExcelConfig={insertExcelSetting}
      updateExcelConfig={updateExcelSetting}
      AddFormComponent={AddFormBranch}
      EditFormComponent={EditFormBranch}
      titleDesignList="Thiết Kế Mẫu In Danh Sách Chi Nhánh"
      header="Quản lý Chi Nhánh"
    />
  );
};

export default ListBranch;