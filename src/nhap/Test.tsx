import { useState } from 'react'
import {
    getData,
    postData,
    getAuthHeaders,
    putData,
    deleteData,
    patchData
} from '../utils/axios';

import columns from './thamso';
const urlList = [
    "http://localhost:3000/auth/activity-logs",
    'http://localhost:3000/auth/user/list',
    "http://localhost:3000/auth/role/list",
    "http://localhost:3000/auth/user-zone-role/list",
    "http://localhost:3000/auth/role-right/role-rights/98c147db-87f8-11f0-9b37-0242ac110002",
    "",
    "",
]


import ButtonExcelUploader from '../utils/UploadExcel/ButtonExcelUploader/ButtonExcelUploader'
import DashboardExcelUploadViewer from '../utils/UploadExcel/DashboardExelUploader/DashboardExcelUploadViewer'
import {columnsUser,userSchema, columnCheckExistance, columnCheckNotExistance } from './thamso'
import {
    messagesVi,
    messagesEn, 
    validateField,
    validateDataArray,
    validateTablesDataArray
} from '../utils/validation/index'

import { useDispatch, useSelector } from 'react-redux';


function Test() {
    const [data, setData] = useState('');
    const [body, setBody] = useState('{}');
    const [url, setUrl] = useState('http://localhost:3000/auth/activity-logs');
    const urlLogin = 'http://localhost:3000/auth/login';
    const urlRefreshToken = 'http://localhost:3000/auth/refresh-token';

    const user = useSelector((state: any) => state.user);



    const handleGetClick = async () => {
        const result = await getData({ url: url, headers: getAuthHeaders(), urlRefreshToken, isCookie: false });
        console.log(result);
        setData(result.data);
            console.log('User from Redux store:', user);
    };

    const handlePostClick = async () => {
        const result = await postData({ url: url, data: body, headers: getAuthHeaders(), urlRefreshToken, isCookie: false });
        console.log(result);
        setData(result.data);
    }

    const handleDeleteClick = async () => {
        const parsedBody = body ? JSON.parse(body) : {};
        const result = await deleteData({ url: url, data: parsedBody, headers: getAuthHeaders(), urlRefreshToken, isCookie: false });
        console.log(result);
        // setData(result.data);
        setData({});
    }



    const handlePutClick = async () => {
        const result = await putData({ url: url, data: body, headers: getAuthHeaders(), urlRefreshToken, isCookie: false });
        console.log(result);
        setData(result.data);
    }




    return (
        <div>
            <h1>data</h1>
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                style={{ width: '100%', height: '50px', resize: 'none' }}
            />


            <h1>test</h1>
            <label htmlFor="url-select">Chọn URL:</label>
            <select
                id="url-select"
                value={url || ""}
                onChange={(e) => setUrl(e.target.value)}
                style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '100%' }}
            >
                {urlList.map((url, index) => (
                    <option key={index} value={url}>
                        {url}
                    </option>
                ))}
            </select>
            <br />

            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} style={{ width: '100%' }} />
            <button onClick={handleGetClick}>Get me</button>
            <button onClick={handlePostClick}>Post me</button>
            <button onClick={handleDeleteClick}>Delete me</button>
            <button onClick={handlePutClick}>Put me</button>
            <button onClick={() => setData("")}>clear me</button>
            <p>data: {JSON.stringify(data)}</p>
        </div>
    );
}

export default Test;