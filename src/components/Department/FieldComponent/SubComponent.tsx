import { useEffect, useState } from "react";
import { getData, postData } from "../../../utils/axios";
import {
    SearchDropDown,
} from 'react-table'


const SubComponent = ({ name, id, value, onChange, urlGet = '', columns = {} }) => {
    const [listData, setListData] = useState([]);
    const [currentCode, setCurrentCode] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData({ url: urlGet });
            if (result.status) {
                setListData(result.data);
            } else {
                setListData([]);
            }
        };
        fetchData();
    }, [urlGet]);

    useEffect(() => {
        // tìm ra currentCode từ listData theo value.[id] với id = id của listData
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
            const currentNode = findNode(listData, value[id]);
            if (currentNode) {
                setCurrentCode(currentNode.code);
            } else {
                setCurrentCode(null);
            }
        } else {
            setCurrentCode(null);
        }

    }, [value, listData]);

    const handleonRowSelect = (row: any) => {
        onChange({ target: { name: name, value: row?.id || "" } });
    }


    const handleGlobalFilterChange = (filter: string) => {
        if (currentCode && filter !== currentCode && filter === "") {
            onChange({ target: { name: name, value: null } });
        }
    }


    return (
        <SearchDropDown
            data={listData}
            columns={columns}
            cssStyleTable = {{width:'100%'}}
            onRowSelect={handleonRowSelect}
            onChangeGlobalFilter={handleGlobalFilterChange}
            columnDisplay={'code'}
            columnsShow={['code', 'name', 'description']}
            globalFilterValue={currentCode ? currentCode : ""}
            placeholder="Mã ..."
        >

        </SearchDropDown>
    )
}


export default SubComponent;


