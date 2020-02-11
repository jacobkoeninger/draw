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
    - Show players in room
    - Add chat
    - Add protection against users joining who shouldn't. ex: private games, invite only, etc
    - Add start button for host only
    
    */
    constructor(props){
        super(props);
        this.state = {
            socket: props.socket,
            kickUser: false,
            game: null,
        }
    }

    showUsers = () => {
        if(this.state.game) {
            return <UserList users={this.state.game.players} />
        } else {
            return <p>Loading...</p>;
        }
    }

    componentDidMount = () => {
        // TODO: - Socket emit that they have joined the lobby (receive back whether they are host or not, and the current players in the game)    
        
        this.state.socket.emit('joined lobby', this.props.user.room);

        this.state.socket.on('game info', (game) => {
            // get info to find out if User is host. if host, then show play button. 
            // on play button click, emit (include user in emit?)
            this.setState({
                game: game                
            });
            console.log(game);
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
        return <Button type="primary" onClick={this.startGame} size="large">Start</Button>;
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