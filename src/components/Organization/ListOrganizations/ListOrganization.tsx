import React, { useEffect, useState } from "react";

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

import OrganizationManagerForm from '../SingleOrganization/ManagerOrganizationForm/OrganizationManagerForm';
import columns from './colums'
import DesignPrint from '../../Print/DesignPrint/DesignPrint';
import PrintPreview from '../../Print/PrintPreview/PrintPreview';
import MakeReportTable from '../../MakeReportTable/MakeReportTable'
import ReactDOM from 'react-dom';
// import DesignPrint from "../../Print/DesignPrint/DesignPrint";
import PrintOrganizations from '../SingleOrganization/PrintOrganizations/PrintOrganizations'
import DashboardOrganizationsExcelInsertViewer from "../DashboardExcelImport/DashboardOrganizationsExcelInsertViewer/DashboardOrganizationsExcelInsertViewer";
import DashboardOrganizationsExcelUpdateViewer from "../DashboardExcelImport/DashboardOrganizationsExcelUpdateViewer/DashboardOrganizationsExcelUpdateViewer";
import DeleteOrganizations from "./DeleteOrganizations";
import NotifyNotSelectedButton from "./Notifibutton";
import styles from './ListOrganization.module.scss'
import AddForm from "../SingleOrganization/AddForm/AddForm";
import EditForm from "../SingleOrganization/EditForm/EditForm";


interface Organization {
  id?: string,
  code?: string;
  name?: string;
  address?: string;
  active?: boolean;
}



const authorizationExample = {
  view: true,
  add: true,
  update: true,
  delete: true,

  viewList: true,
  addList: true,
  updateList: true,
  deleteList: true,

  viewPrintDesign: true,
  addPrintDesign: true,
  updatePrintDesign: true,
  deletePrintDesign: true,

  viewPrintDesignList: true,
  addPrintDesignList: true,
  updatePrintDesignList: true,
  deletePrintDesignList: true,

  print: true,
  printList: true,

  exportExcel: true,
}


const authorizationExample2 = {
  view: true,
  add: false,
  update: false,
  delete: false,

  viewList: true,
  addList: false,
  updateList: false,
  deleteList: false,

  viewPrintDesign: false,
  addPrintDesign: false,
  updatePrintDesign: false,
  deletePrintDesign: false,

  viewPrintDesignList: false,
  addPrintDesignList: false,
  updatePrintDesignList: false,
  deletePrintDesignList: false,

  print: false,
  printList: false,
  exportExcel: false,
}



