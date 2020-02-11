import React from 'react';
import GameCanvas from '../components/GameCanvas';
import io from 'socket.io-client';
import {Redirect} from "react-router-dom";

export default class Board extends React.Component {
    /* 
    TODO:
    - Check if user has a room and a nickname. (if not, redirect to Home)
    */
    constructor(props){
        super(props);
        this.state = {
            socket: props.socket,
            kickUser: false
        }
    }

    componentDidMount = () => {
        if(this.props.user.nickname == "" || this.props.user.room == null){
            this.setState({kickUser: true});
        }
    }

    /* setNickname = () => {
        this.state.socket.emit('send-nickname', this.state.nickname);
    } */

    render() {
        if(this.state.kickUser) return <Redirect to={"/"} />;
        return (
            <div>
                Board - {this.props.user.room}
                <br />
                Nickname - {this.props.user.nickname}
                <div>
                    {/* <input onChange={(e) => this.setState({nickname: e.target.value})} placeholder="Nickname" />
                    <button onClick={this.setNickname}>Set</button> */}
                </div>
                <br />
                <GameCanvas socket={this.state.socket} />
            </div>
        );
    }
}