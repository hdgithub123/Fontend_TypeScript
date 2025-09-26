import { useEffect, useState } from "react";
import { getData, postData } from "../../../utils/axios";
import {
    SearchDropDown,
} from 'react-table'
import transformToSubRowsTree from "../../GeneralSubjectTreeComponent/transformToSubRowsTree";

import columns from "./colums";


const ParentComponent = ({ name, id, value, onChange }) => {
    const urlGet = 'http://localhost:3000/auth/department/list';
    const [listParent, setListParent] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData({ url: urlGet });
            if (result.status) {
                const subrowsData = transformToSubRowsTree({
                    data: result.data,
                    childField: 'id',
                    parentField: 'parentId',
                });
                setListParent(subrowsData);
            } else {
                setListParent([]);
            }
        };
        fetchData();
    }, [urlGet]);


    const handleonRowSelect = (row: any) => {
        onChange({ target: { name: 'parentId', value: row?.id || "" } });
    }


    return (
        <SearchDropDown
            data={listParent}
            columns={columns}
            onRowSelect={handleonRowSelect}
            // onChangeGlobalFilter={handleGlobalFilterChange}
            columnDisplay={'code'}
            columnsShow={['code', 'name', 'description']}
            globalFilterValue={value._parentCode ? value._parentCode : ""}
            placeholder="Mã mục cha ..."
        >

        </SearchDropDown>
    )
}


export default ParentComponent;


