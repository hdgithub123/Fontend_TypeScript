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
    const [parentCode, setParentCode] = useState();

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


    useEffect(() => {
        // tìm ra parentCode từ listParent theo parentId = value.parentId với parentId = id của listParent
        if (value && value.parentId) {
            const findParent = (nodes, parentId) => {
                for (let node of nodes) {
                    if (node.id === parentId) {
                        return node;
                    }
                    if (node.subRows && node.subRows.length > 0) {
                        const found = findParent(node.subRows, parentId);
                        if (found) return found;
                    }
                }
                return null;
            };
            const parentNode = findParent(listParent, value.parentId);
            console.log("ParentComponent - parentNode: ", parentNode);
            if (parentNode) {
                setParentCode(parentNode.code);
               // onChange({ target: { name: '_parentCode', value: parentNode.code } });
            } else {
                setParentCode(null);
                // onChange({ target: { name: '_parentCode', value: null } });
            }
        } else {
            setParentCode(null);
            //onChange({ target: { name: '_parentCode', value: null } });
        }
 

    }, [value,listParent]);

    const handleonRowSelect = (row: any) => {
        onChange({ target: { name: name, value: row?.id || "" } });
    }


    return (
        <SearchDropDown
            data={listParent}
            columns={columns}
            onRowSelect={handleonRowSelect}
            // onChangeGlobalFilter={handleGlobalFilterChange}
            columnDisplay={'code'}
            columnsShow={['code', 'name', 'description']}
            globalFilterValue={parentCode ? parentCode : ""}
            placeholder="Mã mục cha ..."
        >

        </SearchDropDown>
    )
}


export default ParentComponent;


