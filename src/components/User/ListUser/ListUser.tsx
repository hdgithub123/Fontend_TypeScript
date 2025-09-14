import React, { useEffect, useState } from "react";

// ...existing code...
import {
  ReactTableBasic,
  ReactTableBasicArrowkey,
  ReactTableFull,
  ReactTableFullArrowkey,
  ReactTableNomalArrowkey,
  ReactTablePages,
  SearchDropDown,
  formatNumber,
  SumFooter,
  AverageFooter,
  CountFooter,

  TextCell,
  EditableCell,
  DateCell,
  DateUsCell,
  DateVnCell,
  DateTimeCell,
  DateTimeUsCell,
  DateTimeVnCell,
  NumberCell,
  NumberUsCell,
  NumberVnCell,
} from 'react-table'


import {
  getAuthHeaders,
  getData,
  postData,
  putData,
  deleteData,
  patchData
} from '../../../utils/axios'

import UserManagerForm from '../SingleUser/ManagerUserForm/UserManagerForm';
import columnsUser from './columUser'
import DesignPrint from '../../Print/DesignPrint/DesignPrint';
import PrintPreview from '../../Print/PrintPreview/PrintPreview';
import MakeReportTable from '../../MakeReportTable/MakeReportTable'
import ReactDOM from 'react-dom';
// import DesignPrint from "../../Print/DesignPrint/DesignPrint";
import PrintUsers from '../SingleUser/PrintUsers/PrintUsers'
import DashboardUsersExcelInsertViewer from "../DashboardExcelImport/DashboardUsersExcelInsertViewer/DashboardUsersExcelInsertViewer";
import DashboardUsersExcelUpdateViewer from "../DashboardExcelImport/DashboardUsersExcelUpdateViewer/DashboardUsersExcelUpdateViewer";
import DeleteUsers from "./DeleteUsers";
import NotifyNotSelectedButton from "./Notifibutton";
import styles from './ListUser.module.scss'



interface User {
  id: string,
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}


const zoneId = '8e522402-3611-11f0-b432-0242ac110002'; //-- chi nhanh HCM-- con
//const zoneId = '8e4f3a13-3611-11f0-b432-0242ac110002'; // -- tong cong ty -- cha
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
  addPrintDesign: false,
  updatePrintDesign: false,
  deletePrintDesign: false,

  viewPrintDesignList: true,
  addPrintDesignList: false,
  updatePrintDesignList: false,
  deletePrintDesignList: false,

  print: true,
  printList: true,

  exportExcel: false,
}

const authorizationExample2 = {
  view: false,
  add: false,
  update: false,
  delete: false,

  viewList: false,
  addList: false,
  updateList: false,
  deleteList: false,

  viewPrintDesign: false,
  addPrintDesign: false,
  updatePrintDesign: false,
  deletePrintDesign: false,

  viewPrintDesignList: false,
  addPrintDesignList: false,
  updatePrintDesignList: false,
  deletePrintDesignList: false,

  print: false,
  printList: false,
  exportExcel: false,
}

