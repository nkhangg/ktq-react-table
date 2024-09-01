'use client';
import { Box, Button, MantineSize, MantineStyleProp, NumberInput, Pagination, Select, TextInput } from '@mantine/core';
import { DateInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconFilterExclamation, IconFilterSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { IColumn, IDataFilter, IFilterItemProps, IOptions, ITableFilter } from '../type';
import { defaultKeyPerpage, removeFalsy } from '../ultils';

export interface IFilterProps<R extends Record<string, string | number>> {
    columns: IColumn<R>[];
    loading?: boolean;
    initFillter?: ITableFilter<R>[];
    options?: IOptions;
    onSumit?: (filter: ITableFilter<R>[], options?: IDataFilter[]) => void;
}

export default function Filter<R extends Record<string, string | number>>({
    columns,
    initFillter,
    loading,
    perpage = { show: true },
    onSumit,
    ...props
}: IFilterProps<R> & IFilterItemProps) {
    // Initialize form with empty strings to maintain controlled state
    const form = useForm<Record<string, string | number>>({
        initialValues: columns.reduce((acc, column) => {
            acc[column.key] = '';
            return acc;
        }, {} as Record<string, string | number>),
    });

    const [open, setOpen] = useState(false);

    const [filter, setFilter] = useState<ITableFilter<R>[]>([]);

    const [options, setOptions] = useState<IDataFilter[]>([
        {
            key: perpage?.key || defaultKeyPerpage,
            type: '10',
        },
    ]);

    const handleSubmit = form.onSubmit((data) => {
        const validData = removeFalsy(data);

        const tableFilterData = Object.keys(validData).map((item) => {
            return {
                key: item,
                type: validData[item],
            } as ITableFilter<R>;
        });

        setFilter(tableFilterData);

        if (onSumit) onSumit(tableFilterData);
    });

    const handleClear = () => {
        form.reset();

        setFilter([]);

        if (onSumit) onSumit([]);
    };

    useEffect(() => {
        if (!initFillter) return;

        const params = initFillter.reduce((prev, cur) => {
            prev[cur.key] = cur.type;
            return prev;
        }, {} as Record<string, string | number>);

        form.setValues(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initFillter]);

    const defaultStyleInput = {
        size: 'xs' as MantineSize,
        style: { display: 'flex', alignItems: 'start', flexDirection: 'column', gap: '4px' } as MantineStyleProp,
        styles: {
            input: {
                minWidth: '240px',
            },
        },
    };

    useEffect(() => {
        console.log('filter in filter', filter);
    }, [filter]);

    return (
        <Box>
            {open && (
                <form onSubmit={handleSubmit} className="border mb-5 p-10 rounded-md ">
                    <Box className="flex rounded-md gap-4 flex-wrap">
                        {columns.map((column) => {
                            if (typeof column.typeFilter === 'object') {
                                switch (column.typeFilter.type) {
                                    case 'select':
                                        return (
                                            <Select
                                                key={column.key}
                                                {...form.getInputProps(column.key)}
                                                label={column.title}
                                                maxDropdownHeight={200}
                                                searchable
                                                data={column.typeFilter.data}
                                                size={defaultStyleInput.size}
                                                style={defaultStyleInput.style}
                                                styles={defaultStyleInput.styles}
                                                {...props.select}
                                            />
                                        );

                                    default:
                                        return (
                                            <Select
                                                key={column.key}
                                                {...form.getInputProps(column.key)}
                                                label={column.title}
                                                maxDropdownHeight={200}
                                                searchable
                                                data={column.typeFilter.data}
                                                size={defaultStyleInput.size}
                                                style={defaultStyleInput.style}
                                                styles={defaultStyleInput.styles}
                                                {...props.select}
                                            />
                                        );
                                }
                            } else {
                                switch (column.typeFilter) {
                                    case 'text':
                                        return (
                                            <TextInput
                                                key={column.key}
                                                {...form.getInputProps(column.key)}
                                                label={column.title}
                                                size={defaultStyleInput.size}
                                                style={defaultStyleInput.style}
                                                styles={defaultStyleInput.styles}
                                                {...props.text}
                                            />
                                        );

                                    case 'number':
                                        return (
                                            <NumberInput
                                                key={column.key}
                                                {...form.getInputProps(column.key)}
                                                label={column.title}
                                                size={defaultStyleInput.size}
                                                style={defaultStyleInput.style}
                                                styles={defaultStyleInput.styles}
                                                {...props.number}
                                            />
                                        );

                                    case 'date':
                                        return (
                                            <DateInput
                                                key={column.key}
                                                valueFormat="DD/MM/YYYY HH:mm:ss"
                                                {...form.getInputProps(column.key)}
                                                value={form.getValues()[column.key] ? new Date(Number(form.getValues()[column.key])) : undefined}
                                                onChange={(value) => {
                                                    form.setFieldValue(column.key as string, value?.getTime() || '');
                                                }}
                                                label={column.title}
                                                size={defaultStyleInput.size}
                                                style={defaultStyleInput.style}
                                                styles={defaultStyleInput.styles}
                                                {...props.date}
                                            />
                                        );
                                    case 'datetime':
                                        return (
                                            <DateTimePicker
                                                key={column.key}
                                                {...form.getInputProps(column.key)}
                                                value={form.getValues()[column.key] ? new Date(Number(form.getValues()[column.key])) : undefined}
                                                onChange={(value) => {
                                                    form.setFieldValue(column.key as string, value?.getTime() || '');
                                                }}
                                                label={column.title}
                                                size={defaultStyleInput.size}
                                                style={defaultStyleInput.style}
                                                styles={defaultStyleInput.styles}
                                                {...props.datatime}
                                            />
                                        );
                                    default:
                                        return (
                                            <TextInput
                                                key={column.key}
                                                {...form.getInputProps(column.key)}
                                                label={column.title}
                                                size={defaultStyleInput.size}
                                                style={defaultStyleInput.style}
                                                styles={defaultStyleInput.styles}
                                                {...props.text}
                                            />
                                        );
                                }
                            }
                        })}
                    </Box>

                    <Box className="flex items-center justify-end gap-2 mt-5">
                        <Button size="xs" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button disabled={loading} type="submit" size="xs">
                            Filter
                        </Button>
                    </Box>
                </form>
            )}

            <div className="w-full flex items-end justify-between mb-5">
                <div onClick={() => setOpen((prev) => !prev)} className="w-fit cursor-pointer flex items-start justify-end  flex-col">
                    {Object.keys(removeFalsy(form.getValues())).length > 0 ? <IconFilterExclamation color="red" size={20} /> : <IconFilterSearch size={20} />}

                    <span className="text-sm font-medium text-[#81838a] mt-2 italic">{`Show 1 to 15 of 239 entries`}</span>
                </div>

                <div className="flex items-end gap-4">
                    <Pagination total={10} size={'sm'} />
                    {perpage?.show && (
                        <Select
                            value={options.find((item) => item.key === (perpage?.key || defaultKeyPerpage))?.type}
                            onChange={(value) => {
                                // console.log(value);
                                // setPerpageValue(value);
                                const item = options.find((item) => item.key === (perpage?.key || defaultKeyPerpage));

                                if (item) {
                                    item.type = value || '10';
                                }

                                setOptions([...options]);
                            }}
                            size="xs"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                                gap: '4px',
                            }}
                            label="Per page"
                            data={['5', '10', '15', '20']}
                            {...perpage.perpageProps}
                        />
                    )}
                </div>
            </div>
        </Box>
    );
}
