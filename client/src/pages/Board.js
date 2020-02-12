import React from 'react';
import GameCanvas from '../components/GameCanvas';
import io, { Socket } from 'socket.io-client';
import {Redirect} from "react-router-dom";
import {
    Button,
    Row,
    Col,
} from 'antd';
import GameChat  from '../components/GameChat';
import UserList from '../components/UserList';
export default class Board extends React.Component {
    /* 
    TODO:
    - Add the nickname input here instead of home. 
        - Initially show the nickname popup, then the (canvas?)
    - Add protection against users joining who shouldn't. ex: private games, invite only, etc
    - Add start button for host only
    
    */
    constructor(props){
        super(props);
        this.state = {
            socket: props.socket,
            kickUser: false,
            game: null,
            isHost: false
        }
    }

    showUsers = () => {
        if(this.state.game) {
            return <UserList users={this.state.game.players} socket={this.state.socket} />
        } else {
            return <p>Loading...</p>;
        }
    }

    componentDidMount = () => {

        this.state.socket.emit('joined lobby', this.props.user.room);

        this.state.socket.on('game info', (game) => {
            // get info to find out if User is host. if host, then show play button. 
            // on play button click, emit (include user in emit?)
            this.setState({
                game: game
            });
            console.log(game);

            if(game.host.id == this.state.socket.id){
                this.setState({ isHost: true });
            }

        });
        
        if(this.props.user.nickname == "" || this.props.user.room == null){
            this.setState({kickUser: true});
        }
    }

    startGame = () => {
        console.log('start game');
        this.state.socket.emit('start game', this.state.game);
    }

    showStartButton = () => {
        if(this.state.isHost){
            return <Button type="primary" onClick={this.startGame} size="large">Start</Button>;
        } else {
            return;
        }
    }

    showPlayers = () => {
        if(this.state.game){
            const players = this.state.game.players;
            let playerNicknames = players.map((player) => {
                return player.nickname;
            });
            return playerNicknames.toString(", ");
        }
    }

    render() {
        if(this.state.kickUser) return <Redirect to={"/"} />;
        return (
            <div>
                <Row>
                    Board - {this.props.user.room}
                    <div>
                        { this.showStartButton() }
                    </div>
                    <br />
                </Row>
                <Row>
                
                </Row>
                <Row>
                    <Col span={15} >
                        <GameCanvas socket={this.state.socket} user={this.props.user} />
                    </Col>
                    <Col span={6} >
                        <GameChat socket={this.state.socket} user={this.props.user} game={this.state.game} />
                    </Col>
                    <Col span={3} >
                        { this.showUsers() }
                    </Col>
                </Row>                
            </div>
        );
    }
}