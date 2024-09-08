# Table of Contents

- Features
- Installation
- Import
- Props
- Usage
- Custom

# Features
- Automatically create tables
- Sort data with static and dynamic data
- Dynamic data filtering
- Strong customization capabilities

# Installation
You can install the `ktq-react-table` package using npm:

```bash
npm i ktq-react-table
```
# Import
```tsx
import { KTQTable as Table } from 'ktq-react-table';
```



# Props
### Table Props

| Prop                               | Type                                                        | Required | Description                                                                                                                        |
|------------------------------------|-------------------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------|
| `columns`                          | `IColumn<R>[]`                                               | Yes      | List of columns in the table.                                                                                                      |
| `rows`                             | `R[]`                                                        | No       | Data for the rows in the table.                                                                                                    |
| `rowKey`                           | `Extract<keyof R, string>`                                   | Yes      | Unique key to identify each row (must be one of the keys from `R`).                                                                |
| `tableChildProps`                  | `TableChildProps`                                             | No       | Custom props for the child components of the table (see `TableChildProps` for details).                                             |
| `iconUp`                           | `ReactNode`                                                   | No       | Icon displayed when data is sorted in ascending order.                                                                             |
| `iconNormal`                       | `ReactNode`                                                   | No       | Icon displayed when no sorting is applied.                                                                                         |
| `iconDown`                         | `ReactNode`                                                   | No       | Icon displayed when data is sorted in descending order.                                                                            |
| `options`                          | `IOptions<R>`                                                 | No       | Additional table options.                                                                                                          |
| `disableAutoShort`                 | `boolean`                                                     | No       | Whether to disable automatic sorting.                                                                                              |
| `emptyDataTemplate`                | `ReactNode`                                                   | No       | Template to display when there is no data.                                                                                         |
| `loadingTemplate`                  | `ReactNode`                                                   | No       | Template to display while data is loading.                                                                                         |
| `persistFilter`                    | `IDataFilter[]`                                               | No       | Filters that persist across reloads.                                                                                               |
| `showLoading`                      | `boolean`                                                     | No       | Whether to show a loading indicator.                                                                                               |
| `addToHistoryBrowserWhenFillter`   | `boolean`                                                     | No       | Whether to add the filter state to the browser history.                                                                            |
| `showFilter`                       | `boolean`                                                     | No       | Whether to display the filter UI.                                                                                                  |
| `refTableFn`                       | `TRefTableFn<R>`                                              | No       | Reference function to interact with the table component.                                                                           |
| `filterProps`                      | `IFilterItemProps<R>`                                         | No       | Custom filter properties.                                                                                                          |
| `hightlightResult`                 | `{ show?: boolean; style?: React.CSSProperties }`             | No       | Options to highlight search results, including visibility and custom styles.                                                       |
| `actions`                          | `{ title?: string | ReactNode; body: (row: R) => ReactNode }` | No       | Actions to perform on each row, with customizable title and body.                                                                  |
| `filterTemplate`                   | `() => ReactNode`                                             | No       | Custom template for rendering filters.                                                                                             |
| `onShort`                          | `(short: ITableShort<R> | null) => void`                    | No       | Callback function triggered when sorting changes.                                                                                  |
| `onFilter`                         | `(filter: ITableFilter<R>[]) => void`                        | No       | Callback function triggered when filtering is applied.                                                                             |
| `onFetchError`                     | `(error: AxiosError) => void`                                | No       | Callback function triggered when there is a fetch error.                                                                           |
| `onAfterFetch`                     | `() => void`                                                 | No       | Callback function triggered after data is fetched.                                                                                 |
| `onFetched`                        | `(response: AxiosResponse<R[]>) => void`                     | No       | Callback function triggered when data is successfully fetched.                                                                     |

### Table Styles Props

| Prop     | Type               | Required | Description                                       |
|----------|--------------------|----------|---------------------------------------------------|
| `thead`  | `TableTheadProps`   | No       | Custom props for the `thead` element.             |
| `trhead` | `TableTrProps`      | No       | Custom props for the header row (`tr` in `thead`).|
| `trbody` | `TableTrProps`      | No       | Custom props for the body row (`tr` in `tbody`).  |
| `tbody`  | `TableTbodyProps`   | No       | Custom props for the `tbody` element.             |
| `th`     | `TableThProps`      | No       | Custom props for the `th` elements.               |
| `td`     | `TableTdProps`      | No       | Custom props for the `td` elements.               |


### Options Props

