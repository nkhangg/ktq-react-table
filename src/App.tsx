import { Box, Modal, Tooltip } from '@mantine/core';
import axios from 'axios';
// import Table from './components/table';
import { KTQTable as Table } from 'ktq-react-table';
import { IColumn } from 'ktq-react-table/src/type';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDisclosure } from '@mantine/hooks';

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
        renderRow: (row, data) => {
            console.log('data', data);
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
    const [opened, { open, close }] = useDisclosure(false);

    const getDataTable = (params: Record<string, string | number>) => {
        return axios({
            url: 'https://payout.nswteam.net/api/v1/admin/orders',
            headers: {
                Authorization:
                    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BheW91dC5uc3d0ZWFtLm5ldC9hcGkvdjEvYWRtaW4vbG9naW4iLCJpYXQiOjE3MjU3ODcwNzMsImV4cCI6MTcyNTg3MzQ3MywibmJmIjoxNzI1Nzg3MDczLCJqdGkiOiJCTWY1a3dmQ09kMjN0T3dGIiwic3ViIjoiNSIsInBydiI6ImQyZmYyOTMzOWE4YTNlODJjMzU4MmE1YThlNzM5ZGYxNzg5YmIxMmYifQ.l8_W80W5PbCZbsTNlvCT9LIXqsm6dSVmYJkFGUR8Tzk',
            },
            params,
        });
    };

    return (
        <Box ta={'center'}>
            <h1 className="text-3xl  font-bold underline">Table</h1>
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
                            pathToData: 'data.data',

                            keyOptions: {
                                to: 'to',
                                from: 'from',
                                total: 'total',
                                last_page: 'lastPage',
                                per_page: 'perPage',
                            },
                        }}
                        hightlightResult={{
                            show: true,
                            style: {
                                color: 'blue',
                                backgroundColor: 'red',
                            },
                        }}
                        tableChildProps={{ th: { style: { textAlign: 'center' } } }}
                        withColumnBorders
                        withTableBorder
                        columns={columns}
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
                                            <FontAwesomeIcon onClick={open} color="blue" icon={faEdit} />
                                        </Tooltip>
                                    </Box>
                                );
                            },
                        }}
                        rowKey="id"
                    />
                </Box>
            </Box>

            <Modal opened={opened} onClose={close} withCloseButton={false}>
                Modal without header, press escape or click on overlay to close
            </Modal>
        </Box>
    );
};

export default App;
