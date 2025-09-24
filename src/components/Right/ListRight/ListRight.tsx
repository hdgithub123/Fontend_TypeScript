import {ListSubject} from "../../GeneralSubjectComponent"
import columns from "./colums"

import {
  EditForm,
  fullUrlList,
  fullUrlListOwner,
  exportFileInfo,
  columnsShow,
} from './configData'


const authorizationExample = {
  view: true,
  add: true,
  // update: true,
  // delete: true,

  viewList: true,
  addList: true,
  // updateList: true,
  // deleteList: true,

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



const ListRight = ({authorization = authorizationExample, isOwner = false}) => {
  return (
    <ListSubject
      authorization={authorization}
      columns= {columns}
      columnsShow={columnsShow}
      urlList={isOwner ? fullUrlListOwner : fullUrlList}
      exportFile={exportFileInfo || null}
      insertExcelConfig={null}
      updateExcelConfig={null}
      AddFormComponent={null}
      EditFormComponent={EditForm}
      titleDesignList="Thiết Kế Mẫu In Danh Sách Quyền"
      header="Quản lý Quyền"
    />
  );
};

export default ListRight;