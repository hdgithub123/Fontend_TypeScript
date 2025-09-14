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



interface Organization {
  id: string,
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
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
  addPrintDesign: false,
  updatePrintDesign: false,
  deletePrintDesign: false,

  viewPrintDesignList: true,
  addPrintDesignList: false,
  updatePrintDesignList: false,
  deletePrintDesignList: false,

  print: true,
  printList: true,

  exportExcel: false,
}


const authorizationExample2 = {
  view: false,
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
  const [data, setData] = useState<Array<{ [key: string]: any }>>([{}]);
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [isShowManagerForm, setIsShowManagerForm] = useState(false);
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
    setIsShowManagerForm(true);

  }
  const handleOnRowsSelect = (value) => {
    console.log(value)
    setSelectOrganizations(value)
  }

  const handleOnSuccess = (data) => {
    if (data.action === 'insert' || data.action === 'update' || data.action === 'delete') {
      handleGetOrganization();
    }
    setIsShowManagerForm(false);
  }

  const handleCreateOrganization = () => {
    setActiveOrganization(null);
    setIsShowManagerForm(true);
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
        {authorization.viewList && <button disabled={!authorization.viewList} onClick={handleGetOrganization} className={styles.buttonGet} >Refresh</button>}
        {authorization.add && <button disabled={!authorization.add} onClick={handleCreateOrganization} className={styles.buttonCreate} >Add New</button>}

        {authorization.viewPrintDesignList && <NotifyNotSelectedButton disabled={!authorization.viewPrintDesignList} className={styles.buttonDesign} data={selectOrganizations} onTrigger={handlePrintListDesignOrganization} >
          Design Print list
        </NotifyNotSelectedButton>}
        {authorization.printList && <NotifyNotSelectedButton disabled={!authorization.printList} className={styles.buttonPrint} data={selectOrganizations} onTrigger={handlePrintListOrganization} > Print list</NotifyNotSelectedButton>}
        {authorization.print && <NotifyNotSelectedButton disabled={!authorization.print} className={styles.buttonPrintMore} data={selectOrganizations} onTrigger={handlePrintMoreOrganizations} > Print more</NotifyNotSelectedButton>}
        {authorization.deleteList && <DeleteOrganizations
          deleteUrl={deleteUrl}
          selectOrganizations={selectOrganizations}
          setSelectOrganizations={setSelectOrganizations}
          setData={setData}
          className={styles.buttonDelete}
          disabled={!authorization.deleteList}
        />}
        {authorization.addList && <button disabled={!authorization.addList} onClick={handleImportExcel} className={styles.buttonImport}>Add by Excel</button>}
        {authorization.updateList && <button disabled={!authorization.updateList} onClick={handleUpdateExcel} className={styles.buttonUpdate}>Update by Excel</button>}
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
        {isShowManagerForm && authorization.view && <OrganizationManagerForm
          organization={activeOrganization}
          onSuccess={handleOnSuccess}
          authorization={authorization}
        ></OrganizationManagerForm>}

        {isPrintListDesign && authorization.viewPrintDesignList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
            <DesignPrint
              urlGet="http://localhost:3000/template-contents/organizations/list"
              urlUpdate="http://localhost:3000/template-contents/organizations/detail"
              urlDelete="http://localhost:3000/template-contents/organizations/detail"
              urlInsert="http://localhost:3000/template-contents/organizations/detail/insert"
              dynamicTables={{
                organization: data
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