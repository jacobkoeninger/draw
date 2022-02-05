import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Home from './pages/Home';
import Board from './pages/Board';
import io from 'socket.io-client';
import { Layout, Menu } from 'antd';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

let socket = io('http://127.0.0.1:3001');

let user = {
    room: null,
    nickname: "",
    id: null
};

socket.on('sendId', (id) => {
  console.log(id);
  user.id = id;
});

const setNickname = (nick) => user.nickname = nick;
const setRoom = (num) => user.room = num;
const setId = (id) => user.id = id;

ReactDOM.render((
    
    <Router>
    <Layout className="layout">
    <div>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
      </Menu>
    </div>
    <div style={{ padding: '0 50px' }}>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        <Switch>            
            <Route path="/board">
                <Board socket={socket} user={user} />
            </Route>
            <Route path="/">
                <Home socket={socket} setId={setId} setNickname={setNickname} setRoom={setRoom} user={user} />
            </Route>
        </Switch>
      </div>
    </div>
  </Layout>
        
    </Router>
    )
    ,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
