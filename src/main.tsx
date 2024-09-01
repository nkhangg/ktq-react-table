import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
const theme = createTheme({
    /** Put your mantine theme override here */
});
createRoot(document.getElementById('root')!).render(
    <MantineProvider theme={theme}>
        <App />
    </MantineProvider>,
);
