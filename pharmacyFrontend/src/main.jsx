/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
*/import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';

import { BrowserRouter } from 'react-router-dom';

import App from './App';

import './index.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb'
        },

        secondary: {
            main: '#7c3aed'
        },

        background: {
            default: '#f5f7fb',
            paper: '#ffffff'
        },

        text: {
            primary: '#172033',
            secondary: '#6b7280'
        }
    },

    typography: {
        fontFamily: 'Inter, Roboto, Arial, sans-serif'
    },

    shape: {
        borderRadius: 12
    }
});

ReactDOM.createRoot(
    document.getElementById('root')
).render(
    <React.StrictMode>

        <BrowserRouter>

            <ThemeProvider theme={theme}>

                <CssBaseline />

                <App />

            </ThemeProvider>

        </BrowserRouter>

    </React.StrictMode>
);