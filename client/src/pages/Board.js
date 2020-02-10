import React from 'react';
import GameCanvas from '../components/GameCanvas';
import io from 'socket.io-client';
export default class Board extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            nickname: "DefaultUser"
        }
    }

    socket = io(`http://localhost:3001`);

    setNickname = () => {
        this.socket.emit('send-nickname', this.state.nickname);
    }

    render(){
        return (
            <div>
                Board - {this.socket.id}
                <div>
                    <input onChange={(e) => this.setState({nickname: e.target.value})} placeholder="Nickname" />
                    <button onClick={this.setNickname}>Set</button>
                </div>
                <br />
                <GameCanvas socket={this.socket} />
            </div>
        );
    }
}