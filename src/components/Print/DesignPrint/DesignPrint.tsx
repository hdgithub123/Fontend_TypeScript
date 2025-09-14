import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    HRichTextEditor,
    HRichTextEditorPrintPreview,
    HRichTextEditorPreview,
} from 'hrich-text-editor';

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

import { postData, deleteData, putData, getAuthHeaders, getData } from "../../../utils/axios";

import columnsContent from './columContent';
import { AlertDialog, type AlertInfo } from '../../../utils/AlertDialog';
import checkCodeContentAvailability from './checkCodeContentAvailability';
import { validateDataArray, messagesVi } from "../../../utils/validation";
import type { RuleSchema } from "../../../utils/validation";

import styles from "./DesignPrint.module.scss";

interface contentState {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    content?: RawDraftContentState | null;
}

const contentStateSchema: RuleSchema = {
    id: { type: "string", format: "uuid", min: 2, required: false },
    code: { type: "string", required: true, min: 3, max: 50 },
    name: { type: "string", required: true, min: 2, max: 255 },
    scopeName: { type: "string", required: false, min: 2, max: 255 },
    content: { type: "object", required: false },
    description: { type: "string", required: false, min: 2, max: 255 },
    isActive: { type: "boolean", required: false }
};

type DynamicTables = {
    [tableKey: string]: {
        [key: string]: string | number | boolean | null;
    };
};

