import { Box, Button, Tooltip } from '@mantine/core';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Table from './components/table';
import { IColumn, TRefTableFn } from './type';
import { getParamsData } from './ultils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

type Root = {
    id: number;
    user_id: number;
    order_id: number;
    fullname: string;
    customer_email: string;
    phone: string;
    total_price: string;
    currency: string;
    status: string;
    address: string;
    postcode: string;
    tax: string;
    public_id: string;
    national: string;
    discount: string;
    type: string;
    transaction_id: string;
    pay_at: string;
    payload: string;
    surcharge_type: string;
    surcharge_value: string;
    surcharge_price: string;
    surcharge_id: string;
    created_at: string;
    updated_at: string;
    user_name: string;
    user_email: string;
};

const data = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);
const columns: IColumn<Root>[] = [
    {
        key: 'order_id',
        title: 'ID',
        renderRow: (row) => {
            return <Box style={{ color: 'red' }}>{row.id}</Box>;
        },
        renderColumn(col) {
            return <Box style={{ color: 'blue' }}>{col.title}</Box>;
        },
        style: {
            type: 'single',
            style: {
                width: '10%',
                textAlign: 'right',
            },
        },
        typeFilter: 'number',
    },
    {
        key: 'fullname',
        title: 'Fullname',
    },
    {
        key: 'phone',
        title: 'Phone',
    },
    {
        key: 'customer_email',
        title: 'Email',
        typeFilter: {
            type: 'select',
            data,
        },
    },
    {
        key: 'created_at',
        title: 'Created at',
        typeFilter: 'date',
    },
    {
        key: 'updated_at',
        title: 'Update at',
        typeFilter: 'datetime',
    },
];

const App = () => {
    const [data, setData] = useState<{ data: Root[]; [key: string]: any }>({ data: [] });
    const [loading, setLoading] = useState(false);

    const [header, setHeader] = useState({
        Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BheW91dC5uc3d0ZWFtLm5ldC9hcGkvdjEvYWRtaW4vbG9naW4iLCJpYXQiOjE3MjU0MzMzNTEsImV4cCI6MTcyNTUxOTc1MSwibmJmIjoxNzI1NDMzMzUxLCJqdGkiOiJJUVFuSGE5RlRCQ1J3cEhlIiwic3ViIjoiNSIsInBydiI6ImQyZmYyOTMzOWE4YTNlODJjMzU4MmE1YThlNzM5ZGYxNzg5YmIxMmYifQ.Sj8fIfexoenKFHgeIYAG4T1BkoJDrApXvMfND_b7fEM',
    });

    const refTableFn: TRefTableFn<Root> = useRef({});
    const getData = async () => {
        const { params } = getParamsData({ columns });

        setLoading(true);
        const response = await axios({
            url: 'https://payout.nswteam.net/api/v1/admin/orders',
            headers: {
                Authorization:
                    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BheW91dC5uc3d0ZWFtLm5ldC9hcGkvdjEvYWRtaW4vbG9naW4iLCJpYXQiOjE3MjU0MzMzNTEsImV4cCI6MTcyNTUxOTc1MSwibmJmIjoxNzI1NDMzMzUxLCJqdGkiOiJJUVFuSGE5RlRCQ1J3cEhlIiwic3ViIjoiNSIsInBydiI6ImQyZmYyOTMzOWE4YTNlODJjMzU4MmE1YThlNzM5ZGYxNzg5YmIxMmYifQ.Sj8fIfexoenKFHgeIYAG4T1BkoJDrApXvMfND_b7fEM',
            },
            params,
        });

        setData(response.data);

        setLoading(false);
    };

    const getDataTable = (params: Record<string, string | number>) => {
        return axios({
            url: 'https://payout.nswteam.net/api/v1/admin/orders',
            headers: {
                Authorization:
                    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BheW91dC5uc3d0ZWFtLm5ldC9hcGkvdjEvYWRtaW4vbG9naW4iLCJpYXQiOjE3MjU0MzMzNTEsImV4cCI6MTcyNTUxOTc1MSwibmJmIjoxNzI1NDMzMzUxLCJqdGkiOiJJUVFuSGE5RlRCQ1J3cEhlIiwic3ViIjoiNSIsInBydiI6ImQyZmYyOTMzOWE4YTNlODJjMzU4MmE1YThlNzM5ZGYxNzg5YmIxMmYifQ.Sj8fIfexoenKFHgeIYAG4T1BkoJDrApXvMfND_b7fEM',
            },
            params,
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box ta={'center'}>
            <h1 className="text-3xl  font-bold underline">Customer Table</h1>
            <Button onClick={() => setHeader({ Authorization: '' })}>Click me</Button>
            <Box
                style={{
                    padding: '40px',
                }}
            >
                <Box
                    style={{
                        padding: '40px',
                    }}
                >
                    <Table
                        options={{
                            query: getDataTable,
                            headers: {
                                ...header,
                            },
                            pathToData: 'data.data',
                            perPage: data['per_page'],
                            lastPage: data['last_page'],
                            to: data['to'],
                            from: data['from'],
                            total: data['total'],
                            keyOptions: {
                                to: 'to',
                                from: 'from',
                                total: 'total',
                                last_page: 'lastPage',
                            },
                        }}
                        refTableFn={refTableFn}
                        showLoading={loading}
                        tableChildProps={{ th: { style: { textAlign: 'center' } } }}
                        withColumnBorders
                        withTableBorder
                        columns={columns}
                        rows={data.data}
                        onFilter={(data) => {
                            console.log(data);
                        }}
                        onShort={(data) => {
                            console.log(data);
                        }}
                        persistFilter={[
                            {
                                key: 'time_zone',
                                type: 'Asian',
                            },
                        ]}
                        actions={{
                            title: <span>Action</span>,
                            body(row) {
                                return (
                                    <Box>
                                        <Tooltip label={row.id}>
                                            <FontAwesomeIcon color="blue" icon={faEdit} />
                                        </Tooltip>
                                    </Box>
                                );
                            },
                        }}
                        autoCallWithParams={false}
                        rowKey="id"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default App;