const ListOrganization = ({ authorization = authorizationExample }) => {
  const url: string = 'http://localhost:3000/auth/organization/list'
  const deleteUrl: string = 'http://localhost:3000/auth/organization/list'
  const urlCheckOrganization = 'http://localhost:3000/auth/organization/check-organization'
  const urlInsertOrganization = 'http://localhost:3000/auth/organization/detail/insert'
  const urlUpdateOrganization = 'http://localhost:3000/auth/organization/detail'
  const urlDeleteOrganization = 'http://localhost:3000/auth/organization/detail'

  const [data, setData] = useState<Array<{ [key: string]: any }>>([{}]);
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [isShowAddForm, setIsShowAddForm] = useState(false);
  const [isShowEditForm, setIsShowEditForm] = useState(false);
  const [isPrintListDesign, setIsPrintListDesign] = useState(false);
  const [isPrintList, setIsPrintList] = useState(false);
  const [isImportExcel, setIsImportExcel] = useState(false);
  const [isUpdateExcel, setIsUpdateExcel] = useState(false);
  const [isPrintMoreOrganizations, setIsPrintMoreOrganizations] = useState(false);
  const [selectOrganizations, setSelectOrganizations] = useState<any[]>([]);



  const handleGetOrganization = async () => {
    if (authorization.viewList) {
      const result = await getData({ url: url });
      if (result.data) {
        setData(result.data);
      }
    } else {
      setData([])
    }

  }


  useEffect(() => {
    if (authorization.viewList) {
      handleGetOrganization();
    } else {
      setData([]);
    }

  }, []);

  const handleOnRowSelect = (value) => {
    setActiveOrganization(value);
    setIsShowEditForm(true);

  }
  const handleOnRowsSelect = (value) => {
    setSelectOrganizations(value)
  }

  const handleOnSuccess = (data) => {
    if (data.action === 'insert' || data.action === 'update' || data.action === 'delete') {
      handleGetOrganization();
    }
    setActiveOrganization(null);
    setIsShowAddForm(false);
    setIsShowEditForm(false);
  }

  const handleCreateOrganization = () => {
    setActiveOrganization(null);
    setIsShowAddForm(true);
  }

  const handleDuplicateOrganization = () => {
    if (selectOrganizations.length === 1) {
      const { id, ...rest } = selectOrganizations[0]; // bỏ id
      const duplicateOrganization = {
        ...rest,
        code: 'copy-' + rest.code,
      };
      setActiveOrganization(duplicateOrganization);
      setIsShowAddForm(true);
      setIsShowEditForm(false); // đảm bảo không bật cả 2 form
    }

  }

  const handlePrintListDesignOrganization = () => {
    setIsPrintListDesign(true)
  }

  const handleOnCancelDesign = (cancel: boolean) => {
    setIsPrintListDesign(!cancel)
  }

  const handlePrintListOrganization = () => {
    setIsPrintList(true)
  }

  const handleOnCancelPrint = (cancel: boolean) => {
    setIsPrintList(!cancel)
  }

  const handlePrintMoreOrganizations = () => {
    setIsPrintMoreOrganizations(true)

  }

  const handleImportExcel = () => {
    setIsImportExcel(true)
  }

  const handleUpdateExcel = () => {
    setIsUpdateExcel(true)
  }



  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Quản lý Tổ chức</h1>
      <div className={styles.buttonGroup}>
        {authorization.viewList && <button onClick={handleGetOrganization} className={styles.buttonGet} >Refresh</button>}
        {authorization.add && <button onClick={handleCreateOrganization} className={styles.buttonCreate} >Add New</button>}
        {authorization.add && <button disabled={selectOrganizations.length !== 1} onClick={handleDuplicateOrganization} className={styles.buttonDuplicate} >Duplicate</button>}

        {authorization.viewPrintDesignList && <NotifyNotSelectedButton className={styles.buttonDesign} data={selectOrganizations} onTrigger={handlePrintListDesignOrganization} >
          Design Print list
        </NotifyNotSelectedButton>}
        {authorization.printList && <NotifyNotSelectedButton className={styles.buttonPrint} data={selectOrganizations} onTrigger={handlePrintListOrganization} > Print list</NotifyNotSelectedButton>}
        {authorization.print && <NotifyNotSelectedButton className={styles.buttonPrintMore} data={selectOrganizations} onTrigger={handlePrintMoreOrganizations} > Print more</NotifyNotSelectedButton>}
        {authorization.deleteList && <DeleteOrganizations
          deleteUrl={deleteUrl}
          selectOrganizations={selectOrganizations}
          setSelectOrganizations={setSelectOrganizations}
          setData={setData}
          className={styles.buttonDelete}
        />}
        {authorization.addList && <button onClick={handleImportExcel} className={styles.buttonImport}>Add by Excel</button>}
        {authorization.updateList && <button onClick={handleUpdateExcel} className={styles.buttonUpdate}>Update by Excel</button>}
      </div>


      {authorization.viewList && <div className={styles.tableContainer}>
        <ReactTableBasic
          data={data}
          columns={columns}
          isGlobalFilter={true}
          onOriginalRowSelect={handleOnRowSelect}
          onOriginalRowsSelect={handleOnRowsSelect}
          fieldUnique={'id'}
          exportFile={authorization.exportExcel ? { name: "Organization.xlsx", sheetName: "Sheet1", title: "Danh sách tổ chức", description: null } : null}
        //exportFile={authorization.exportExcel ? undefined : null}
        >
        </ReactTableBasic>
      </div>}
      <div className={styles.childContainer}>

        {isShowAddForm && authorization.view && <AddForm
          urlCheckOrganization={urlCheckOrganization}
          urlInsertOrganization={urlInsertOrganization}
          organization={activeOrganization}
          onSuccess={handleOnSuccess}
          authorization={authorization}
        />}
        {isShowEditForm && authorization.view && <EditForm
          urlUpdateOrganization={urlUpdateOrganization}
          urlDeleteOrganization={urlDeleteOrganization}
          organization={activeOrganization}
          onSuccess={handleOnSuccess}
          authorization={authorization}
        />}

        {isPrintListDesign && authorization.viewPrintDesignList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
            <DesignPrint
              urlGet="http://localhost:3000/template-contents/organizations/list"
              urlUpdate="http://localhost:3000/template-contents/organizations/detail"
              urlDelete="http://localhost:3000/template-contents/organizations/detail"
              urlInsert="http://localhost:3000/template-contents/organizations/detail/insert"
              dynamicTables={{
                organization: selectOrganizations
              }}
              // contentStateObject={blockOrganization}
              onCancel={handleOnCancelDesign}
              title="Thiết Kế Mẫu In Danh Sách Tổ Chức"
              authorization={{
                add: authorization.addPrintDesignList,
                update: authorization.updatePrintDesignList,
                delete: authorization.deletePrintDesignList,
                view: authorization.viewPrintDesignList,
              }}
            >
            </DesignPrint>

          </div>, document.body)
        }


        {isPrintList && authorization.printList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <PrintPreview
              // dynamicTexts={userData}
              dynamicTables={{
                organization: selectOrganizations
              }}
              // contentStateObject={blockOrganization}
              urlGet="http://localhost:3000/template-contents/organizations/list"
              onCancel={handleOnCancelPrint}
            >
            </PrintPreview>

          </div>, document.body)
        }

        {isPrintMoreOrganizations && authorization.print &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <PrintOrganizations
              data={selectOrganizations}
              // dynamicTexts={userData}
              // dynamicTables={{
              //   user: data
              // }}
              // contentStateObject={blockOrganization}
              urlGet="http://localhost:3000/template-contents/organization/list"
              onCancel={() => {
                setIsPrintMoreOrganizations(false)
              }}
            >
            </PrintOrganizations>

          </div>, document.body)
        }


        {isImportExcel && authorization.addList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardOrganizationsExcelInsertViewer
              // onCheckUpload={(data)=>{
              //   console.log("data",data)
              // }}
              urlPost={url}
              onCancel={() => {
                setIsImportExcel(false)
              }}
              onDone={() => {
                setIsImportExcel(false)
                handleGetOrganization()
              }}
            >
            </DashboardOrganizationsExcelInsertViewer>

          </div>, document.body)
        }
        {isUpdateExcel && authorization.updateList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardOrganizationsExcelUpdateViewer
              // onCheckUpload={(data)=>{
              //   console.log("data",data)
              // }}
              urlPost={url}
              onCancel={() => {
                setIsUpdateExcel(false)
              }}
              onDone={() => {
                setIsUpdateExcel(false)
                handleGetOrganization()
              }}
            >
            </DashboardOrganizationsExcelUpdateViewer>

          </div>, document.body)
        }

      </div>
    </div>
  );
};

export default ListOrganization;