type DynamicTexts = {
    [key: string]: string | number | boolean | null | undefined;
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


interface authorization {
    add?: boolean;
    update?: boolean;
    delete?: boolean;
    view?: boolean;
}

interface DesignPrintProps {
    authorization?: authorization;
    contentStateObject: RawDraftContentState;
    dynamicTables?: DynamicTables;
    dynamicTexts?: DynamicTexts;
    dynamicFunctions?: Array<(...args: any[]) => any>;
    fonts?: string[];
    colors?: string[];
    onCancel: () => void;
    title?: string;
    urlGet: string;
    urlUpdate: string;
    urlDelete: string;
    urlInsert: string;
    urlCheck?: string;
}

const DesignPrint: React.FC<DesignPrintProps> = ({
    authorization = {},
    dynamicTables,
    dynamicTexts,
    dynamicFunctions,
    fonts,
    colors,
    onCancel = () => { },
    title = "Thiết Kế Mẫu In",
    urlGet,
    urlUpdate,
    urlInsert,
    urlDelete,
}) => {
    const [listContent, setListContent] = useState<Array<{ [key: string]: any }>>([]);
    const [addContent, setAddContent] = useState<contentState | null>({
        id: '',
        code: '',
        name: '',
        description: '',
        content: null,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof contentState, string>>>({});
    const [alertinfo, setAlertinfo] = useState<AlertInfo>({
        isAlertShow: false,
        alertMessage: '',
        type: 'error',
        title: 'Lỗi',
        showConfirm: true,
        showCancel: true
    });
    const [isLoadedContent, setIsLoadedContent] = useState<string>('');

    const validateData = (content: contentState) => {
        const result = validateDataArray([{
            code: content.code,
            name: content.name,
            description: content.description
        }], contentStateSchema, messagesVi);
        if (!result.status) {
            setErrors(result.results[0]?.errors || {});
            return false;
        } else {
            setErrors({});
            return true;
        }
    };

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

    const handleEditorChange = (newContentState: any) => {
        setAddContent(prev => ({ ...prev, content: newContentState.contentObject }));
    };



    const handlePost = async () => {
        if (addContent) {
            const isValidateData = validateData(addContent)
            if (!isValidateData) {
                console.log("dang check valid", errors)
                return;
            }

            const checkResult = await checkCodeContentAvailability({ code: addContent.code || "" });
            if (checkResult.code) {
                setErrors({ code: "Mã này đã tồn tại. Vui lòng chọn mã khác." });
                return;
            }

            setAlertinfo({
                isAlertShow: true,
                alertMessage: "Bạn có chắc chắn muốn thêm mới không?",
                type: "info",
                title: "Xác nhận thêm mới",
                onConfirm: async () => {
                    try {
                        const newContent = {
                            ...addContent,
                            id: uuidv4(),
                        };
                        const result = await postData({ url: urlInsert, data: newContent });
                        if (result.status) {
                            setListContent(prev => [...prev, newContent]);
                            setAddContent(newContent);
                            console.log("Insert successful", result);
                        } else {
                            console.error("Insert failed:", result);
                        }
                    } catch (error) {
                        console.error("Insert failed:", error);
                    } finally {
                        setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
                    }
                },
                showConfirm: true,
                showCancel: false,
                onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
            });
        }
    };

    const handlePut = async () => {
        if (!addContent?.id) return;
        const isValidateData = validateData(addContent)
        if (!isValidateData) {
            return;
        }
        setAlertinfo({
            isAlertShow: true,
            alertMessage: "Bạn có chắc chắn cập nhật không?",
            type: "info",
            title: "Xác nhận cập nhật",
            onConfirm: async () => {
                try {
                    const result = await putData({
                        url: `${urlUpdate}/${addContent.id}`,
                        data: addContent
                    });
                    if (result.status) {
                        setListContent(prev =>
                            prev.map(item =>
                                item.id === addContent.id ? { ...item, ...addContent } : item
                            )
                        );
                    }
                } catch (error) {
                    console.error("update failed:", error);
                } finally {
                    setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
                }
            },
            showConfirm: true,
            showCancel: false,
            onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
        });
    };

    const handleDelete = () => {
        if (!addContent?.id) return;
        setAlertinfo({
            isAlertShow: true,
            alertMessage: "Bạn có chắc chắn muốn xóa mẫu này?",
            type: "warning",
            title: "Xác nhận xóa",
            onConfirm: async () => {
                try {
                    const result = await deleteData({
                        url: `${urlDelete}/${addContent.id}`,
                        headers: getAuthHeaders(),
                        data: {},
                    });
                    if (result?.status) {
                        setListContent(prev => prev.filter(item => item.id !== addContent.id));
                        setAddContent({});
                        console.log("Delete successful", result.data);
                    }
                } catch (err) {
                    console.error("Delete failed:", err);
                } finally {
                    setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
                }
            },
            onCancel: () => {
                console.log("Delete cancelled");
                setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
            },
            onClose: () => {
                console.log("Đóng hộp thoại");
                setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
            },
        });
    };

    const handleCancel = () => {
        setAlertinfo({
            isAlertShow: true,
            alertMessage: "Bạn có chắc chắn muốn thoát khỏi màn hình này? Hãy lưu lại thông tin.",
            type: "warning",
            title: "Xác nhận thoát màn hình",
            onConfirm: () => {
                onCancel(true)
            },
            onCancel: () => {
                setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
            },
            onClose: () => {
                setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
            },
        });

    }


    const handleonRowSelect = (row: any) => {
        setAddContent({
            id: row.id,
            code: row.code,
            name: row.name,
            description: row.description,
            content: row.content
        });
        setIsLoadedContent("Hãy nhấn nút tải nội dung tại nơi soạn thảo");
    }

    const handleGlobalFilterChange = (value: string) => {
        const newCheckContent = { ...addContent, code: value };
        setAddContent(prev => ({ ...prev, code: value }));
        if (!value || value === "") {
            setErrors({});
            // setErrors(prev => ({ ...prev, code: null }));
        } else {
            validateData(newCheckContent);
        }
    }

    const handleIsContentStateObjectLoaded = (isLoaded: boolean) => {
        if (isLoaded) {
            setIsLoadedContent("Nội dung đã tải xong");
        }

    }

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

            {authorization?.view && <div className={styles.header}>
                <h1>{title}</h1>
            </div>}
            {authorization?.view &&
                <div className={styles.allGroup}>
                    <div className={styles.buttonGroup}>
                       {authorization?.add && <button
                            className={`${styles.button} ${styles.createButton}`}
                            onClick={handlePost}
                            disabled={!addContent?.code || !addContent?.name}
                        >
                            Tạo mới
                        </button>}
                        {authorization?.update &&
                        <button
                            className={`${styles.button} ${styles.saveButton}`}
                            onClick={handlePut}
                            disabled={!addContent?.id}
                        >
                            Lưu
                        </button>}
                        {authorization?.delete && <button
                            className={`${styles.button} ${styles.deleteButton}`}
                            onClick={handleDelete}
                            disabled={!addContent?.id}
                        >
                            Xóa
                        </button>
                        }

                        <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={handleCancel}
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
                                onChangeGlobalFilter={handleGlobalFilterChange}
                                columnDisplay={'code'}
                                columnsShow={['code', 'name', 'description']}
                                globalFilterValue={addContent?.code || ""}
                                className={styles.inputField}
                                placeholder="Mã..."
                                autocomplete="new-password"
                            />
                            {errors['code'] && <span className={styles.error}>{errors['code']}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Tên mẫu</label>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={addContent?.name || ""}
                                onChange={(e) => {
                                    setAddContent(prev => ({ ...prev, name: e.target.value }));
                                }}
                                placeholder="Nhập tên mẫu..."
                            />
                            {errors['name'] && <span className={styles.error}>{errors['name']}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Mô tả</label>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={addContent?.description || ""}
                                onChange={(e) => {
                                    setAddContent(prev => ({ ...prev, description: e.target.value }));
                                }}
                                placeholder="Nhập mô tả..."
                            />
                            {errors['description'] && <span className={styles.error}>{errors['description']}</span>}
                        </div>
                    </div>

                    <div className={`${styles.loadingStatus} ${isLoadedContent ? styles.loaded : styles.loading}`}>
                        {isLoadedContent}
                    </div>

                    <div className={styles.editorContainer}>
                        {errors['content'] && <span className={styles.error}>{errors['content']}</span>}
                        <HRichTextEditor
                            contentStateObject={addContent?.content || null}
                            isContentStateObjectLoaded={handleIsContentStateObjectLoaded}
                            dynamicTables={dynamicTables || {}}
                            dynamicTexts={dynamicTexts || {}}
                            onEditorChange={handleEditorChange}
                            dynamicFunctions={dynamicFunctions || []}
                            fonts={fonts ?? []}
                            colors={colors ?? []}
                        />
                    </div>

                </div>
            }

        </div>
    );
};

export default DesignPrint;