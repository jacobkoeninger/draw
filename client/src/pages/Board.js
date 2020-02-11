import React from 'react';
import GameCanvas from '../components/GameCanvas';
import io from 'socket.io-client';
import {Redirect} from "react-router-dom";
import {
    Button
} from 'antd';
export default class Board extends React.Component {
    /* 
    TODO:
    - Show players in room
    - Add chat
    - Add protection against users joining who shouldn't. ex: private games, invite only, etc
    - Add start button for host only
    
    */
    constructor(props){
        super(props);
        this.state = {
            socket: props.socket,
            kickUser: false
        }
    }

    componentDidMount = () => {
        // TODO: - Socket emit that they have joined the lobby (receive back whether they are host or not, and the current players in the game)    
        
        this.state.socket.emit('joined lobby');

        this.state.socket.on('lobby info', (info) => {
            console.log('info', info);
        });

        if(this.props.user.nickname == "" || this.props.user.room == null){
            this.setState({kickUser: true});
        }
    }

    startGame = () => {
        console.log('start game')
    }

    showStartButton = () => {
        return <Button type="primary" onClick={this.startGame} size="large">Start</Button>;
    }

    render() {
        if(this.state.kickUser) return <Redirect to={"/"} />;
        return (
            <div>
                Board - {this.props.user.room}
                <br />
                Nickname - {this.props.user.nickname}
                <br />
                <div>
                    { this.showStartButton() }
                </div>
                <div>
                    {/* <input onChange={(e) => this.setState({nickname: e.target.value})} placeholder="Nickname" />
                    <button onClick={this.setNickname}>Set</button> */}
                </div>
                <br />
                <GameCanvas socket={this.state.socket} user={this.props.user} />
            </div>
        );
    }
}