import {
    __InputStylesNames,
    InputVariant,
    MantineComponent,
    NumberInputCssVariables,
    NumberInputProps,
    NumberInputStylesNames,
    SelectProps,
    SelectStylesNames,
    TableTbodyProps,
    TableTdProps,
    TableTheadProps,
    TableThProps,
    TableTrProps,
    TextInputProps,
} from '@mantine/core';
import { DateInputProps, DateInputStylesNames, DateTimePickerProps, DateTimePickerStylesNames } from '@mantine/dates';
import { AxiosResponse } from 'axios';
import React, { ReactNode } from 'react';
export type TShort = 'asc' | 'desc' | 'clear';

export type TTypeFilter = 'text' | 'number' | 'date' | 'datetime' | { type: 'select'; data: string[] };

export type TRefTableFn<R extends Record<string, string | number>> = React.MutableRefObject<{
    setFilter?: (filter: ITableFilter<R>[]) => void;
    getLoading?: () => boolean;
    currentFilter?: () => ITableFilter<R>[];
    fetchData?: (shortData?: ITableShort<R> | null, filter?: ITableFilter<R>[] | null) => Promise<void>;
}>;

export interface IColumnStyle {
    type?: 'single' | 'parent' | 'extents';
    style?: TableThProps['style'];
}

export type IColumn<R extends Record<string, string | number>> = {
    key: Extract<keyof R, string>;
    title: string;
    renderRow?: (row: R) => ReactNode;
    renderColumn?: (col: Omit<IColumn<R>, 'renderRow' | 'renderColumn'>) => ReactNode;
    style?: IColumnStyle;
    typeFilter?: TTypeFilter;
};

export interface TableChildProps {
    thead?: TableTheadProps;
    trhead?: TableTrProps;
    trbody?: TableTrProps;
    tbody?: TableTbodyProps;
    th?: TableThProps;
    td?: TableTdProps;
}

export interface IOptions<R extends Record<string, string | number>> {
    currentPage?: number;
    from?: number | null;
    lastPage?: number;
    // path: string;
    query?: (params: Record<string, string | number>) => Promise<AxiosResponse<R[], any>>;
    method?: 'POST' | 'GET';
    perPage?: number;
    to?: number | null;
    total?: number;
    prefixShort?: string;
    pathToData?: string; // 'data.data' default 'data'
    pathToOption?: string;
    headers?: { [key: string]: string };
    keyOptions?: { [key: string]: 'to' | 'from' | 'total' | 'lastPage' };
}

export interface IDataFilter {
    type: string;
    key: string;
}

export interface ITableShort<R extends Record<string, string | number>> {
    type: TShort;
    key: IColumn<R>['key'];
}

export interface ITableFilter<R extends Record<string, string | number>> {
    type: string | number;
    key: IColumn<R>['key'];
}

export interface IFilterItemProps<R extends Record<string, string | number>> {
    select?: MantineComponent<{
        props: SelectProps;
        ref: HTMLInputElement;
        stylesNames: SelectStylesNames;
        variant: InputVariant;
    }>;
    text?: MantineComponent<{
        props: TextInputProps;
        ref: HTMLInputElement;
        stylesNames: __InputStylesNames;
    }>;
    number?: MantineComponent<{
        props: NumberInputProps;
        ref: HTMLDivElement;
        stylesNames: NumberInputStylesNames;
        vars: NumberInputCssVariables;
        variant: InputVariant;
    }>;
    date?: MantineComponent<{
        props: DateInputProps;
        ref: HTMLInputElement;
        stylesNames: DateInputStylesNames;
        variant: InputVariant;
    }>;
    datatime?: MantineComponent<{
        props: DateTimePickerProps;
        ref: HTMLButtonElement;
        stylesNames: DateTimePickerStylesNames;
        variant: InputVariant;
    }>;
    perpage?: {
        show?: boolean;
        perpageProps?: SelectProps;
        key?: string;
    };
    pagination?: {
        show?: boolean;
        key?: string;
    };
    description?: (option: IOptions<R>) => ReactNode;
}
