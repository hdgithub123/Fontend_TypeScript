import React, { useEffect, useState } from "react";

// ...existing code...
import {
  ReactTableBasic,
} from 'react-table'


import {
  getData,
  postData,
  putData,
  deleteData,
  patchData
} from '../../../utils/axios'


import DesignPrint from '../../Print/DesignPrint/DesignPrint';
import PrintPreview from '../../Print/PrintPreview/PrintPreview';
import MakeReportTable from '../../MakeReportTable/MakeReportTable'
import ReactDOM from 'react-dom';
// import DesignPrint from "../../Print/DesignPrint/DesignPrint";
import PrintSubjects from '../PrintSubjects/PrintSubjects'
import DashboardSubjectsExcelInsertViewer from "../DashboardExcelImport/DashboardSubjectsExcelInsertViewer/DashboardSubjectsExcelInsertViewer";
import DashboardSubjectsExcelUpdateViewer from "../DashboardExcelImport/DashboardSubjectsExcelUpdateViewer/DashboardSubjectsExcelUpdateViewer";
import DeleteSubjects from "./DeleteSubjects";
import NotifyNotSelectedButton from "./Notifibutton";
import styles from './ListSubject.module.scss'
//import AddForm from "../SingleSubject/AddFormDefault/AddFormDefault";
//import EditForm from "../SingleSubject/EditForm/EditFormDefault";
import insertExcelSetting from "../DashboardExcelImport/DashboardSubjectsExcelInsertViewer/setting";
import updateExcelSetting from "../DashboardExcelImport/DashboardSubjectsExcelUpdateViewer/setting";
import type { RuleSchema } from "../../../utils/validation";



interface Subject {
  [key: string]: any;
}

interface authorization {
  view?: boolean;
  add?: boolean;
  update?: boolean;
  delete?: boolean;

  viewList: boolean;
  addList?: boolean;
  updateList?: boolean;
  deleteList?: boolean;

  viewPrintDesign?: boolean;
  addPrintDesign?: boolean;
  updatePrintDesign?: boolean;
  deletePrintDesign?: boolean;

  viewPrintDesignList?: boolean;
  addPrintDesignList?: boolean;
  updatePrintDesignList?: boolean;
  deletePrintDesignList?: boolean;

  print: boolean;
  printList: boolean;

  exportExcel: boolean;
};

interface fullUrlList {
  urlGetList?: string;
  urlDeleteList?: string;
  urlPostList?: string;
  urlPutList?: string;
  urlCheck?: string;
  urlUpdate?: string;
  urlDelete?: string;
  urlInsert?: string;

  urlGetPrintContent?: string;
  urlUpdatePrintDesign?: string;
  urlDeletePrintDesign?: string;
  urlInsertPrintDesign?: string;

  urlGetPrintContents?: string;
  urlUpdatePrintDesigns?: string;
  urlDeletePrintDesigns?: string;
  urlInsertPrintDesigns?: string;
}



interface exportFileInfo {
  name: string;
  sheetName: string;
  title: string;
  description: string | null;

}


interface ColumnConfig {
  id: string;
  header: string;
  cell?: any;
  [key: string]: any; // Cho phép thêm các thuộc tính bất kỳ
};

interface ColumnValidationConfig {
  columnNames: Record<string, string>; // { excelField: dbField }
  urlCheck: string;
  excludeField?: string; // tên field trong db để loại trừ khi so sánh
};


interface configExcelInsertSetting {
  columns: ColumnConfig[];
  ruleSchema: RuleSchema;
  columnCheckExistance: ColumnValidationConfig[];
  columnCheckNotExistance: ColumnValidationConfig[];
  sheetName: string;
  fileName: string;
  guideSheet: string;
  title: string;
};



interface ListIdsConfig {
  url: string,
  fieldGet: string,
  fieldGive: string,
  fieldSet: string,
}


interface configExcelUpdateSetting {
  columns: ColumnConfig[];
  ruleSchema: RuleSchema;
  columnCheckExistance: ColumnValidationConfig[];
  columnCheckNotExistance: ColumnValidationConfig[];
  ListIdsConfig: ListIdsConfig;
  sheetName: string;
  fileName: string;
  guideSheet: string;
  title: string;
};



