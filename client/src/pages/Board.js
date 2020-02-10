import React from 'react';
import GameCanvas from '../components/GameCanvas';
import io from 'socket.io-client';
export default class Board extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            nickname: "DefaultUser",
            socket: props.socket
        }
    }

    

    setNickname = () => {
        this.state.socket.emit('send-nickname', this.state.nickname);
    }

    render(){
        return (
            <div>
                Board - {this.state.socket.id}
                <div>
                    <input onChange={(e) => this.setState({nickname: e.target.value})} placeholder="Nickname" />
                    <button onClick={this.setNickname}>Set</button>
                </div>
                <br />
                <GameCanvas socket={this.state.socket} />
            </div>
        );
    }
}