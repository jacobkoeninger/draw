import React from 'react';
import GameCanvas from '../components/GameCanvas';
import io, { Socket } from 'socket.io-client';
import {Redirect} from "react-router-dom";
import {
    Button,
    Row,
    Col,
    Icon,
    notification
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
            isHost: false,
            artist: null,
            current_round: null,            
            current_word: null,
            time_left: null,
            timer: null
        }
    }




    showUsers = () => {
        if(this.state.game) {
            return <UserList artist={this.state.artist} users={this.state.game.players} socket={this.state.socket} />
        } else {
            return <p>Loading...</p>;
        }
    }

    countDown = () => {
        let t = this.state.time_left - 1000;
        this.setState({
            time_left: t
        });
    }

    componentDidMount = () => {
        this.state.socket.on('round started', (round_length) => {
            this.setState({
                time_left: round_length
            });

            clearInterval(this.state.timer);

            this.setState({
                timer: setInterval(this.countDown, 1000)
            });

        });

        this.state.socket.emit('joined lobby', this.props.user.room);

        this.state.socket.on('get word', (word) => {
            this.setState({
                current_word: word
            });            
        });

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
            if(game.status == "active"){
                this.setState({ artist: game.current_artist });
            } else if (game.status == "ended") {
                this.setState({ kickUser: true });
            }

            if(game.current_round != this.state.current_round){

                this.state.socket.emit('request word', game);

                this.setState({ current_round: game.current_round });
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
        if(this.state.isHost && this.state.game){
            if(this.state.game.status === "lobby"){
                return <Button type="primary" onClick={this.startGame} size="large">Start</Button>;
            }
        } else {
            return;
        }
    }

    showCurrentWord = () => {
        if(this.state.current_word){
            return this.state.current_word;
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

    showTimer = () => {
        if(this.state.time_left){
            return <span> <Icon type="clock-circle" /> {this.state.time_left / 1000} </span>;
        } else {
            return;
        }
    }

    render() {
        if(this.state.kickUser) return <Redirect to={"/"} />;
        return (
            <div>
                <Row>
                    <p>Board - {this.props.user.room}</p>
                    <h2>
                        { this.showCurrentWord() }
                    </h2>
                    <h2>
                        { this.showTimer() }
                    </h2>
                    <div>
                        { this.showStartButton() }
                    </div>
                    <br />
                </Row>
                <Row>

                </Row>
                <Row>
                    <Col span={15} >
                        <GameCanvas artist={this.state.artist} socket={this.state.socket} user={this.props.user} />
                    </Col>
                    <Col span={6} >
                        <GameChat artist={this.state.artist} socket={this.state.socket} user={this.props.user} game={this.state.game} />
                    </Col>
                    <Col span={3} >
                        { this.showUsers() }
                    </Col>
                </Row>                
            </div>
        );
    }
}