const ListUser = ({ authorization = authorizationExample }) => {
  const url: string = 'http://localhost:3000/auth/user/list'
  const urlRefreshToken: string = 'http://localhost:3000/auth/refresh-token'
  const deleteUrl: string = 'http://localhost:3000/auth/user/list'
  const [data, setData] = useState<Array<{ [key: string]: any }>>([{}]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isShowManagerForm, setIsShowManagerForm] = useState(false);
  const [isPrintListDesign, setIsPrintListDesign] = useState(false);
  const [isPrintList, setIsPrintList] = useState(false);
  const [isImportExcel, setIsImportExcel] = useState(false);
  const [isUpdateExcel, setIsUpdateExcel] = useState(false);
  const [isPrintMoreUsers, setIsPrintMoreUsers] = useState(false);
  const [selectUsers, setSelectUsers] = useState<any[]>([]);



  const handleGetUser = async () => {
    const result = await getData({ url: url, headers: getAuthHeaders(), urlRefreshToken, isCookie: false });
    if (result.data) {
      setData(result.data);
    } else {
      setData([]);
    }
  }


  useEffect(() => {
     if (authorization.viewList) {
    handleGetUser();
     } else {
      setData([]);
     }
  }, []);

  const handleOnRowSelect = (value) => {
    setActiveUser(value);
    setIsShowManagerForm(true);

  }
  const handleOnRowsSelect = (value) => {
    setSelectUsers(value)
  }

  const handleOnSuccess = (data) => {
    if (data.action === 'insert' || data.action === 'update' || data.action === 'delete') {
      handleGetUser();
    }
    setIsShowManagerForm(false);
  }

  const handleCreateUser = () => {
    setActiveUser(null);
    setIsShowManagerForm(true);
  }

  const handlePrintListDesignUser = () => {
    setIsPrintListDesign(true)
  }

  const handleOnCancelDesign = (cancel: boolean) => {
    setIsPrintListDesign(!cancel)
  }

  const handlePrintListUser = () => {
    setIsPrintList(true)
  }

  const handleOnCancelPrint = (cancel: boolean) => {
    setIsPrintList(!cancel)
  }

  const handlePrintMoreUsers = () => {
    setIsPrintMoreUsers(true)

  }


  const handleImportExcel = () => {
    setIsImportExcel(true)
  }

  const handleUpdateExcel = () => {
    setIsUpdateExcel(true)
  }



  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Quản lý User</h1>
      <div className={styles.buttonGroup}>
         {authorization.viewList && <button onClick={handleGetUser} className={styles.buttonGet} >Refresh</button>}
        {authorization.addList && <button onClick={handleCreateUser} className={styles.buttonCreate} >Add New</button>}
        {authorization.viewPrintDesignList && <NotifyNotSelectedButton className={styles.buttonDesign} data={selectUsers} onTrigger={handlePrintListDesignUser} > Design Print list</NotifyNotSelectedButton>}
        {authorization.printList && <NotifyNotSelectedButton className={styles.buttonPrint} data={selectUsers} onTrigger={handlePrintListUser} > Print list</NotifyNotSelectedButton>}
        {authorization.print && <NotifyNotSelectedButton className={styles.buttonPrintMore} data={selectUsers} onTrigger={handlePrintMoreUsers} > Print more</NotifyNotSelectedButton>}
        {authorization.deleteList && <DeleteUsers
          deleteUrl={deleteUrl}
          selectUsers={selectUsers}
          setSelectUsers={setSelectUsers}
          setData={setData}
          className={styles.buttonDelete}
        />}
        {authorization.addList && <button onClick={handleImportExcel} className={styles.buttonImport}>Add by Excel</button>}
        {authorization.updateList && <button onClick={handleUpdateExcel} className={styles.buttonUpdate}>Update by Excel</button>}
      </div>


      {authorization.viewList &&<div className={styles.tableContainer}>
        <ReactTableBasic
          data={data}
          columns={columnsUser}
          isGlobalFilter={true}
          onOriginalRowSelect={handleOnRowSelect}
          onOriginalRowsSelect={handleOnRowsSelect}
          fieldUnique={'id'}
          exportFile={authorization.exportExcel ? { name: "User.xlsx", sheetName: "Sheet1", title: "Danh sách user", description: null } : null}
        >
        </ReactTableBasic>
      </div>}
      <div className={styles.childContainer}>
        {isShowManagerForm && authorization.view && <UserManagerForm
          user={activeUser}
          onSuccess={handleOnSuccess}
           authorization={authorization}
        ></UserManagerForm>}

        {isPrintListDesign && authorization.viewPrintDesignList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
            <DesignPrint
              urlGet="http://localhost:3000/template-contents/users/list"
              urlUpdate="http://localhost:3000/template-contents/users/detail"
              urlDelete="http://localhost:3000/template-contents/users/detail"
              urlInsert="http://localhost:3000/template-contents/users/detail/insert"
              dynamicTables={{
                user: selectUsers
              }}
              // contentStateObject={blockUser}
              onCancel={handleOnCancelDesign}
              title="Thiết Kế Mẫu In Danh Sách Người Dùng"
              authorization={{
                add: authorization.addPrintDesignList,
                update: authorization.updatePrintDesignList,
                delete: authorization.deletePrintDesignList,
                view: authorization.viewPrintDesignList,
              }}
            >
            </DesignPrint>

          </div>, document.body)
        }


        {isPrintList && authorization.printList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <PrintPreview
              // dynamicTexts={userData}
              dynamicTables={{
                user: selectUsers
              }}
              // contentStateObject={blockUser}
              urlGet="http://localhost:3000/template-contents/users/list"
              onCancel={handleOnCancelPrint}
            >
            </PrintPreview>

          </div>, document.body)
        }

        {isPrintMoreUsers && authorization.print &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <PrintUsers
              data={selectUsers}
              // dynamicTexts={userData}
              // dynamicTables={{
              //   user: data
              // }}
              // contentStateObject={blockUser}
              urlGet="http://localhost:3000/template-contents/user/list"
              onCancel={() => {
                setIsPrintMoreUsers(false)
              }}
            >
            </PrintUsers>

          </div>, document.body)
        }


        {isImportExcel && authorization.addList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardUsersExcelInsertViewer
              // onCheckUpload={(data)=>{
              //   console.log("data",data)
              // }}
              urlPost={url}
              onCancel={() => {
                setIsImportExcel(false)
              }}
              onDone={() => {
                setIsImportExcel(false)
                handleGetUser()
              }}
            >
            </DashboardUsersExcelInsertViewer>

          </div>, document.body)
        }
        {isUpdateExcel && authorization.updateList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardUsersExcelUpdateViewer
              // onCheckUpload={(data)=>{
              //   console.log("data",data)
              // }}
              urlPost={url}
              onCancel={() => {
                setIsUpdateExcel(false)
              }}
              onDone={() => {
                setIsUpdateExcel(false)
                handleGetUser()
              }}
            >
            </DashboardUsersExcelUpdateViewer>

          </div>, document.body)
        }

      </div>
    </div>
  );
};

export default ListUser;