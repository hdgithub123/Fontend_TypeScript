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
  const [data, setData] = useState<Array<{ [key: string]: any }>>([{}]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isShowManagerForm, setIsShowManagerForm] = useState(false);

  const handleGetUser = async () => {
    const result = await getData({ url: url, headers: getAuthHeaders(), urlRefreshToken, isCookie: false });
    if (result.data) {
      console.log("result", result.data)
      setData(result.data);
    } else {

    }
  }

  const handleOnRowSelect = (value) => {
    setActiveUser(value);
    setIsShowManagerForm(true);
    // console.log("value", value)
  }
  const handleOnRowsSelect = (value) => {
    console.log("value", value)
  }

  const handleOnSuccess = (data) => {
    console.log("data", data)
    if (data.action === 'insert' || data.action === 'update' || data.action === 'delete') {
      handleGetUser();
    }
    setIsShowManagerForm(false);
  }

  const handleCreateUser = () => {
    setActiveUser(null);
    setIsShowManagerForm(true);
  }

  return (
    <div>
      <div>
        <button onClick={handleGetUser}>get url user</button>
        <button onClick={handleCreateUser}>create new user</button>
      </div>

      <div style={{ height: '500px' }}>
        <ReactTableBasicArrowkey
          data={data}
          columns={columnsUser}
          isGlobalFilter={true}
          onRowSelect={handleOnRowSelect}
          onRowsSelect={handleOnRowsSelect}
          fieldUnique={'id'}
        >
        </ReactTableBasicArrowkey>
        {isShowManagerForm && <UserManagerForm
          user={activeUser}
          onSuccess={handleOnSuccess}
        ></UserManagerForm>}
      </div>

    </div>
  );
};

export default ListUser;