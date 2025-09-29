
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    HRichTextEditor,
    HRichTextEditorPrintPreview,
    HRichTextEditorPreview,
    makeDramaticContentStatesObject,
    mergeContentStatesObject,
} from 'hrich-text-editor';

import {
    SearchDropDown,
} from 'react-table'

import { getData } from "../../../../utils/axios";

import columnsContent from './columContent';
import styles from "./PrintSubjects.module.scss";

type DynamicTables = {
    [tableKey: string]: {
        [key: string]: string | number | boolean | null;
    };
};

type DynamicTexts = {
    [key: string]: string | number | boolean | null;
};

type RawDraftContentState = {
    blocks: Array<{
        key: string;
        text: string;
        type: string;
        depth: number;
        inlineStyleRanges: Array<{
            offset: number;
            length: number;
            style: string;
        }>;
        entityRanges: Array<{
            offset: number;
            length: number;
            key: number;
        }>;
        data?: { [key: string]: any };
    }>;
    entityMap: {
        [key: string]: {
            type: string;
            mutability: 'MUTABLE' | 'IMMUTABLE' | 'SEGMENTED';
            data: { [key: string]: any };
        };
    };
};


interface PrintPreviewProps {
    data: Array<Record<string, any>>;
    contentStateObject?: RawDraftContentState;
    dynamicTables?: DynamicTables;
    dynamicTexts?: DynamicTexts;
    dynamicFunctions?: Array<(...args: any[]) => any>;
    fonts?: string[];
    colors?: string[];
    onCancel?: (arg?: any) => void;
    urlGet: string;
}


const PrintSubjects: React.FC<PrintPreviewProps> = ({
    data = [],
    dynamicTables = {},
    dynamicTexts = {},
    dynamicFunctions = [],
    fonts,
    colors,
    onCancel = () => { },
    urlGet = "",
}) => {

    const [viewContent, setViewContent] = useState<{ [key: string]: string }>({});
    const [isPrint, setIsPrint] = useState<boolean>(false)
    const [listContent, setListContent] = useState<Array<{ [key: string]: any }>>([]);
    const [combineContent, setCombineContent] = useState<{ [key: string]: string }>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData({ url: urlGet });
            if (result.status) {
                setListContent(result.data);
            } else {
                console.error("Failed to fetch data:", result.message);
            }
        };
        fetchData();
    }, [urlGet]);

    const handleonRowSelect = (row) => {
        console.log("Selected row:", row);
        setViewContent({
            id: row.id,
            code: row.code,
            name: row.name,
            description: row.description,
            content: row.content
        });

        if (data) {
            const contentsObject: any[] = [];
            data.forEach((item) => {
                const dramaticObj = makeDramaticContentStatesObject({
                    contentStateObject: row.content, // hoặc truyền contentStateObject tương ứng nếu có
                    dynamicTables: dynamicTables,
                    dynamicTexts: { ...item }
                });

                contentsObject.push(dramaticObj);
            });

            const newCombineContent = mergeContentStatesObject({ contentStates: contentsObject })
            setCombineContent(newCombineContent)
        }
    }




    const handlePrint = () => {
        setIsPrint(true)
    }


    const handleIsPrinted = (print) => {
        setIsPrint(false)
    }

    const handleCancel = () => {
        onCancel(true)
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>In nhiều chứng từ</h1>
            </div>
            <div className={styles.allGroup}>
                <div className={styles.buttonGroup}>
                    <button
                        className={`${styles.button} ${styles.printButton}`}
                        onClick={handlePrint}
                        disabled={!viewContent?.code}
                    >
                        In
                    </button>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={handleCancel}
                    // disabled={!viewContent?.code}
                    >
                        Thoát
                    </button>
                </div>
                <div className={styles.inputcontrols} style={{ zIndex: '100', }}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Mã</label>
                        <SearchDropDown
                            data={listContent}
                            columns={columnsContent}
                            onRowSelect={handleonRowSelect}
                            // onChangeGlobalFilter={handleGlobalFilterChange}
                            columnDisplay={'code'}
                            columnsShow={['code', 'name', 'description']}
                            globalFilterValue={viewContent?.code || ""}
                            className={styles.inputField}
                            placeholder="Mã..."
                            autoComplete="new-password"
                        // style={{ padding: '10px 12px', width: '100%', height: '100%', zIndex: '1001', border: '#ddd 1px solid' }}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Tên mẫu</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={viewContent?.name || ""}
                            placeholder="Tên mẫu..."
                            disabled={true}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Mô tả</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={viewContent?.description || ""}
                            placeholder="Mô tả..."
                            disabled={true}
                        />
                    </div>
                </div>
                <div className={styles.editorContainer} >
                    <div className={styles.insideEditorContainer}>
                        <HRichTextEditorPrintPreview
                            contentStateObject={combineContent || null}
                            dynamicTables={dynamicTables || {}}
                            dynamicTexts={dynamicTexts || {}}
                            dynamicFunctions={dynamicFunctions || []}
                            fonts={fonts || []}
                            colors={colors ? colors.length > 0 ? colors : [] : []}
                            isPrint={isPrint}
                            isPrinted={handleIsPrinted}
                        />
                    </div>
                </div>
            </div>

        </div>

    )

}

export default PrintSubjects