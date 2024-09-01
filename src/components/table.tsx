import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowDownAZ, faArrowsUpDown, faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, MantineStyleProp, Table as MTable, TableProps as MTableProps, Tooltip } from '@mantine/core';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { ReactNode, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { IColumn, IColumnStyle, IDataFilter, IFilterItemProps, IOptions, ITableFilter, ITableShort, TableChildProps, TRefTableFn, TShort } from '../type';
import { defaultPathToData, defaultPrefixShort, flowShort } from '../ultils';
import Filter from './filter';

interface TableProps<R extends Record<string, string | number>> extends MTableProps {
    columns: IColumn<R>[];
    rows: R[];
    rowKey: Extract<keyof R, string>;
    tableChildProps?: TableChildProps;
    iconUp?: ReactNode;
    iconNormal?: ReactNode;
    iconDown?: ReactNode;
    options?: IOptions;
    disableAutoShort?: boolean;
    emptyDataTemplate?: ReactNode;
    loadingTemplate?: ReactNode;
    showLoading?: boolean;
    addToHistoryBrowserWhenFillter?: boolean;
    autoCallWithParams?: boolean;
    showFilter?: boolean;
    refTableFn?: TRefTableFn<R>;
    filterProps?: IFilterItemProps;
    actions?: {
        title?: string | ReactNode;
        body: (row: R) => ReactNode;
    };
    filterTemplate?: () => ReactNode;
    onShort?: (short: ITableShort<R> | null) => void;
    onFilter?: (filter: ITableFilter<R>[]) => void;
    onFetchError?: (error: AxiosError) => void;
    onAfterFetch?: () => void;
    onFetched?: (response: AxiosResponse<R[]>) => void;
}

const TableIcon = ({ children, lable, icon, onClick }: { children?: ReactNode; icon?: IconProp; lable: string; onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
    return (
        <Tooltip className="bg-gray-600" style={{ textTransform: 'capitalize' }} label={lable}>
            <Box onClick={onClick} className="font-bold p-1 rounded-full hover:bg-gray-100 w-6 h-6 flex items-center justify-center select-none">
                {children ? (
                    <Box style={{ fontSize: '12px', color: 'gray' }}>{children}</Box>
                ) : icon ? (
                    <FontAwesomeIcon style={{ fontSize: '12px', color: 'gray' }} icon={icon} />
                ) : (
                    <span></span>
                )}
            </Box>
        </Tooltip>
    );
};

const Table = <R extends Record<string, string | number>>({
    columns,
    rows,
    rowKey,
    tableChildProps = {},
    options,
    disableAutoShort = false,
    emptyDataTemplate,
    loadingTemplate,
    showLoading,
    addToHistoryBrowserWhenFillter,
    autoCallWithParams = true,
    showFilter = true,
    refTableFn,
    filterProps,
    actions,
    onShort,
    onAfterFetch,
    onFetched,
    onFilter,
    onFetchError,
    ...props
}: TableProps<R>) => {
    const paramsUrl = new URLSearchParams(window.location.search);

    const { thead, trhead, trbody, tbody, th, td } = tableChildProps;

    const [short, setShort] = useState<ITableShort<R> | null>(null);

    const [filter, setFilter] = useState<ITableFilter<R>[]>([]);

    const [rowsData, setRowsData] = useState([...rows]);

    const [loading, setLoading] = useState(showLoading || false);

    const renderStyleHead = useCallback(
        (styleHead: IColumnStyle) => {
            switch (styleHead?.type) {
                case 'single':
                    if (!styleHead?.style) throw new Error('With type is "single" STYLE is requie');

                    return styleHead.style;
                case 'extents':
                    return {
                        ...th?.style,
                        ...styleHead.style,
                    };
                case 'parent':
                    return {
                        ...th?.style,
                    };

                default:
                    if (!styleHead?.style) throw new Error('With type is "single" STYLE is requie');

                    return styleHead.style;
            }
        },
        [th],
    );

    function getValueFromPath(obj: AxiosResponse<R[]>, path: string): R[] {
        // Tách chuỗi path thành các phần bằng dấu '.'
        const keys = path.split('.');

        // Duyệt qua các phần của path để truy xuất giá trị từ đối tượng
        return keys.reduce<any>((acc, key) => {
            // Xử lý chỉ số mảng (nếu có)
            const [arrayKey, index] = key.split('[');
            const cleanKey = arrayKey.trim();

            if (index !== undefined) {
                const cleanIndex = index.replace(']', '').trim();
                return acc && Array.isArray(acc[cleanKey]) ? acc[cleanKey][parseInt(cleanIndex, 10)] : undefined;
            }

            return acc && acc[cleanKey] !== undefined ? acc[cleanKey] : undefined;
        }, obj);
    }

    const fetchData = useCallback(
        async (shortData: ITableShort<R> | null, filter?: ITableFilter<R>[] | null) => {
            if (!options?.path) return;

            const { params } = renderFilter(shortData, filter);

            try {
                if (onAfterFetch) onAfterFetch();

                setLoading(true);
                const response = await axios<R[]>({
                    headers: options.headers,
                    method: 'GET',
                    url: options.path,
                    params,
                });

                if (!response) {
                    console.warn('Response is error. Please check');
                    return;
                }

                const data = getValueFromPath(response, options.pathToData || defaultPathToData);

                if (Array.isArray(data)) {
                    requestIdleCallback(
                        () => {
                            setRowsData(data);
                        },
                        { timeout: 1000 },
                    );
                } else {
                    console.warn(`Expect to receive an array but the data is an ${typeof data}`);
                }

                if (onFetched) onFetched(response);
            } catch (error) {
                if (onFetchError) onFetchError(error as AxiosError);
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [options?.path, filter],
    );

    const fetchWithShort = useCallback(
        (shortData: ITableShort<R> | null) => {
            setShort(shortData);

            fetchData(shortData);
        },
        [fetchData],
    );

    const renderShortIcon: (col: IColumn<R>) => ReactNode = useCallback(
        (col: IColumn<R>) => {
            const handleShort = () => {
                if (loading) return;

                if (!short) {
                    fetchWithShort({ key: col.key, type: flowShort[0] });

                    if (onShort) onShort(short);

                    return;
                }

                if (short.type === 'desc') {
                    fetchWithShort({ key: col.key, type: flowShort[1] });
                    return;
                }

                if (short.type === 'asc') {
                    fetchWithShort(null);
                    return;
                }

                if (onShort) onShort(short);
            };

            const DefaultIcon = () => {
                return props?.iconNormal ? <Box onClick={handleShort}>{props.iconNormal}</Box> : <TableIcon onClick={handleShort} lable="desc" icon={faArrowsUpDown} />;
            };

            if (!short) return <DefaultIcon />;

            if (short && col.key !== short.key) return <></>;

            switch (short.type) {
                case 'asc':
                    return props?.iconUp ? <Box onClick={handleShort}>{props.iconUp}</Box> : <TableIcon onClick={handleShort} lable={'clear'} icon={faArrowUpAZ} />;
                case 'desc':
                    return props?.iconDown ? <Box onClick={handleShort}>{props.iconDown}</Box> : <TableIcon onClick={handleShort} lable={'asc'} icon={faArrowDownAZ} />;
                case 'clear':
                    return <DefaultIcon />;

                default:
                    return <DefaultIcon />;
            }
        },
        [short, loading, onShort, fetchWithShort, props.iconNormal, props.iconUp, props.iconDown],
    );

    function sortData<R extends Record<string, string | number>>(data: R[], options: ITableShort<R> | null): R[] {
        // Sao chép mảng gốc để có thể khôi phục lại nếu cần
        const originalData = [...data];

        if (!options) return originalData;

        const { type, key } = options;

        if (type === 'asc') {
            // Sắp xếp tăng dần
            return data.sort((a, b) => {
                if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                    return a[key] - b[key]; // Sắp xếp số
                } else {
                    return String(a[key]).localeCompare(String(b[key])); // Sắp xếp chuỗi
                }
            });
        } else if (type === 'desc') {
            // Sắp xếp giảm dần
            return data.sort((a, b) => {
                if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                    return b[key] - a[key]; // Sắp xếp số
                } else {
                    return String(b[key]).localeCompare(String(a[key])); // Sắp xếp chuỗi
                }
            });
        } else if (type === 'clear') {
            // Khôi phục mảng về trạng thái ban đầu
            return originalData;
        } else {
            throw new Error("Loại sắp xếp không hợp lệ. Chỉ chấp nhận 'asc', 'desc' hoặc 'clear'.");
        }
    }

    const renderParamsUrl = (dataFilter: IDataFilter[]) => {
        const pathname = window.location.pathname;

        if (dataFilter.length <= 0) {
            window.history.replaceState({}, '', pathname);

            if (addToHistoryBrowserWhenFillter) {
                window.history.pushState({}, '', pathname);
            }
            return;
        }

        dataFilter.forEach((param) => {
            paramsUrl.set(param.key, String(param.type));
        });

        paramsUrl.forEach((_, key) => {
            const item = dataFilter.find((item) => key === item.key);

            if (!item) paramsUrl.delete(key);
        });

        window.history.replaceState({}, '', `${pathname}?${paramsUrl}`);

        if (addToHistoryBrowserWhenFillter) {
            window.history.pushState({}, '', `${pathname}?${paramsUrl}`);
        }
    };

    const renderFilter = useCallback(
        (short: ITableShort<R> | ITableFilter<R> | null, filterData?: ITableFilter<R>[] | null) => {
            const dataFilter: IDataFilter[] = [...(filterData ? (filterData as IDataFilter[]) : (filter as IDataFilter[]))];
            const params: { [key: string]: string } = {};

            if (short) {
                dataFilter.push({ key: `${options?.prefixShort || defaultPrefixShort}${short.key}`, type: String(short.type) });
            }

            dataFilter.forEach((filter) => {
                params[filter.key] = String(filter.type);
            });

            renderParamsUrl(dataFilter);

            return {
                url: paramsUrl.toString(),
                params,
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [options?.prefixShort, paramsUrl],
    );

    const getParamsData = (paramObject: { [key: string]: string | number }) => {
        const prefixShort = options?.prefixShort || defaultPrefixShort;

        const pramsKeys = Object.keys(paramObject);

        if (pramsKeys.length <= 0)
            return {
                shortParamsData: [],
                filterParamsData: [],
            };

        const shortParamsData = pramsKeys
            .filter((item) => item.includes(prefixShort) && columns.map((col) => col.key).includes(item.replace(prefixShort, '') as IColumn<R>['key']))
            .map((i) => {
                return { key: i.replace(prefixShort, ''), type: flowShort.includes(paramObject[i] as TShort) ? paramObject[i] : 'asc' } as ITableShort<R>;
            });

        const filterParamsData = pramsKeys
            .filter((item) => columns.map((col) => col.key).includes(item as IColumn<R>['key']))
            .map((item) => ({ key: item, type: paramObject[item] } as ITableFilter<R>));

        return { shortParamsData, filterParamsData };
    };

    // use effect space
    useEffect(() => {
        if (options?.path || disableAutoShort) return;

        const data = sortData<R>(rowsData, short);

        setRowsData([...data]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options?.path, short]);

    useEffect(() => {
        setRowsData([...rows]);
    }, [rows]);

    useEffect(() => {
        setLoading(showLoading || false);
    }, [showLoading]);

    useLayoutEffect(() => {
        if (!paramsUrl.size) return;

        const paramObject: { [key: string]: string | number } = {};
        paramsUrl.forEach((value, key) => {
            paramObject[key] = value;
        });

        const { filterParamsData, shortParamsData } = getParamsData(paramObject);

        if (shortParamsData.length > 0 || filterParamsData.length > 0) {
            setShort(shortParamsData[0]);
            setFilter(filterParamsData);
            if (autoCallWithParams) {
                fetchData(shortParamsData[0], filterParamsData);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useImperativeHandle space
    useImperativeHandle(
        refTableFn,
        () => {
            return {
                currentFilter: () => filter,
                setFilter,
                getLoading: () => loading,
                fetchData: (short, filter) => fetchData(short || null, filter),
            };
        },
        [filter, loading, fetchData],
    );

    return (
        <>
            {showFilter && (
                <Filter
                    loading={loading}
                    initFillter={[...filter]}
                    onSumit={(data) => {
                        setFilter(data);

                        fetchData(short, data);

                        if (onFilter) {
                            onFilter(data);
                        }
                    }}
                    columns={columns}
                    {...filterProps}
                />
            )}

            <MTable {...props}>
                <MTable.Thead {...thead}>
                    <MTable.Tr {...trhead}>
                        {columns.map((column) => (
                            <MTable.Th {...th} style={{ ...(column.style ? (renderStyleHead(column.style) as MantineStyleProp) : th?.style) }} key={column.key}>
                                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    {column.renderColumn ? column.renderColumn(column) : column.title}

                                    {renderShortIcon(column)}
                                </Box>
                            </MTable.Th>
                        ))}

                        {actions && (
                            <MTable.Th {...th} key={'__action_head_' + columns.length + 1}>
                                {/* <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    
                                </Box> */}
                                {actions.title ? actions.title : 'Action'}
                            </MTable.Th>
                        )}
                    </MTable.Tr>
                </MTable.Thead>
                <MTable.Tbody {...tbody} className="relative">
                    {rowsData.length > 0 &&
                        rowsData.map((row, index) => (
                            <MTable.Tr {...trbody} key={row[rowKey]}>
                                {columns.map((col) => (
                                    <MTable.Td key={col.key} {...td}>
                                        {col.renderRow ? col.renderRow(row) : row[col.key]}
                                    </MTable.Td>
                                ))}

                                {actions && (
                                    <MTable.Td key={'__action_' + index} {...td}>
                                        {actions.body(row)}
                                    </MTable.Td>
                                )}
                            </MTable.Tr>
                        ))}

                    {rowsData.length <= 0 &&
                        (emptyDataTemplate ? (
                            emptyDataTemplate
                        ) : (
                            <MTable.Tr>
                                <MTable.Td className="h-10">
                                    <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center font-medium bg-gray-200">
                                        <span>Empty Data</span>
                                    </div>
                                </MTable.Td>
                            </MTable.Tr>
                        ))}

                    {loading &&
                        (loadingTemplate ? (
                            loadingTemplate
                        ) : (
                            <MTable.Tr>
                                <MTable.Td className="h-10">
                                    <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center font-medium bg-[rgba(0,0,0,.4)]">
                                        <svg
                                            aria-hidden="true"
                                            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                    </div>
                                </MTable.Td>
                            </MTable.Tr>
                        ))}
                </MTable.Tbody>
            </MTable>
        </>
    );
};

export default Table;
