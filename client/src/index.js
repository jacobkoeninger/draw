import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Home from './pages/Home';
import Board from './pages/Board';
import io from 'socket.io-client';
import { Layout, Menu, Breadcrumb } from 'antd';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

let socket = io(`http://localhost:3001`)

let user = {
    room: null,
    nickname: "",
    id: socket.id
}

const setNickname = (nick) => user.nickname = nick;
const setRoom = (num) => user.room = num;

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
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </div>
    <div style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        <Switch>            
            <Route path="/board">
                <Board socket={socket} user={user} />
            </Route>
            <Route path="/">
                <Home socket={socket} setNickname={setNickname} setRoom={setRoom} />
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
