import React, { useState } from "react";
import { evaluate } from 'mathjs';
// ...existing code...
import {
    formatNumber,
    SumFooter,
    AverageFooter,
    CountFooter,

    TextCell,
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


type ColumnConfig = {
    accessorKey?: string;
    accessorFn?: string;
    id: string;
    header: string;
    filterType: "text" | "number" | "date" | "dateTime" | "range" | "checkbox" | "multiSelect" | "none";
    footer: "SumFooter" | "AverageFooter" | "CountFooter";
    cell: string;
    groupCell: string;
    aggregatedCell: string;
    aggregationFn: 'sum' | 'min' | 'max' | 'extent' | 'mean' | 'median' | 'unique' | 'uniqueCount' | 'count';
    enableGlobalFilter: boolean;
    children?: ColumnConfig[]; // nếu là column cha
};



const componentMap: Record<string, React.FC<any>> = {
    TextCell,
    DateCell,
    DateUsCell,
    DateVnCell,
    DateTimeCell,
    DateTimeUsCell,
    DateTimeVnCell,
    NumberCell,
    NumberUsCell,
    NumberVnCell,
};


type Convertible =
    | React.FC<any>
    | ((props: any) => any)
    | string
    | undefined;



function convertAccessorFn(str?: string): Convertible {
    if (!str) return undefined;

    if (/^\(?\s*\w+\s*\)?\s*=>/.test(str)) {
        try {
            const fn = eval(str);
            if (typeof fn === "function") return fn;
        } catch (err) {
            console.warn(`Lỗi accessorFn: ${str}`, err);
        }
    }

    return str;
}


function convertHeader(str?: string): Convertible {
    if (!str) return undefined;

    if (/^\(?\s*\w+\s*\)?\s*=>/.test(str)) {
        try {
            const fn = eval(str);
            if (typeof fn === "function") return fn;
        } catch (err) {
            console.warn(`Lỗi header: ${str}`, err);
        }
    }

    return str;
}


function convertCell(cellStr?: string): ((cell: any) => React.ReactNode) | undefined {
    if (!cellStr) return undefined;

    const cellComponentMap: Record<string, React.FC<any>> = {
        TextCell,
        DateCell,
        DateUsCell,
        DateVnCell,
        DateTimeCell,
        DateTimeUsCell,
        DateTimeVnCell,
        // NumberCell,
        // NumberUsCell,
        // NumberVnCell,
    };

    const match = cellStr.match(/^(\w+)\s*\((.*)\)$/);
    if (!match) {
        const Component = cellComponentMap[cellStr];
        return Component ? (cellProps) => <Component {...cellProps} /> : undefined;
    }

    const [, name, argsStr] = match;
    const Component = cellComponentMap[name];
    if (!Component) return undefined;

    const args = argsStr
        .split(",")
        .map(arg => arg.trim().replace(/^['"]|['"]$/g, ""));

    const minFractionDigits = Number(args[0]) || 0;
    const maxFractionDigits = Number(args[1]) || 0;
    const style = args[2];
    const extra = args[3];

    const option: Record<string, any> = {};
    if (style) {
        option.style = style;
        if (style === 'currency' && extra) {
            option.currency = extra;
        } else if (style === 'unit' && extra) {
            option.unit = extra;
        }
    }

    return (cellProps) => (
        <Component
            initialValue={cellProps.getValue()}
            minFractionDigits={minFractionDigits}
            maxFractionDigits={maxFractionDigits}
            option={option}
        />
    );
}

//"SumFooter('Tổng:', 0, 2, 'currency', 'usd')"
// "CountFooter('Số dòng:')",
// AverageFooter('trung bình:', 0, 2, 'currency', 'usd')"
function convertFooter(str?: string): Convertible {
    if (!str) return undefined;

    const match = str.match(/^(\w+)\s*\((.*)\)$/);
    if (!match) return str;

    const [, type, argsStr] = match;

    const args = argsStr
        .split(",")
        .map(arg => arg.trim().replace(/^['"]|['"]$/g, ""));

    const label = args[0] || "";
    const minFractionDigits = Number(args[1]) || 0;
    const maxFractionDigits = Number(args[2]) || 0;
    const style = args[3];
    const extra = args[4];

    const option: Record<string, any> = {};
    if (style) {
        option.style = style;
        if (style === 'currency' && extra) option.currency = extra;
        if (style === 'unit' && extra) option.unit = extra;
    }

    switch (type) {
        case 'SumFooter':
            return (info) =>
                `${label} ${formatNumber(SumFooter(info.column, info.table), minFractionDigits, maxFractionDigits, option)}`;
        case 'AverageFooter':
            return (info) =>
                `${label} ${formatNumber(AverageFooter(info.column, info.table), minFractionDigits, maxFractionDigits, option)}`;
        case 'CountFooter':
            return (info) => {
                const count = CountFooter(info.table);
                return `${label} ${formatNumber(count, minFractionDigits, maxFractionDigits, option)}`;
            };
        default:
            return str;
    }
}


function convertGroupedCell(str?: string): Convertible {
    return convertCell(str); // dùng chung logic với cell
}

function convertAggregatedCell(str?: string): Convertible {
    return convertCell(str); // dùng chung logic với cell
}



function convertColumn(config: ColumnConfig): any {
    return {
        id: config.id,
        accessorKey: config.accessorKey,
        accessorFn: convertAccessorFn(config.accessorFn),
        header: convertHeader(config.header),
        filterType: config.filterType,
        footer: convertFooter(config.footer),
        cell: convertCell(config.cell),
        groupedCell: convertGroupedCell(config.groupCell),
        aggregatedCell: convertAggregatedCell(config.aggregatedCell),
        aggregationFn: config.aggregationFn,
        enableGlobalFilter: config.enableGlobalFilter,
        children: config.children?.map(convertColumn),
    };
}


export default function convertColumns(configs: ColumnConfig[]): any[] {
    return configs.map(convertColumn);
}

