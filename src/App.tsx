import { Box, Tooltip } from '@mantine/core';
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
    const [data, setData] = useState<{ data: Root[] }>({ data: [] });
    const [loading, setLoading] = useState(false);

    const refTableFn: TRefTableFn<Root> = useRef({});
    const getData = async () => {
        const { params } = getParamsData({ columns });

        setLoading(true);
        const response = await axios({
            url: 'https://payout.nswteam.net/api/v1/admin/orders',
            headers: {
                Authorization:
                    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BheW91dC5uc3d0ZWFtLm5ldC9hcGkvdjEvYWRtaW4vbG9naW4iLCJpYXQiOjE3MjUxMjQ3NzAsImV4cCI6MTcyNTIxMTE3MCwibmJmIjoxNzI1MTI0NzcwLCJqdGkiOiJ0VEN5RWs5Wk52ZU9aZk90Iiwic3ViIjoiNSIsInBydiI6ImQyZmYyOTMzOWE4YTNlODJjMzU4MmE1YThlNzM5ZGYxNzg5YmIxMmYifQ.FW_yP7Jg9AZQOE-JS13DFW10hYO2IJmSAVBXVYd7Riw',
            },
            params,
        });

        setData(response.data);

        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Box ta={'center'}>
            <h1 className="text-3xl  font-bold underline">Customer Table</h1>
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
                            path: 'https://payout.nswteam.net/api/v1/admin/orders',
                            headers: {
                                Authorization:
                                    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BheW91dC5uc3d0ZWFtLm5ldC9hcGkvdjEvYWRtaW4vbG9naW4iLCJpYXQiOjE3MjUxMjQ3NzAsImV4cCI6MTcyNTIxMTE3MCwibmJmIjoxNzI1MTI0NzcwLCJqdGkiOiJ0VEN5RWs5Wk52ZU9aZk90Iiwic3ViIjoiNSIsInBydiI6ImQyZmYyOTMzOWE4YTNlODJjMzU4MmE1YThlNzM5ZGYxNzg5YmIxMmYifQ.FW_yP7Jg9AZQOE-JS13DFW10hYO2IJmSAVBXVYd7Riw',
                            },
                            pathToData: 'data.data',
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