| Prop            | Type                                                                     | Required | Description                                                                                                             |
|-----------------|--------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| `currentPage`    | `number`                                                                 | No       | Current page number.                                                                                                     |
| `from`          | `number \| null`                                                         | No       | Starting point for pagination, or `null` to reset.                                                                      |
| `query`         | `(params: Record<string, string \| number>) => Promise<AxiosResponse<R[]>>` | No       | Function that handles querying and fetching data. Returns a promise with the response.                                   |
| `prefixShort`   | `string`                                                                 | No       | Prefix used for sorting, if applicable.                                                                                 |
| `pathToData`    | `string`                                                                 | No       | Path to access data in the response (default is `'data'`, can be set to `'data.data'`).                                  |
| `pathToOption`  | `string`                                                                 | No       | Path to additional options within the response.                                                                         |
| `keyOptions`    | `TKeyPagiantion`                                                         | No       | Key or identifier used for pagination.                                                                                  |


# Usage
#### We use mantine to build UI
### Static Data

```tsx

import { Box } from '@mantine/core';
import { KTQTable as Table } from 'ktq-react-table';
import {IColumn} from 'ktq-react-table/src/type'

const App = () => {

    // Use ui of Mantine

    type User = {
        id: string;
        name: string;
        age: number;
    };

    const userColumns: IColumn<User>[] = [
        {
            title: 'ID',
            key: 'id',
        },
        {
            title: 'Age',
            key: 'age',
        },
        {
            title: 'Name',
            key: 'name',
        },
    ];

    const rows: User[] = [
        {
            id: '1',
            age: 18,
            name: 'Json',
        },
        {
            id: '2',
            age: 19,
            name: 'Ariteca',
        },
        {
            id: '3',
            age: 20,
            name: 'Pyxiko',
        },
        {
            id: '4',
            age: 20,
            name: 'Qitepo',
        },
    ];

    return (
        <Box ta={'center'}>
            <Table showFilter={false} columns={userColumns} rowKey="id" rows={rows} />
        </Box>
    );
};

export default App;


```
### Dynamic Data

```json
// Example response
{
    "current_page": 1,
    "data": [],
    "from": 1,
    "per_page": 15,
    "to": 15,
    "total": 0
}

```

``` ts
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@mantine/core';
import axios from 'axios';
import { useRef } from 'react';
import { KTQTable as Table } from './module/ktq-react-table';
import { IColumn, TRefTableFn } from './type';

type Root = {
    id: number;
    order_id: number;
    fullname: string;
    customer_email: string;
    phone: string;
    total_price: string;
    currency: string;
    status: string;
    address: string;
    created_at: string;
    updated_at: string;
};

const data = Array(100)
    .fill(0)
    .map((_, index) => `Option ${index}`);

const columns: IColumn<Root>[] = [
    {
        key: 'order_id',
        title: 'ID',
        renderRow: (row, higtlightData) => {
            console.log('higtlightData', higtlightData);

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
    const refTableFn: TRefTableFn<Root> = useRef({});

    const getDataTable = (params: Record<string, string | number>) => {
        return axios({
            url: 'https://example/api/v1/orders',
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
                        refTableFn={refTableFn} // optional
                        tableChildProps={{ th: { style: { textAlign: 'center' } } }} // optional
                        withColumnBorders // optional
                        withTableBorder // optional
                        rowKey="id"
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
                        columns={columns}
                        onFilter={(data) => {
                            console.log(data);
                        }} // optional
                        onShort={(data) => {
                            console.log(data);
                        }} // optional
                        persistFilter={[
                            {
                                key: 'time_zone',
                                type: 'Asian',
                            },
                        ]} // optional
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
                        }} // optional
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default App;


```
### Explanation of `pathToData`

- **Purpose**: Specifies the path within the API response object to access the table data.
- **Default Value**: `'data'` (data is located within the `data` property).
- **Customizable**: Provides a way to specify a custom path if the data is located elsewhere in the response (e.g., `'data.data'`).

### Explanation of `keyOptions`

The `keyOptions` configuration in the table setup is used to map API data keys to the keys required by your table. This helps the table understand and use the data from the API correctly.

For example:
- **`to`**: The key in the API response that contains the total number of items.
- **`from`**: The key in the API response that contains the start date.
- **`total`**: The key in the API response that contains the total number of records.
- **`last_page`**: The key in the API response that contains the last page number.
- **`per_page`**: The key in the API response that contains the number of items per page.

In summary, `keyOptions` helps the table know how to extract and display pagination information, total items, and other relevant data from the API response accurately.

# Custom

#### `highlightResult`
- **Example**:
  ```javascript
  highlightResult={{
      show: true,
      style: {
          color: 'blue',
          backgroundColor: 'red',
        },
    }}
    ```

#### `persistFilter`
- **Example**:
  ```javascript
  persistFilter={[
    {
        key: 'time_zone',
        type: 'Asian',
    },
    ]}
    ```

#### `actions`
- **Example**:
  ```javascript
  actions={{
        title: <span>Action</span>,
        body(row) {
                    return (
                        <Box>
                            <Tooltip label={row.id}>
                                <FontAwesomeIcon onClick={open} color="blue" icon={faEdit}/>
                            </Tooltip>
                        </Box>
                        );
                },
        }}
    ```