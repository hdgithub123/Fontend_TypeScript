import { useEffect, useState } from "react";
import { getData, postData } from "../../../utils/axios";
import {
    SearchDropDown,
} from 'react-table'
import transformToSubRowsTree from "../../GeneralSubject/utils/transformToSubRowsTree";



const ParentComponent = ({ name, id, value, onChange, urlGet = urlGetList, columns = {}, disabled = false }) => {
    const [listParent, setListParent] = useState([]);
    const [listData, setListData] = useState([]);
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
                setListData(result.data);
            } else {
                setListParent([]);
            }
        };
        fetchData();
    }, [urlGet]);


    useEffect(() => {
        // tìm ra parentCode từ listParent theo parentId = value.parentId với parentId = id của listParent
        if (value && id) {
            const findNode = (nodes, id) => {
                for (let node of nodes) {
                    if (node.id === id) {
                        return node;
                    }
                    if (node.subRows && node.subRows.length > 0) {
                        const found = findNode(node.subRows, id);
                        if (found) return found;
                    }
                }
                return null;
            };
            const parentNode = findNode(listData, value[id]);

           
            if (parentNode) {
                setParentCode(parentNode.code);
            } else {
                setParentCode(null);
            }
        } else {
            setParentCode(null);
        }

        // if (value && codeKey) {
        //     setParentCode(value[codeKey]);
        // } else {
        //     setParentCode(null);
        // }

    }, [value, listParent]);



    const handleonRowSelect = (row: any) => {
        onChange({ target: { name: name, value: row?.id || "" } });
    }

    const handleGlobalFilterChange = (filter: string) => {
        if (parentCode && filter !== parentCode && filter === "") {
            onChange({ target: { name: name, value: null } });
        }
    }


    return (
        <SearchDropDown
            data={listParent}
            columns={columns}
            cssStyleTable={{ width: '100%' }}
            onRowSelect={handleonRowSelect}
            onChangeGlobalFilter={handleGlobalFilterChange}
            columnDisplay={'code'}
            columnsShow={['code', 'name', 'description']}
            globalFilterValue={parentCode ? parentCode : ""}
            placeholder="Mã mục cha ..."
            disabled={disabled}
        >

        </SearchDropDown>
    )
}


export default ParentComponent;


