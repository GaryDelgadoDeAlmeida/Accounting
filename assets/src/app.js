import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import RoutesConfig from './components/RoutesConfig';
import '../styles/app.scss';

ReactDOM.render((
    <React.StrictMode>
        <BrowserRouter>
            <RoutesConfig />
        </BrowserRouter>
    </React.StrictMode>
), document.getElementById('root'));