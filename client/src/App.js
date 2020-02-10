import React from 'react';
import io from 'socket.io-client';


import './App.css';

export default class App extends React.Component {
  
  socket = io(`http://localhost:3001`);
  

  componentDidMount = _ => {
    this.socket.on('connection', (socket) => {
      //socket.broadcast.emit('hi');
      //socket.broadcast.emit('test');
      //socket.emit('test');
    });
  }

  btnClick = () => {
    this.socket.emit('test')
  }

  render(){
    return (
      <div className="App">
        ...
        <br />
        <button onClick={this.btnClick}>Click</button>
      </div>
    );
  }

}
