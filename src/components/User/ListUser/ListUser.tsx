import React, { useState } from "react";

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
import DashboardUsersExcelInsertViewer from "../SingleUser/DashboardUsersExcelInsertViewer/DashboardUsersExcelInsertViewer";
import DashboardUsersExcelUpdateViewer from "../SingleUser/DashboardUsersExcelUpdateViewer/DashboardUsersExcelUpdateViewer";

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




const ListUser = () => {
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
  const [selectUsers, setSelectUsers] = useState([]);



  const handleGetUser = async () => {
    const result = await getData({ url: url, headers: getAuthHeaders(), urlRefreshToken, isCookie: false });
    if (result.data) {
      setData(result.data);
    } else {

    }
  }

  const handleOnRowSelect = (value) => {
    setActiveUser(value);
    setIsShowManagerForm(true);

  }
  const handleOnRowsSelect = (value) => {
    console.log(value)
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

  const handleDeleteUsers = async () => {
    // lọc {id:} từ selectUsers gán vào deleteUsers
    const deleteUsers = selectUsers
      .filter((user: any) => user && user.id)
      .map((user: any) => ({ id: user.id }));

    const { status, errorCode } = await deleteData({ url: deleteUrl, data: deleteUsers })
    if (status) {
      // xóa đi selectUsers khỏi data gán lại vào setData
      if (Array.isArray(selectUsers) && selectUsers.length > 0) {
        const deleteIds = selectUsers.map((user: any) => user.id);
        setData(prev =>
          prev.filter((user: any) => !deleteIds.includes(user.id))
        );
        setSelectUsers([]);
      }
    }
  }


  const handleImportExcel = () => {
    setIsImportExcel(true)
  }

const handleUpdateExcel = () => {
   setIsUpdateExcel(true)
  }



  return (
    <div>
      <div>
        <button onClick={handleGetUser}>get url user</button>
        <button onClick={handleCreateUser}>create new user</button>
        <button onClick={handlePrintListDesignUser}>Design Print list user</button>
        <button onClick={handlePrintListUser}>Print list user</button>
        <button onClick={handlePrintMoreUsers}>Print more users</button>
        <button onClick={handleDeleteUsers}>Delete users</button>
        <button onClick={handleImportExcel}>Import by Excel</button>
        <button onClick={handleUpdateExcel}>Update by Excel</button>
      </div>
      <div style={{ height: '500px' }}>
        <ReactTableBasic
          data={data}
          columns={columnsUser}
          isGlobalFilter={true}
          onOriginalRowSelect={handleOnRowSelect}
          onOriginalRowsSelect={handleOnRowsSelect}
          fieldUnique={'id'}
        >
        </ReactTableBasic>
        {isShowManagerForm && <UserManagerForm
          user={activeUser}
          onSuccess={handleOnSuccess}
        ></UserManagerForm>}

        {isPrintListDesign &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
            <DesignPrint
              urlGet="http://localhost:3000/template-contents/users/list"
              urlUpdate="http://localhost:3000/template-contents/users/detail"
              urlDelete="http://localhost:3000/template-contents/users/detail"
              urlInsert="http://localhost:3000/template-contents/users/detail/insert"
              dynamicTables={{
                user: data
              }}
              // contentStateObject={blockUser}
              onCancel={handleOnCancelDesign}
              title="Thiết Kế Mẫu In Danh Sách Người Dùng"
            >
            </DesignPrint>

          </div>, document.body)
        }


        {isPrintList &&
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

        {isPrintMoreUsers &&
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


        {isImportExcel &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardUsersExcelInsertViewer
            // onCheckUpload={(data)=>{
            //   console.log("data",data)
            // }}
            urlPost={url}
            onCancel={()=>{
              setIsImportExcel(false)
            }}
            >
            </DashboardUsersExcelInsertViewer>

          </div>, document.body)
        }
        {isUpdateExcel &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardUsersExcelUpdateViewer
            // onCheckUpload={(data)=>{
            //   console.log("data",data)
            // }}
            urlPost={url}
            onCancel={()=>{
              setIsUpdateExcel(false)
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