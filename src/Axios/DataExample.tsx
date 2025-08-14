import { useState } from 'react'
import getData from './getData'
import postData from './postData';
import deleteData from './deleteData';


const zoneId = '8e522402-3611-11f0-b432-0242ac110002'; //-- chi nhanh HCM-- con
//const zoneId = '8e4f3a13-3611-11f0-b432-0242ac110002'; // -- tong cong ty -- cha


const tmpBody = `{
  "username" : "admin",
  "password": "admin"
}`


const checkUser = `{
"fields":{ 
"id":"803fc59d-3404-11f0-9c72-0242ac110002",
"username": "061719",
"email":"vanvukieu2111@gmail.com"
},
"excludeField":"id"
}`

function FetchDataExample() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState(null);
  const [body, setBody] = useState(tmpBody);
  const [url, setUrl] = useState('http://localhost:3000/auth/zone/list');
  const [postUrl, setPostUrl] = useState('http://localhost:3000/auth/login');
  const urlRefreshToken = 'http://localhost:3000/auth/refresh-token';

const handleTestUserClick = () => {
  setPostUrl("http://localhost:3000/auth/user/check-user")
  setBody(checkUser)

}


  const handleClick = async () => {
    const token = sessionStorage.getItem('token');
    const newheaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      zone: zoneId,
      is_child_zone: true,
    };
    // setHeaders(`Authorization: ${token}`);

    setHeaders(newheaders);
    const result = await getData({ url: url, headers: newheaders, urlRefreshToken, isCookie: false });
    console.log("result", result)
    if (result) {
      setData(result);
      // setUrl(url==='http://localhost:3000/user/list'? 'https://datausa.io/api/data?drilldowns=Nation&measures=Population':'http://localhost:3000/user/list');
    } else {
      // setData('Lỗi khi lấy dữ liệu');
      //lấy token từ sessionStorage

    }
  }

  const handlePostClick = async () => {
     console.log("body", body);
    const parsedBody = body ? JSON.parse(body) : {};
    // const parsedHeaders = headers ? JSON.parse(headers) : {};
    
    console.log("headers", headers);
    const result = await postData({ url: postUrl, data: parsedBody, headers: headers, isCookie: true,urlRefreshToken });
     console.log("result222", result);
    
    if (result) {
      // lưu result.token vào sessionStorage
      sessionStorage.setItem('token', result.token);
      setData(result);
      // setHeaders(`Authorization: ${result.token}`);
      const newHeaders = {
        Authorization: `Bearer ${result.token}`,
        ...headers // Giữ nguyên các headers khác nếu cần
      };

      setHeaders(newHeaders);
    }
  }

  const handleLogout = async () => {
    const parsedBody = body ? JSON.parse(body) : {};
    const result = await postData({ url: "http://localhost:3000/auth/logout", data: parsedBody, headers: headers, isCookie: true });
    // Xóa token khỏi sessionStorage
    sessionStorage.removeItem('token');
    setData([]);
    setHeaders(null);
  }

  const handledeleteActiveLog = async () => {
    const result = await deleteData({ url: "http://localhost:3000/auth/activity-logs", data: {}, headers: headers, isCookie: true,urlRefreshToken });
    if (result) {
      setData(result);
    }
  }

  const handleChangeHeaders = (e) => {
    const { value } = e.target;
    setHeaders(value);
  }

  const getTokenToheader = async () => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      setHeaders(`Authorization: ${token}`);
    }
  }

  return (
    <>
      <h1> Fetch API</h1>
      <div>https://datausa.io/api/data?drilldowns=Nation&measures=Population</div>
      <div>http://localhost:3000/auth/user/list</div>
      <div>http://localhost:3000/auth/role/list</div>
      <div>http://localhost:3000/auth/login</div>
      <div>http://localhost:3000/auth/logout</div>
      <div>http://localhost:3000/auth/user-zone-role/list</div>
      <div>http://localhost:3000/auth/right/list</div>
      <div>http://localhost:3000/auth/role-right/list</div>
      <div>http://localhost:3000/auth/user/check-user</div>


      <div>http://localhost:3000/auth/refresh-token</div>
      <div>http://localhost:3000/auth/activity-logs</div>
       <button onClick={handleTestUserClick}>Click test user</button>
      <br />
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={handleClick}>Click me</button>
      <div>
        data: {JSON.stringify(data)}
      </div>
      <input type="text" value={postUrl} onChange={(e) => setPostUrl(e.target.value)} />
      <button onClick={handlePostClick}>POST me</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handledeleteActiveLog}>DeleteActivityLog</button>
      <br></br>
      <button onClick={getTokenToheader}>get token</button>
      <h1>Headers</h1>
      <textarea
        value={JSON.stringify(headers, null, 2)}
        onChange={handleChangeHeaders}
        rows={3}
        style={{ width: '100%', height: '50px', resize: 'none' }}
      />
      <h1>Body</h1>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        style={{ width: '100%', height: '50px', resize: 'none' }}
      />

    </>
  )
}

export default FetchDataExample