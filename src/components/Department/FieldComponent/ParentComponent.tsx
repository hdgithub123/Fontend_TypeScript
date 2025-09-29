import { useEffect, useState } from "react";
import { getData, postData } from "../../../utils/axios";
import {
    SearchDropDown,
} from 'react-table'
import transformToSubRowsTree from "../../GeneralSubject/GeneralSubjectTreeComponent/transformToSubRowsTree";



const ParentComponent = ({ name, id, value, onChange, urlGet = urlGetList, columns = {} }) => {
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
            if (parentNode) {
                setParentCode(parentNode.code);
            } else {
                setParentCode(null);
            }
        } else {
            setParentCode(null);
        }


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
                cssStyleTable = {{width:'100%'}}
                onRowSelect={handleonRowSelect}
                onChangeGlobalFilter={handleGlobalFilterChange}
                columnDisplay={'code'}
                columnsShow={['code', 'name', 'description']}
                globalFilterValue={parentCode ? parentCode : ""}
                placeholder="Mã mục cha ..."
            >

            </SearchDropDown>
    )
}


export default ParentComponent;


