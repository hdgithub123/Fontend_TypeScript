import generateRandomObjects from '../../functionTest/generateRandomObjects'

// tạo component hiển thị list user
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
  getData,
  postData,
  putData,
  deleteData,
  patchData
} from '../../Axios'

import RegistrationForm from '../SingleUser/RegistrationForm/RegistrationForm';
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

interface ListUserProps {
  users: User[];
}


const userSchema = {
  id: "string",
  username: "string",
  password: "string",
  fullName: "string",
  email: "string",
  phone: "string",
  isActive: 'boolean'
}



const temUser: object = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  username: "user1",
  password: "$2b$10$demoHashedPassword1",
  fullName: "User One",
  email: "user1@example.com",
  phone: "0912625368",
  isActive: true,
  // // createdAt: "2025-08-03T17:52:00Z",
  createdAt: "2025-08-03T17:52:00",
  createdTime: "2025-08-03T17:52:00Z",
  createdBy: "admin"
};




const users1 = [
  { id: "550e8400-e29b-41d4-a716-446655440001", username: "user1", password: "$2b$10$demoHashedPassword1", fullName: "User One", email: "user1@example.com", phone: "+84-912-340001", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "admin" },
  { id: "550e8400-e29b-41d4-a716-446655440002", username: "user2", password: "$2b$10$demoHashedPassword2", fullName: "User Two", email: "user2@example.com", phone: "+84-912-340002", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user1" },
  { id: "550e8400-e29b-41d4-a716-446655440003", username: "user3", password: "$2b$10$demoHashedPassword3", fullName: "User Three", email: "user3@example.com", phone: "+84-912-340003", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user2" },
  { id: "550e8400-e29b-41d4-a716-446655440099", username: "user99", password: "$2b$10$demoHashedPassword99", fullName: "User Ninety-Nine", email: "user99@example.com", phone: "+84-912-340099", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user98" },
  { id: "550e8400-e29b-41d4-a716-446655440100", username: "user100", password: "$2b$10$demoHashedPassword100", fullName: "User One Hundred", email: "user100@example.com", phone: "+84-912-340100", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user99" },
  { id: "550e8400-e29b-41d4-a716-446655440010", username: "user10", password: "$2b$10$demoHashedPassword10", fullName: "User Ten", email: "user10@example.com", phone: "+84-912-340010", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user9" },
  { id: "550e8400-e29b-41d4-a716-446655440011", username: "user11", password: "$2b$10$demoHashedPassword11", fullName: "User Eleven", email: "user11@example.com", phone: "+84-912-340011", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user10" },
  { id: "550e8400-e29b-41d4-a716-446655440012", username: "user12", password: "$2b$10$demoHashedPassword12", fullName: "User Twelve", email: "user12@example.com", phone: "+84-912-340012", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user11" },
  { id: "550e8400-e29b-41d4-a716-446655440013", username: "user13", password: "$2b$10$demoHashedPassword13", fullName: "User Thirteen", email: "user13@example.com", phone: "+84-912-340013", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user12" },
  { id: "550e8400-e29b-41d4-a716-446655440014", username: "user14", password: "$2b$10$demoHashedPassword14", fullName: "User Fourteen", email: "user14@example.com", phone: "+84-912-340014", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user13" },
  { id: "550e8400-e29b-41d4-a716-446655440015", username: "user15", password: "$2b$10$demoHashedPassword15", fullName: "User Fifteen", email: "user15@example.com", phone: "+84-912-340015", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user14" },
  { id: "550e8400-e29b-41d4-a716-446655440016", username: "user16", password: "$2b$10$demoHashedPassword16", fullName: "User Sixteen", email: "user16@example.com", phone: "+84-912-340016", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user15" },


];

const users2 = [
  { id: "550e8400-e29b-41d4-a716-446655440001", username: "user1", password: "$2b$10$demoHashedPassword1", fullName: "User One", email: "user1@example.com", phone: "+84-912-340001", isActive: 1, createdAt: "2025-08-03T17:52:00Z" },
  { id: "550e8400-e29b-41d4-a716-446655440002", username: "user2", password: "$2b$10$demoHashedPassword2", fullName: "User Two", email: "user2@example.com", phone: "+84-912-340002", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: null },
  { id: "550e8400-e29b-41d4-a716-446655440004", username: "user4", password: "$2b$10$demoHashedPassword4", fullName: "User Four", email: "user4@example.com", phone: "+84-912-340004", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "" },
  { id: "550e8400-e29b-41d4-a716-446655440005", username: "user5", password: "$2b$10$demoHashedPassword5", fullName: "User Five", email: "user5@example.com", phone: "+84-912-340005", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: null },
  { id: "550e8400-e29b-41d4-a716-446655440006", username: "user6", password: "$2b$10$demoHashedPassword6", fullName: "User Six", email: "user6@example.com", phone: "+84-912-340006", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user5" },
  { id: "550e8400-e29b-41d4-a716-446655440007", username: "user7", password: "$2b$10$demoHashedPassword7", fullName: "User Seven", email: "user7@example.com", phone: "+84-912-340007", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user6" },
  { id: "550e8400-e29b-41d4-a716-446655440008", username: "user8", password: "$2b$10$demoHashedPassword8", fullName: "User Eight", email: "user8@example.com", phone: "+84-912-340008", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user7" },
  { id: "550e8400-e29b-41d4-a716-446655440009", username: "user9", password: "$2b$10$demoHashedPassword9", fullName: "User Nine", email: "user9@example.com", phone: "+84-912-340009", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user8" },
  { id: "550e8400-e29b-41d4-a716-446655440010", username: "user10", password: "$2b$10$demoHashedPassword10", fullName: "User Ten", email: "user10@example.com", phone: "+84-912-340010", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user9" },
  { id: "550e8400-e29b-41d4-a716-446655440011", username: "user11", password: "$2b$10$demoHashedPassword11", fullName: "User Eleven", email: "user11@example.com", phone: "+84-912-340011", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user10" },
  { id: "550e8400-e29b-41d4-a716-446655440012", username: "user12", password: "$2b$10$demoHashedPassword12", fullName: "User Twelve", email: "user12@example.com", phone: "+84-912-340012", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user11" },
  { id: "550e8400-e29b-41d4-a716-446655440013", username: "user13", password: "$2b$10$demoHashedPassword13", fullName: "User Thirteen", email: "user13@example.com", phone: "+84-912-340013", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user12" },
  { id: "550e8400-e29b-41d4-a716-446655440014", username: "user14", password: "$2b$10$demoHashedPassword14", fullName: "User Fourteen", email: "user14@example.com", phone: "+84-912-340014", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user13" },
  { id: "550e8400-e29b-41d4-a716-446655440015", username: "user15", password: "$2b$10$demoHashedPassword15", fullName: "User Fifteen", email: "user15@example.com", phone: "+84-912-340015", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user14" },
  { id: "550e8400-e29b-41d4-a716-446655440016", username: "user16", password: "$2b$10$demoHashedPassword16", fullName: "User Sixteen", email: "user16@example.com", phone: "+84-912-340016", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user15" },
  { id: "550e8400-e29b-41d4-a716-446655440017", username: "user17", password: "$2b$10$demoHashedPassword17", fullName: "User Seventeen", email: "user17@example.com", phone: "+84-912-340017", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user16" },
  { id: "550e8400-e29b-41d4-a716-446655440018", username: "user18", password: "$2b$10$demoHashedPassword18", fullName: "User Eighteen", email: "user18@example.com", phone: "+84-912-340018", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user17" },
  { id: "550e8400-e29b-41d4-a716-446655440019", username: "user19", password: "$2b$10$demoHashedPassword19", fullName: "User Nineteen", email: "user19@example.com", phone: "+84-912-340019", isActive: 1, createdAt: "2025-08-03T17:52:00Z", createdBy: "user18" },
  { id: "550e8400-e29b-41d4-a716-446655440020", username: "user20", password: "$2b$10$demoHashedPassword20", fullName: "User Twenty", email: "user20@example.com", phone: "+84-912-340020", isActive: 0, createdAt: "2025-08-03T17:52:00Z", createdBy: "user19" }
];




const zoneId = '8e522402-3611-11f0-b432-0242ac110002'; //-- chi nhanh HCM-- con
//const zoneId = '8e4f3a13-3611-11f0-b432-0242ac110002'; // -- tong cong ty -- cha




const ListUser = () => {
  const url: string = 'http://localhost:3000/auth/user/list'
  const urlRefreshToken: string = 'http://localhost:3000/auth/refresh-token'
  const urlCheckUser: string = 'http://localhost:3000/auth/user/check-user'
  const [data, setData] = useState<Array<{ [key: string]: any }>>([{}]);
  const [userCheck, setUserCheck] = useState<{ [key: string]: any }>({});
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const token = sessionStorage.getItem('token');
  const newheaders: Record<string, any> = {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${token}`,
    zone: zoneId,
    is_child_zone: true,
  };


  const handleRandomUsers = () => {
    const usersRandom = generateRandomObjects(temUser, 100, 0.8)
    setData(usersRandom);
  }

  const handleTempuser1 = () => {
    setData(users1);
  }

  const handleTempuser2 = () => {
    setData(users2);
  }




  const handleGetClick = async () => {

    const result = await getData({ url: url, headers: newheaders, urlRefreshToken, isCookie: false });




    if (result.data) {
      console.log("result", result.data)
      setData(result.data);
      // setUrl(url==='http://localhost:3000/user/list'? 'https://datausa.io/api/data?drilldowns=Nation&measures=Population':'http://localhost:3000/user/list');
    } else {
      // setData('Lỗi khi lấy dữ liệu');
      //lấy token từ sessionStorage

    }
  }

  const handleOnRowSelect = (value) => {
    setActiveUser(value);
    // console.log("value", value)
  }
  const handleOnRowsSelect = (value) => {
    console.log("value", value)
  }

  const handleOnSubmit = async (user: User) => {



    const { id, ...insertUser } = user;
    insertUser.isActive = false
    const result = await postData({ url: url, data: [insertUser], headers: newheaders, urlRefreshToken, isCookie: true });


    if (result.data) {
      console.log("result", result.data)
      setUrl(url === 'http://localhost:3000/user/list' ? 'https://datausa.io/api/data?drilldowns=Nation&measures=Population' : 'http://localhost:3000/user/list');
    } else {
      // setData('Lỗi khi lấy dữ liệu');
      //lấy token từ sessionStorage

    }

    // const myUserCheck = {
    //   "fields": {
    //     "username": user.username,
    //     "email": user.email
    //   },
    // }

    // const checkuser = await postData({ url: urlCheckUser, data: myUserCheck, headers: newheaders, urlRefreshToken, isCookie: false });
    // console.log("checkuser", checkuser)
    // if (checkuser.data) {

    //   setUserCheck(checkuser.data);
    // }
  }

  const handleCheckUser = async (user: User) => {
    const myUserCheck = {
      "fields": {
        "username": user.username,
        "email": user.email
      }
    }
    const checkuser = await postData({ url: urlCheckUser, data: myUserCheck, headers: newheaders, urlRefreshToken, isCookie: false });
    console.log("checkuser",checkuser)
    // return checkuser
  }


  const handleonAllInputChange = async (user: User) => {
    return true
  };


  const schema = {
    username: 'string',
    password: 'password',
    email: 'email',
    age: 'number',
    isActive: 'boolean'
  };


const handleOnRegisterSuccess = (on) => {
  console.log("on",on)
}


  return (
    <div>
      <button onClick={handleGetClick}>get url user</button>
      <button onClick={handleRandomUsers}>Random</button>
      <button onClick={handleTempuser1}>Tempuser1</button>
      <button onClick={handleTempuser2}>Tempuser2</button>
      <div style={{ height: '500px' }}>
        <ReactTableFull
          data={data}
          columns={columnsUser}
          isGlobalFilter={true}
          onRowSelect={handleOnRowSelect}
          onRowsSelect={handleOnRowsSelect}
          fieldUnique={'id'}
        >
        </ReactTableFull>
        <button onClick={handleCheckUser}>handleCheckUser</button>
        <RegistrationForm
          onRegisterSuccess={handleOnRegisterSuccess}
        ></RegistrationForm>

        {/* <UserManagerForm
        user={activeUser}
        ></UserManagerForm> */}
        {/* <ReactTableFull
          data={makeData1}
          columns={columns1headercof}
          isGlobalFilter={false}
        ></ReactTableFull> */}
      </div>

    </div>
  );
};

export default ListUser;


const makeData1 = [
  { firstName: '1Alice', lastName: 'Smith', age: 28, visits: "2024-01-01", progress: 75, status: 'relationship' },
  { firstName: '2Bob', lastName: 'Johnson', age: 32, visits: "2024-02-01", progress: 80, status: 'single' },
  { firstName: '3Charlie', lastName: 'Williams', age: 45, visits: "2024-03-01", progress: 85, status: 'complicated' },
  { firstName: '4David', lastName: 'Brown', age: 23, visits: "2024-04-01", progress: 90, status: 'relationship' },
  { firstName: '5Eva', lastName: 'Jones', age: 36, visits: "2024-05-01", progress: 70, status: 'single' },
  { firstName: '6Frank', lastName: 'Miller', age: 40, visits: "2024-06-01", progress: 75, status: 'complicated' },
  { firstName: '7Grace', lastName: 'Davis', age: 50, visits: "2024-07-01", progress: 80, status: 'relationship' },
  { firstName: '8Henry', lastName: 'Garcia', age: 29, visits: "2024-08-01", progress: 85, status: 'single' },
  { firstName: '9Isabella', lastName: 'Martinez', age: 35, visits: "2024-09-01", progress: 90, status: 'complicated' },
  { firstName: '10Jack', lastName: 'Rodriguez', age: 39, visits: "2024-10-01", progress: 70, status: 'relationship' },
  { firstName: '11John', lastName: 'Wilson', age: 42, visits: "2024-11-01", progress: 75, status: 'single' },
  { firstName: '12Jane', lastName: 'Anderson', age: 38, visits: "2024-12-01", progress: 80, status: 'complicated' },
  { firstName: '13Sarah', lastName: 'Thomas', age: 33, visits: "2025-01-01", progress: 85, status: 'relationship' },
  { firstName: '14Tom', lastName: 'Taylor', age: 37, visits: "2025-02-01", progress: 90, status: 'single' },
  { firstName: '15Emma', lastName: 'Moore', age: 41, visits: "2025-03-01", progress: 70, status: 'complicated' },
  { firstName: '16Olivia', lastName: 'Martin', age: 46, visits: "2025-04-01", progress: 75, status: 'relationship' },
  { firstName: '17 Liam', lastName: 'Jackson', age: 31, visits: "2025-05-01", progress: 80, status: 'single' },
  { firstName: '18 Noah', lastName: 'Thompson', age: 34, visits: "2025-06-01", progress: 85, status: 'complicated' },
  { firstName: '19 William', lastName: 'White', age: 43, visits: "2025-07-01", progress: 90, status: 'relationship' },
  { firstName: '20 Sophia', lastName: 'Harris', age: 47, visits: "2025-08-01", progress: 70, status: 'single' },
  { firstName: '21 Alice', lastName: 'ănh hồ vịnh', age: 28, visits: "2024-01-01", progress: 75, status: 'relationship' },
  { firstName: '22 Bob', lastName: 'Johnson', age: 32, visits: "2024-02-01", progress: 80, status: 'single' },
  { firstName: '23 Charlie', lastName: 'Williams', age: 45, visits: "2024-03-01", progress: 85, status: 'complicated' },
  { firstName: '24David', lastName: 'Brown', age: 23, visits: "2024-04-01", progress: 90, status: 'relationship' },
  { firstName: '25Eva', lastName: 'Jones', age: 36, visits: "2024-05-01", progress: 70, status: 'single' },
  { firstName: '26Frank', lastName: 'Miller', age: 40, visits: "2024-06-01", progress: 75, status: 'complicated' },
  { firstName: '27Grace', lastName: 'Davis', age: 50, visits: "2024-07-01", progress: 80, status: 'relationship' },
  { firstName: '28Henry', lastName: 'Garcia', age: 29, visits: "2024-08-01", progress: 85, status: 'single' },
  { firstName: '29Isabella', lastName: 'Martinez', age: 35, visits: "2024-09-01", progress: 90, status: 'complicated' },
  { firstName: '30Jack', lastName: 'Rodriguez', age: 39, visits: "2024-10-01", progress: 70, status: 'relationship' },
  { firstName: '31John', lastName: 'Wilson', age: 42, visits: "2024-11-01", progress: 75, status: 'single' },
  { firstName: '32Jane', lastName: 'Anderson', age: 38, visits: "2024-12-01", progress: 80, status: 'complicated' },
  { firstName: '33Sarah', lastName: 'Thomas', age: 33, visits: "2025-01-01", progress: 85, status: 'relationship' },
  { firstName: '34Tom', lastName: 'Taylor', age: 37, visits: "2025-02-01", progress: 90, status: 'single' },
  { firstName: '35Emma HIYH HUIH ctr 677', lastName: 'Moore', age: 41, visits: "2025-03-01", progress: 70, status: 'complicated' },
  { firstName: '36Olivia', lastName: 'Martin', age: 46, visits: "2025-04-01", progress: 75, status: 'relationship' },
  { firstName: '37Liam', lastName: 'Jackson', age: 31, visits: "2025-05-01", progress: 80, status: 'single' },
  { firstName: '38Noah', lastName: 'Thompson', age: 34, visits: "2025-06-01", progress: 85, status: 'complicated' },
  { firstName: '39William', lastName: 'White', age: 43, visits: "2025-07-01", progress: 90, status: 'relationship' },
  { firstName: '40Sophia', lastName: 'Harris', age: 47, visits: "2025-08-01", progress: 70, status: 'single' },
  { firstName: '41Alice', lastName: 'Smith', age: 28, visits: "2024-01-01", progress: 75, status: 'relationship' },
  { firstName: '42Bob', lastName: 'Johnson', age: 32, visits: "2024-02-01", progress: 80, status: 'single' },
  { firstName: '43Charlie', lastName: 'Williams', age: 45, visits: "2024-03-01", progress: 85, status: 'complicated' },
  { firstName: '44David', lastName: 'Brown', age: 23, visits: "2024-04-01", progress: 90, status: 'relationship' },
  { firstName: '45Eva', lastName: 'Jones', age: 36, visits: "2024-05-01", progress: 70, status: 'single' },
  { firstName: '46Frank', lastName: 'Miller', age: 40, visits: "2024-06-01", progress: 75, status: 'complicated' },
  { firstName: '47Grace', lastName: 'Davis', age: 50, visits: "2024-07-01", progress: 80, status: 'relationship' },
  { firstName: '48Henry', lastName: 'Garcia', age: 29, visits: "2024-08-01", progress: 85, status: 'single' },
  { firstName: '49Isabella', lastName: 'Martinez', age: 35, visits: "2024-09-01", progress: 90, status: 'complicated' },
  { firstName: '50Jack', lastName: 'Rodriguez', age: 39, visits: "2024-10-01", progress: 70, status: 'relationship' },
  { firstName: '51John', lastName: 'Wilson', age: 42, visits: "2024-11-01", progress: 75, status: 'single' },
  { firstName: '52Jane', lastName: 'Anderson', age: 38, visits: "2024-12-01", progress: 80, status: 'complicated' },
  { firstName: '53Sarah', lastName: 'Thomas', age: 33, visits: "2025-01-01", progress: 85, status: 'relationship' },
  { firstName: '54Tom', lastName: 'Taylor', age: 37, visits: "2025-02-01", progress: 90, status: 'single' },
  { firstName: '55Emma', lastName: 'Moore', age: 41, visits: "2025-03-01", progress: 70, status: 'complicated' },
  { firstName: '56Olivia', lastName: 'Martin', age: 46, visits: "2025-04-01", progress: 75, status: 'relationship' },
  { firstName: '57Liam', lastName: 'Jackson', age: 31, visits: "2025-05-01", progress: 80, status: 'single' },
  { firstName: '58Noah', lastName: 'Thompson', age: 34, visits: "2025-06-01", progress: 85, status: 'complicated' },
  { firstName: '59William', lastName: 'White', age: 43, visits: "2025-07-01", progress: 90, status: 'relationship' },
  { firstName: '60Sophia', lastName: 'Harris', age: 47, visits: "2025-08-01", progress: 70, status: 'single' },
  { firstName: '61Alice', lastName: 'Smith', age: 28, visits: "2024-01-01", progress: 75, status: 'relationship' },
  { firstName: '62Bob', lastName: 'Johnson', age: 32, visits: "2024-02-01", progress: 80, status: 'single' },
  { firstName: '63Charlie', lastName: 'Williams', age: 45, visits: "2024-03-01", progress: 85, status: 'complicated' },
  { firstName: '64David', lastName: 'Brown', age: 23, visits: "2024-04-01", progress: 90, status: 'relationship' },
  { firstName: '65Eva', lastName: 'Jones', age: 36, visits: "2024-05-01", progress: 70, status: 'single' },
  { firstName: '66Frank', lastName: 'Miller', age: 40, visits: "2024-06-01", progress: 75, status: 'complicated' },
  { firstName: '67Grace', lastName: 'Davis', age: 50, visits: "2024-07-01", progress: 80, status: 'relationship' },
  { firstName: '68Henry', lastName: 'Garcia', age: 29, visits: "2024-08-01", progress: 85, status: 'single' },
  { firstName: '69Isabella', lastName: 'Martinez', age: 35, visits: "2024-09-01", progress: 90, status: 'complicated' },
  { firstName: '70Jack', lastName: 'Rodriguez', age: 39, visits: "2024-10-01", progress: 70, status: 'relationship' },
  { firstName: '71John', lastName: 'Wilson', age: 42, visits: "2024-11-01", progress: 75, status: 'single' },
  { firstName: '72Jane', lastName: 'Anderson', age: 38, visits: "2024-12-01", progress: 80, status: 'complicated' },
  { firstName: '73Sarah', lastName: 'Thomas', age: 33, visits: "2025-01-01", progress: 85, status: 'relationship' },
  { firstName: '74Tom', lastName: 'Taylor', age: 37, visits: "2025-02-01", progress: 90, status: 'single' },
  { firstName: '75Emma', lastName: 'Moore', age: 41, visits: "2025-03-01", progress: 70, status: 'complicated' },
  { firstName: '76Olivia', lastName: 'Martin', age: 46, visits: "2025-04-01", progress: 75, status: 'relationship' },
  { firstName: '77Liam', lastName: 'Jackson', age: 311123.439876, visits: "2025-05-01", progress: 80, status: 'single' },
  { firstName: '78Noah', lastName: 'Thompson', age: 34, visits: "2025-062-01", progress: 85, status: 'complicated' },
  { firstName: '', lastName: 'White', age: '', visits: '', progress: 90, status: 'relationship' },
  { firstName: '80Sophia1234567890123456 789001234567890 0123456789001234567890', lastName: 'Harris asdadsa dasdad dasdasdas dasdas 3456', age: '', visits: "2025-08-01", progress: 70, status: 'single' },

];

const columns1headercof = [
  {

    accessorKey: 'firstName',
    header: 'First Name',
    id: 'firstName',
    filterType: 'text',
    // footer: info => `Count: ${CountFooter(info.table)}`,
    footer: info => `Count: ${CountFooter(info.table)}`,
    cell: TextCell,
    //cell: (info) => info.getValue(),
    /**
     * override the value used for row grouping
     * (otherwise, defaults to the value derived from accessorKey / accessorFn)
     */
    getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: () => <span>Last Name</span>,
    filterType: 'text',
    cell: (info) => info.getValue(),
  },

  {
    accessorKey: 'age',
    id: 'age',
    header: () => 'Age',
    footer: (info) => <div style={{
      textAlign: 'right',
    }}>{`Sum: ${formatNumber(SumFooter(info.column, info.table), 0, 2)}`}</div>,
    filterType: 'number',
    cell: ({ cell }) => (
      <NumberCell
        initialValue={cell.getValue()}
        minFractionDigits={0}
        maxFractionDigits={4}
      />),


    aggregatedCell: ({ cell }) => (
      <NumberCell
        initialValue={cell.getValue()}
        minFractionDigits={0}
        maxFractionDigits={4}
      />),


    // aggregatedCell: ({ getValue }) =>
    //     Math.round(getValue<number>() * 100) / 100,
    aggregationFn: 'mean',
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: () => <span>Visits</span>,
    cell: DateCell,
    filterType: 'date',
    // aggregationFn: 'sum',
    aggregationFn: 'count',
    aggregatedCell: ({ cell }) => (
      <NumberCell
        initialValue={cell.getValue()}
        minFractionDigits={0}
        maxFractionDigits={4}
      />),
    //aggregatedCell: ({ getValue }) => getValue().toLocaleString(),
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    cell: TextCell,
    filterType: 'range',
  },
  {
    accessorKey: 'progress',
    id: 'progress',
    header: 'Profile Progress',
    filterType: 'number',
    footer: (info) => `Average: ${formatNumber(AverageFooter(info.column, info.table), 0, 2)}`,
    cell: ({ cell }) => (
      <NumberCell
        initialValue={cell.getValue()}
        minFractionDigits={0}
        maxFractionDigits={4}
      />),
    aggregationFn: 'mean',
    aggregatedCell: ({ cell }) => (
      <NumberCell
        initialValue={cell.getValue()}
        minFractionDigits={0}
        maxFractionDigits={4}
      />),
  },
]