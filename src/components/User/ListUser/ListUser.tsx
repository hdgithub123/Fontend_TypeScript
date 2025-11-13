import React, { useEffect, useState } from "react";

// ...existing code...
import {
  ReactTableBasic,
} from 'react-table'


import {
  getData,
  postData,
  putData,
  deleteData,
  patchData
} from '../../../utils/axios'

import columnsUser from './columUser'
import DesignPrint from '../../Print/DesignPrint/DesignPrint';
import PrintPreview from '../../Print/PrintPreview/PrintPreview';
import MakeReportTable from '../../utils/MakeReportTable/MakeReportTable'
import ReactDOM from 'react-dom';
// import DesignPrint from "../../Print/DesignPrint/DesignPrint";
import PrintUsers from '../SingleUser/PrintUsers/PrintUsers'
import DashboardUsersExcelInsertViewer from "../DashboardExcelImport/DashboardUsersExcelInsertViewer/DashboardUsersExcelInsertViewer";
import DashboardUsersExcelUpdateViewer from "../DashboardExcelImport/DashboardUsersExcelUpdateViewer/DashboardUsersExcelUpdateViewer";
import DeleteUsers from "./DeleteUsers";
import NotifyNotSelectedButton from "./Notifibutton";
import styles from './ListUser.module.scss'
import AddForm from "../SingleUser/AddForm/AddForm";
import EditForm from "../SingleUser/EditForm/EditForm";

import inputExcellConfig from '../DashboardExcelImport/DashboardUsersExcelInsertViewer/setting'
import updateExcellConfig from '../DashboardExcelImport/DashboardUsersExcelUpdateViewer/setting'

interface User {
  id: string,
  code: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  active?: boolean;
}



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

const authorizationExample2 = {
  view: true,
  add: false,
  update: false,
  delete: false,

  viewList: true,
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
  const urlGetList: string = 'http://localhost:3000/auth/user/list'
  const urlDeleteList: string = 'http://localhost:3000/auth/user/list'
  const urlPostList: string = 'http://localhost:3000/auth/user/list'
  const urlPutList: string = 'http://localhost:3000/auth/user/list'

  const urlCheckUser = 'http://localhost:3000/auth/user/check-user'
  const urlInsertUser = 'http://localhost:3000/auth/user/detail/insert'
  const urlUpdateUser = 'http://localhost:3000/auth/user/detail'
  const urlDeleteUser = 'http://localhost:3000/auth/user/detail'

  const urlGetPrintContent = 'http://localhost:3000/template-contents/users/list'
  const urlGetPrintDesign = "http://localhost:3000/template-contents/users/list"
  
  const urlUpdatePrintDesign = "http://localhost:3000/template-contents/users/detail"
  const urlDeletePrintDesign = "http://localhost:3000/template-contents/users/detail"
  const urlInsertPrintDesign = "http://localhost:3000/template-contents/users/detail/insert"

  const configInsertExcell = inputExcellConfig
  const configUpdateExcell = updateExcellConfig

  const [data, setData] = useState<Array<{ [key: string]: any }>>([{}]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isShowAddForm, setIsShowAddForm] = useState(false);
  const [isShowEditForm, setIsShowEditForm] = useState(false);
  const [isPrintListDesign, setIsPrintListDesign] = useState(false);
  const [isPrintList, setIsPrintList] = useState(false);
  const [isImportExcel, setIsImportExcel] = useState(false);
  const [isUpdateExcel, setIsUpdateExcel] = useState(false);
  const [isPrintMoreUsers, setIsPrintMoreUsers] = useState(false);
  const [selectUsers, setSelectUsers] = useState<any[]>([]);



  const handleGetUser = async () => {
    const result = await getData({ url: urlGetList });
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
    setIsShowEditForm(true);

  }
  const handleOnRowsSelect = (value) => {
    setSelectUsers(value)
  }

  const handleOnSuccess = (data) => {

    if (data.action === 'insert' || data.action === 'update' || data.action === 'delete') {
      handleGetUser();
    }
    setActiveUser(null);
    setIsShowAddForm(false);
    setIsShowEditForm(false);
  }

  const handleCreateUser = () => {
    setActiveUser(null);
    setIsShowAddForm(true);
  }

  const handleDuplicateUser = () => {
    if (selectUsers.length === 1) {
      const { id, ...rest } = selectUsers[0]; // bỏ id
      const duplicateUser = {
        ...rest,
        code: 'copy-' + rest.code,
        email: 'copy-' + rest.email
      };
      setActiveUser(duplicateUser);
      setIsShowAddForm(true);
      setIsShowEditForm(false); // đảm bảo không bật cả 2 form
    }
  };

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
        {authorization.add && <button onClick={handleCreateUser} className={styles.buttonCreate} >Add New</button>}
        {authorization.add && <button disabled={selectUsers.length !== 1} onClick={handleDuplicateUser} className={styles.buttonCreate} >Duplicate</button>}
        {authorization.viewPrintDesignList && <NotifyNotSelectedButton className={styles.buttonDesign} data={selectUsers} onTrigger={handlePrintListDesignUser} > Design Print list</NotifyNotSelectedButton>}
        {authorization.printList && <NotifyNotSelectedButton className={styles.buttonPrint} data={selectUsers} onTrigger={handlePrintListUser} > Print list</NotifyNotSelectedButton>}
        {authorization.print && <NotifyNotSelectedButton className={styles.buttonPrintMore} data={selectUsers} onTrigger={handlePrintMoreUsers} > Print more</NotifyNotSelectedButton>}
        {authorization.deleteList && <DeleteUsers
          deleteUrl={urlDeleteList}
          selectUsers={selectUsers}
          setSelectUsers={setSelectUsers}
          setData={setData}
          className={styles.buttonDelete}
        />}
        {authorization.addList && <button onClick={handleImportExcel} className={styles.buttonImport}>Add by Excel</button>}
        {authorization.updateList && <button onClick={handleUpdateExcel} className={styles.buttonUpdate}>Update by Excel</button>}
      </div>




      {authorization.viewList && <div className={styles.tableContainer}>
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
        {isShowAddForm && authorization.view && <AddForm
          urlCheckUser={urlCheckUser}
          urlInsertUser={urlInsertUser}
          user={activeUser}
          onSuccess={handleOnSuccess}
          authorization={authorization}
        />}
        {isShowEditForm && authorization.view && <EditForm
          urlUpdateUser={urlUpdateUser}
          urlDeleteUser={urlDeleteUser}
          user={activeUser}
          onSuccess={handleOnSuccess}
          authorization={authorization}
        />}


        {isPrintListDesign && authorization.viewPrintDesignList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
            <DesignPrint
              urlGet={urlGetPrintDesign}
              urlUpdate={urlUpdatePrintDesign}
              urlDelete={urlDeletePrintDesign}
              urlInsert={urlInsertPrintDesign}
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
              urlGet={urlGetPrintContent}
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
              // urlGet="http://localhost:3000/template-contents/user/list"
              urlGet={urlGetPrintContent}
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
              config={configInsertExcell}
              urlPost={urlPostList}
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
              config={configUpdateExcell}
              urlPut={urlPutList}
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