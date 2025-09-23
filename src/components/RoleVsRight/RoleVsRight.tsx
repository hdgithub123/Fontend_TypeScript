import { useEffect, useState } from "react";
import {
  getData,
  postData,
  putData,
  deleteData,
  patchData
} from '../../utils/axios'


import {
  ReactTableBasic,
  SearchDropDown,
  ReactTableNomalArrowkey,
} from 'react-table'

import styles from './RoleVsRight.module.scss'
import { columns as columsRight, columnsAssign as columnsRightAssign } from "./columsRight";
import columnsRole from "./columsRole"
import { AlertDialog } from "../../utils/AlertDialog";
import type { AlertInfo } from "../../utils/AlertDialog";
import { e, re } from "mathjs";

enum AssignType {
  Assigned = 'ASSIGNED',
  Unassigned = 'UNASSIGNED',
  Authorization = 'AUTHORIZATION'
}


const RoleVsRight = (authorization) => {
  const getRightsformRoleUrl = 'http://localhost:3000/auth/role-right/role-rights'; // cần thêm /id
  const getRightNotHaveRoleUrl = 'http://localhost:3000/auth/role-right/role-not-have-rights'; // cần thêm /id
  const urlGetRoleList = 'http://localhost:3000/auth/role/list';
  const urlUpdateRoleRights = 'http://localhost:3000/auth/role-right/list';
  const urlInsertRoleRights = 'http://localhost:3000/auth/role-right/list';
  const urlDeleteRoleRights = 'http://localhost:3000/auth/role-right/list';


  const [searchRoles, setSearchRoles] = useState<string>("");
  const [searchRights, setSearchRights] = useState<string>("");
  const [selectedRights, setSelectedRights] = useState<Record<string, any>[]>([]);
  const [currentRole, setCurrentRole] = useState<Record<string, any> | null>(null);
  const [copyRole, setCopyRole] = useState<Record<string, any> | null>(null);
  const [assignType, setAssignType] = useState<AssignType>(AssignType.Authorization);
  const [isShowCopyRole, setIsShowCopyRole] = useState<boolean>(false);


  const handleDataChange = (data: any) => {
    setSearchRights(data);
  };



  const handleGetRoles = async () => {
    const result = await getData({ url: urlGetRoleList });
    if (result.data) {
      setSearchRoles(result.data);
    }
  }


  useEffect(() => {
    handleGetRoles();
  }, []);


  const handleonRowRoleSelect = async (row: any) => {
    const idRole = row.id

    const getUrl = assignType === AssignType.Assigned ? getRightNotHaveRoleUrl : getRightsformRoleUrl;

    const result = await getData({ url: `${getUrl}/${idRole}` });
    if (result.status) {
      setSearchRights(result.data);
    }
    setCurrentRole(row);
  };

  const handleonRowCopyRoleSelect = async (row: any) => {
    setCopyRole(row);
  }


  const handleAssignTypeChange = async (e) => {
    setAssignType(e.target.value as AssignType)
    const idRole = currentRole?.id;
    if (!idRole) {
      setSearchRights([]);
      return;
    }

    const getUrl = e.target.value !== AssignType.Assigned ? getRightsformRoleUrl : getRightNotHaveRoleUrl;
    const result = await getData({ url: `${getUrl}/${idRole}` });
    if (result.status) {
      setSearchRights(result.data);
    }
    setSelectedRights([]);
  };


  const handleUpdate = async () => {
    if (assignType === AssignType.Authorization) {
      if (!currentRole) {
        setAlertinfo({
          isAlertShow: true,
          alertMessage: "Vui lòng chọn vai trò trước khi cập nhật.",
          type: "error",
          title: "Lỗi",
          showConfirm: false,
          showCancel: true,
          onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
          onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))

        });
        return;
      }

      setAlertinfo({
        isAlertShow: true,
        alertMessage: "Bạn có muốn cập nhật quyền không?",
        type: "info",
        title: "Câp nhật quyền",
        showConfirm: true,
        onConfirm: async () => {
          if (assignType === AssignType.Authorization) {
            const updatedRoleRights = searchRights.map((right) => ({
              roleId: currentRole.id,
              rightId: right.id,
              isActive: right.isActive,
            }));


            const result = await putData({
              url: urlUpdateRoleRights,
              data: updatedRoleRights
            });

            if (result.status) {
              setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
            } else {
              setAlertinfo(
                ({
                  isAlertShow: true,
                  alertMessage: "Cập nhật quyền thất bại.",
                  type: "error",
                  title: "Lỗi",
                  showCancel: true,
                  onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
                  onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
                })
              );
            }
          }

        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        showCancel: true,
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
      });
    } else {
      return;
    }
  };

  const handleAssign = async () => {

    if (assignType === AssignType.Assigned) {
      if (!currentRole) {
        setAlertinfo({
          isAlertShow: true,
          alertMessage: "Vui lòng chọn vai trò trước khi thêm quyền.",
          type: "error",
          title: "Lỗi",
          showConfirm: false,
          showCancel: true,
          onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
          onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))

        });
        return;
      }

      if (selectedRights.length === 0) {
        setAlertinfo({
          isAlertShow: true,
          alertMessage: "Vui lòng chọn ít nhất một quyền để gán.",
          type: "error",
          title: "Lỗi",
          showConfirm: false,
          showCancel: true,
          onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
          onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
        });
        return;
      }

      setAlertinfo({
        isAlertShow: true,
        alertMessage: "Bạn có muốn thêm quyền không?",
        type: "info",
        title: "Thêm quyền",
        showConfirm: true,
        showCancel: true,
        onConfirm: async () => {
          const insertRoleRight = selectedRights.map((right) => ({
            roleId: currentRole.id,
            rightId: right.id,
            isActive: false,
          }));

          const result = await postData({
            url: urlInsertRoleRights,
            data: insertRoleRight
          });
          if (result.status) {
            // xóa bỏ các quyền đã chọn khỏi danh sách hiển thị
            const remainingRights = searchRights.filter(right => !selectedRights.some(selected => selected.id === right.id));
            setSearchRights(remainingRights);
            setSelectedRights([]);
            setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
          } else {
            setAlertinfo({
              isAlertShow: true,
              alertMessage: "Thêm quyền thất bại.",
              type: "error",
              title: "Lỗi",
              showCancel: true,
              onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
              onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
            });
          }
        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
      });
    } else {
      return;
    }
  }


  const handleUnassign = async () => {
    if (assignType === AssignType.Unassigned) {
      if (!currentRole) {
        setAlertinfo({
          isAlertShow: true,
          alertMessage: "Vui lòng chọn vai trò trước khi bỏ quyền.",
          type: "error",
          title: "Lỗi",
          showConfirm: false,
          showCancel: true,
          onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
          onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))

        });
        return;
      }

      if (selectedRights.length === 0) {
        setAlertinfo({
          isAlertShow: true,
          alertMessage: "Vui lòng chọn ít nhất một quyền để bỏ.",
          type: "error",
          title: "Lỗi",
          showConfirm: false,
          showCancel: true,
          onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
          onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
        });
        return;
      }




      setAlertinfo({
        isAlertShow: true,
        alertMessage: "Bạn có muốn bỏ quyền không?",
        type: "info",
        title: "Bỏ quyền",
        showConfirm: true,
        showCancel: true,
        onConfirm: async () => {
          // lấy danh sách [roleId, rightId] để xóa
          const deleteAuthorization = selectedRights.map((right) => ({
            roleId: currentRole.id,
            rightId: right.id,
            isActive: false,
          }));

          const result = await deleteData({
            url: urlDeleteRoleRights,
            data: deleteAuthorization,

          });

          if (result.status) {
            const remainingRights = searchRights.filter(right => !selectedRights.some(selected => selected.id === right.id));
            setSearchRights(remainingRights);
            setSelectedRights([]);
            setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
          } else {
            setAlertinfo({
              isAlertShow: true,
              alertMessage: "Bỏ quyền thất bại.",
              type: "error",
              title: "Lỗi",
              showCancel: true,
              onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
              onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
            });
          }
        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
      });
    } else {
      return;
    }
  }


  const handleCopyRole = async () => {
    if (assignType === AssignType.Authorization) {
      if (!currentRole || !copyRole) {
        setAlertinfo({
          isAlertShow: true,
          alertMessage: "Vui lòng chọn vai trò trước khi sao chép quyền.",
          type: "error",
          title: "Lỗi",
          showConfirm: false,
          showCancel: true,
          onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
          onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
        });
        return;
      }

      setAlertinfo({
        isAlertShow: true,
        alertMessage: `Bạn có muốn sao chép quyền từ vai trò ${copyRole.code} sang vai trò ${currentRole.code} không?`,
        type: "info",
        title: "Sao chép quyền",
        showConfirm: true,
        showCancel: true,
        onConfirm: async () => {
          const updatedRoleRights = searchRights.map((right) => ({
            roleId: copyRole.id,
            rightId: right.id,
            isActive: right.isActive,
          }));


          const result = await putData({
            url: urlUpdateRoleRights,
            data: updatedRoleRights
          });

          console.log("result", result);
          if (result.status) {
            setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
            setIsShowCopyRole(false)
          } else {
            setAlertinfo({
              isAlertShow: true,
              alertMessage: "Cập nhật quyền thất bại.",
              type: "error",
              title: "Lỗi",
              showCancel: true,
              onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
              onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
            });
          }



        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
      });

    } else {
      return;
    }

    setIsShowCopyRole(false);
  };

  const handleOnRowsSelect = (rows: any[]) => {
    setSelectedRights(rows);
  };


  const [alertinfo, setAlertinfo] = useState<AlertInfo>({
    isAlertShow: false,
    alertMessage: '',
    type: 'error',
    title: 'Lỗi',
    showConfirm: true,
    showCancel: true
  });



  return (
    <div className={styles.container}>
      <AlertDialog
        type={alertinfo.type || "error"}
        title={alertinfo.title || "Lỗi"}
        message={alertinfo.alertMessage || ""}
        show={alertinfo.isAlertShow || false}
        onClose={alertinfo.onClose ?? (() => { })}
        onConfirm={alertinfo.onConfirm ?? (() => { })}
        onCancel={alertinfo.onCancel ?? (() => { })}
        showConfirm={alertinfo.showConfirm ?? true}
        showCancel={alertinfo.showCancel ?? true}
      />
      <h2 className={styles.title}>Danh sách phân quyền</h2>
      <div className={styles.buttonGroup}>
        <select
          value={assignType}
          onChange={handleAssignTypeChange}
          className={styles.selectBox}
        >
          <option value={AssignType.Authorization}>Phân quyền</option>
          <option value={AssignType.Unassigned}>Bỏ quyền</option>
          <option value={AssignType.Assigned}>Thêm quyền</option>
        </select>
       {AssignType.Authorization === assignType && <button onClick={handleUpdate} className={`${styles.button} ${styles.updateButton}`}>Cập nhật</button>}
       {AssignType.Assigned === assignType && <button onClick={handleAssign} className={`${styles.button} ${styles.assignButton}`}>Thêm quyền</button>}
       {AssignType.Unassigned === assignType && <button onClick={handleUnassign} className={`${styles.button} ${styles.unassignButton}`}>Bỏ quyền</button>}
       {AssignType.Authorization === assignType && <button onClick={() => setIsShowCopyRole(true)} className={`${styles.button} ${styles.copyButton}`}>Sao chép vai trò</button>}
      </div>
      
      <div className={styles.inputGroup}>
        <div>
          <SearchDropDown
            data={searchRoles}
            columns={columnsRole}
            onRowSelect={handleonRowRoleSelect}
            // onChangeGlobalFilter={handleGlobalFilterChange}
            columnDisplay={'code'}
            columnsShow={['code', 'name', 'description']}
            globalFilterValue={currentRole?.code || ""}
            className={styles.inputField}
            placeholder="Mã vai trò..."
            autocomplete="new-password"
          >
          </SearchDropDown>
        </div>


        <input
          type="text"
          className={styles.inputField}
          placeholder={"Tên vai trò..."}
          value={currentRole?.name || ""}
          disabled={true}
        ></input>

        <input
          type="text"
          className={styles.inputField}
          placeholder={"Mô Tả..."}
          value={currentRole?.description || ""}
          disabled={true}
        ></input>


      </div>
      {isShowCopyRole && <div className={styles.copyRoleContainer}>
        <h3 className={styles.title}>Chọn vai trò muốn sao chép</h3>
        <SearchDropDown
          data={searchRoles}
          columns={columnsRole}
          onRowSelect={handleonRowCopyRoleSelect}
          // onChangeGlobalFilter={handleGlobalFilterChange}
          columnDisplay={'code'}
          columnsShow={['code', 'name', 'description']}
          globalFilterValue={copyRole?.code || ""}
          className={styles.inputField}
          placeholder="Mã vai trò cần sao chép..."
          autocomplete="new-password"
        >
        </SearchDropDown>

        <input
          type="text"
          className={styles.inputField}
          placeholder={"Tên vai trò..."}
          value={copyRole?.name || ""}
          disabled={true}
        ></input>

        <input
          type="text"
          className={styles.inputField}
          placeholder={"Mô Tả..."}
          value={copyRole?.description || ""}
          disabled={true}
        ></input>
        <div className={styles.buttonCopyGroup}>
          <button onClick={handleCopyRole} className={`${styles.button} ${styles.copyButton}`}>Sao chép vai trò</button>
          <button onClick={() => setIsShowCopyRole(false)} className={`${styles.button} ${styles.closeButton}`}>Đóng</button>
        </div>

      </div>
      }
      <div className={styles.tableContainer}>
        <ReactTableBasic
          data={searchRights}
          columns={assignType === AssignType.Authorization ? columsRight : columnsRightAssign}
          isGlobalFilter={true}
          // onOriginalRowSelect={handleOnRowSelect}
          onOriginalRowsSelect={handleOnRowsSelect}
          onDataChange={handleDataChange}
          // fieldUnique={'id'}
          exportFile={null}
        >
        </ReactTableBasic>
      </div>

    </div>
  );
};
export default RoleVsRight;