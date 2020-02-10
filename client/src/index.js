import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Home from './pages/Home';
import Board from './pages/Board';
import io from 'socket.io-client';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

let socket = io(`http://localhost:3001`)

ReactDOM.render((
    <Router>
        <Switch>            
            <Route path="/board">
                <Board socket={socket} />
            </Route>
            <Route path="/">
                <Home />
            </Route>
        </Switch>
    </Router>
    )
    ,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