const authorizationFalse = {
  view: false,
  add: false,
  update: false,
  delete: false,

  viewList: false,
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

const exportFileDefault = { name: "Data.xlsx", sheetName: "Sheet1", title: "Danh sách", description: null }


export interface ListSubjectProps {

  authorization?: authorization;
  columns?: ColumnConfig[];
  columnsShow?: string[];
  urlList?: fullUrlList;
  exportFile?: exportFileInfo;
  insertExcelConfig?: configExcelInsertSetting | null;
  updateExcelConfig?: configExcelUpdateSetting | null;
  AddFormComponent?: React.ComponentType<any> | null;
  EditFormComponent?: React.ComponentType<any> | null;
  titleDesignList?: string;
  header?: string;
  dynamicTables?: any;
  dynamicTexts?: any;
  dynamicFunctions?: any;
  fonts?: any,
  colors?: any,
}



const ListSubject = ({
  authorization = authorizationFalse,
  urlList = {},
  columns = [],
  columnsShow = [],
  exportFile = exportFileDefault || null,
  insertExcelConfig = insertExcelSetting || null,
  updateExcelConfig = updateExcelSetting || null,
  AddFormComponent = null,
  EditFormComponent = null,
  titleDesignList = "Thiết Kế Mẫu In Danh Sách",
  header = "Quản lý",

  dynamicTables = {},
  dynamicTexts = {},
  dynamicFunctions = {},
  fonts = {},
  colors = {},
}: ListSubjectProps) => {

  const {
    urlGetList, urlDeleteList, urlPostList, urlPutList,
    urlCheck, urlUpdate, urlDelete, urlInsert,
    urlGetPrintContent, urlUpdatePrintDesign, urlDeletePrintDesign, urlInsertPrintDesign,
    urlGetPrintContents, urlUpdatePrintDesigns, urlDeletePrintDesigns, urlInsertPrintDesigns
  } = urlList;


  const [data, setData] = useState<Array<{ [key: string]: any }>>([{}]);
  const [activeData, setActiveData] = useState<Subject | null>(null);
  const [isShowAddForm, setIsShowAddForm] = useState(false);
  const [isShowEditForm, setIsShowEditForm] = useState(false);
  const [isPrintListDesign, setIsPrintListDesign] = useState(false);
  const [isPrintList, setIsPrintList] = useState(false);
  const [isImportExcel, setIsImportExcel] = useState(false);
  const [isUpdateExcel, setIsUpdateExcel] = useState(false);
  const [isPrintMoreSubjects, setIsPrintMoreSubjects] = useState(false);
  const [selectSubjects, setSelectSubjects] = useState<any[]>([]);

  const handleGetList = async () => {
    if (authorization.viewList) {
      const result = await getData({ url: urlGetList });
      if (result.data) {
        setData(result.data);
      }
    } else {
      setData([])
    }

  }


  useEffect(() => {
    if (authorization.viewList) {
      handleGetList();
    } else {
      setData([]);
    }

  }, []);

  const handleOnRowSelect = (value) => {
    setActiveData(value);
    setIsShowEditForm(true);

  }
  const handleOnRowsSelect = (value) => {
    setSelectSubjects(value)
  }

  const handleOnSuccess = (data) => {
    if (data.action === 'insert' || data.action === 'update' || data.action === 'delete') {
      handleGetList();
    }
    setActiveData(null);
    setIsShowAddForm(false);
    setIsShowEditForm(false);
  }

  const handleCreate = () => {
    setActiveData(null);
    setIsShowAddForm(true);
  }

  const handleDuplicateSubject = () => {
    if (selectSubjects.length === 1) {
      const { id, ...rest } = selectSubjects[0]; // bỏ id
      const duplicateSubject = {
        ...rest,
        code: 'copy-' + rest.code,
      };
      setActiveData(duplicateSubject);
      setIsShowAddForm(true);
      setIsShowEditForm(false); // đảm bảo không bật cả 2 form
    }

  }

  const handlePrintListDesignSubject = () => {
    setIsPrintListDesign(true)
  }

  const handleOnCancelDesign = (cancel: boolean) => {
    setIsPrintListDesign(!cancel)
  }

  const handlePrintListSubject = () => {
    setIsPrintList(true)
  }

  const handleOnCancelPrint = (cancel: boolean) => {
    setIsPrintList(!cancel)
  }

  const handlePrintMoreSubjects = () => {
    setIsPrintMoreSubjects(true)

  }

  const handleImportExcel = () => {
    setIsImportExcel(true)
  }

  const handleUpdateExcel = () => {
    setIsUpdateExcel(true)
  }



  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{header}</h1>
      <div className={styles.buttonGroup}>
        {authorization.viewList && <button onClick={handleGetList} className={styles.buttonGet} >Refresh</button>}
        {authorization.add && urlInsert && <button onClick={handleCreate} className={styles.buttonCreate} >Add New</button>}
        {authorization.add && urlInsert &&<button disabled={selectSubjects.length !== 1} onClick={handleDuplicateSubject} className={styles.buttonDuplicate} >Duplicate</button>}

        {authorization.viewPrintDesignList && <NotifyNotSelectedButton className={styles.buttonDesign} data={selectSubjects} onTrigger={handlePrintListDesignSubject} >
          Design Print list
        </NotifyNotSelectedButton>}
        {authorization.printList && <NotifyNotSelectedButton className={styles.buttonPrint} data={selectSubjects} onTrigger={handlePrintListSubject} > Print list</NotifyNotSelectedButton>}
        {authorization.print && <NotifyNotSelectedButton className={styles.buttonPrintMore} data={selectSubjects} onTrigger={handlePrintMoreSubjects} > Print more</NotifyNotSelectedButton>}
        {authorization.deleteList && urlDeleteList && <DeleteSubjects
          deleteUrl={urlDeleteList}
          selectSubjects={selectSubjects}
          setSelectSubjects={setSelectSubjects}
          setData={setData}
          className={styles.buttonDelete}
        />}
        {authorization.addList && insertExcelConfig && <button onClick={handleImportExcel} className={styles.buttonImport}>Add by Excel</button>}
        {authorization.updateList && updateExcelConfig && <button onClick={handleUpdateExcel} className={styles.buttonUpdate}>Update by Excel</button>}
      </div>


      {authorization.viewList && <div className={styles.tableContainer}>
        <ReactTableBasic
          data={data}
          columns={columns}
          columnsShow= {columnsShow}
          isGlobalFilter={true}
          onOriginalRowSelect={handleOnRowSelect}
          onOriginalRowsSelect={handleOnRowsSelect}
          fieldUnique={'id'}
          exportFile={authorization.exportExcel ? exportFile ? exportFile : undefined : null}
        >
        </ReactTableBasic>
      </div>}
      <div className={styles.childContainer}>

        {isShowAddForm && authorization.view && AddFormComponent && <AddFormComponent
          urlCheck={urlCheck}
          urlInsert={urlInsert}
          activeData={activeData}
          onSuccess={handleOnSuccess}
          authorization={authorization}
        />}
        {isShowEditForm && authorization.view && EditFormComponent && <EditFormComponent

          urlCheck={urlCheck}
          urlUpdate={urlUpdate}
          urlDelete={urlDelete}

          urlGetPrintContent={urlGetPrintContent}
          urlUpdatePrintDesign={urlUpdatePrintDesign}
          urlDeletePrintDesign={urlDeletePrintDesign}
          urlInsertPrintDesign={urlInsertPrintDesign}

          activeData={activeData}
          onSuccess={handleOnSuccess}
          authorization={authorization}
        />}

        {isPrintListDesign && authorization.viewPrintDesignList &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
            <DesignPrint
              urlGet={urlGetPrintContents}
              urlUpdate={urlUpdatePrintDesigns}
              urlDelete={urlDeletePrintDesigns}
              urlInsert={urlInsertPrintDesigns}
              dynamicTables={{
                ...dynamicTables,
                organization: selectSubjects,
              }}
              dynamicTexts={dynamicTexts}
              dynamicFunctions={dynamicFunctions}
              fonts={fonts ? fonts.length > 0 ? fonts : [] : []}
              colors={colors ? colors.length > 0 ? colors : [] : []}

              onCancel={handleOnCancelDesign}
              title={titleDesignList}
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
              dynamicTables={{
                ...dynamicTables,
                organization: selectSubjects,
              }}
              dynamicTexts={dynamicTexts}
              dynamicFunctions={dynamicFunctions}
              fonts={fonts ? fonts.length > 0 ? fonts : [] : []}
              colors={colors ? colors.length > 0 ? colors : [] : []}
              urlGet={urlGetPrintContents}
              onCancel={handleOnCancelPrint}
            >
            </PrintPreview>

          </div>, document.body)
        }

        {isPrintMoreSubjects && authorization.print &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <PrintSubjects
              data={selectSubjects}
              dynamicTables={dynamicTables}
              dynamicTexts={dynamicTexts || {}}
              dynamicFunctions={dynamicFunctions}
              fonts={fonts ? fonts.length > 0 ? fonts : [] : []}
              colors={colors ? colors.length > 0 ? colors : [] : []}
              urlGet={urlGetPrintContent}
              onCancel={() => {
                setIsPrintMoreSubjects(false)
              }}
            >
            </PrintSubjects>

          </div>, document.body)
        }


        {isImportExcel && authorization.addList && insertExcelConfig &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardSubjectsExcelInsertViewer
              config={insertExcelConfig}
              urlPost={urlPostList}
              onCancel={() => {
                setIsImportExcel(false)
              }}
              onDone={() => {
                setIsImportExcel(false)
                handleGetList()
              }}
            >
            </DashboardSubjectsExcelInsertViewer>

          </div>, document.body)
        }
        {isUpdateExcel && authorization.updateList && updateExcelConfig &&
          ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
            <DashboardSubjectsExcelUpdateViewer
              config={updateExcelConfig}
              urlPut={urlPutList}
              onCancel={() => {
                setIsUpdateExcel(false)
              }}
              onDone={() => {
                setIsUpdateExcel(false)
                handleGetList()
              }}
            >
            </DashboardSubjectsExcelUpdateViewer>

          </div>, document.body)
        }

      </div>
    </div>
  );
};

export default ListSubject;