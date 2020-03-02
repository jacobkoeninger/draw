import React from 'react';
import io, { Socket } from 'socket.io-client';
import {Redirect} from "react-router-dom";

import {
    Button,
    Input,
    Icon,
    Checkbox,
    Modal,
    notification,
    Row,
    Col
} from 'antd';

export default class Home extends React.Component {

    /* 
        TODO:
        - only allow users to join a lobby that exists
    */

    constructor(props){
        super(props);
        this.state = {
            socket: props.socket,
            nickname: "",
            roomNumber: "",
            roomJoined: false,
            nickModalVisible: false,
            creatingOrJoining: null,
            
            createGameModalVisible: false,
            
            createGameMaxRounds: 10,
            createGameMaxPlayers: 2,
            createGameRoundLength: 30,
            createGameIsPrivate: false,

            active_games: 0
        };
        this.joinRoomSocket();
    }


    showModal = () => {
        this.setState({
          nickModalVisible: true,
        });
      };
    
    handleNickOk = e => {
        console.log(e);
        this.setState({
            nickModalVisible: false,
        });

        if(this.state.nickname !== ""){

            this.props.setNickname(this.state.nickname);
            this.state.socket.emit('send-nickname', this.state.nickname);

            if(this.state.creatingOrJoining == "joining"){
                this.joinRoom();
            } else if (this.state.creatingOrJoining == "creating"){
                //this.createRoom();
                this.setState({
                    createGameModalVisible: true
                });
            } else if (this.state.creatingOrJoining == "searching"){
                this.searchGame();
            }
        }

    };

    handleNickCancel = e => {
        console.log(e);
        this.setState({
            nickModalVisible: false,
        });
    };

    handleCreateGameOk = e => {

        //if(this.state.createGameMaxPlayers && this.state.createGameMaxRounds && this.state.createGameRoundLength){
            
            this.createRoom();
        //}

    };

    handleCreateGameCancel = e => {
        console.log(e);
        this.setState({
            createGameModalVisible: false,
        });
    };

    componentDidMount = () => {
        //console.log(this.props.user)

        this.state.socket.on('notification', (obj) => {            
            notification[obj.type]({
                message: obj.message,
                placement: "bottomRight",
                description:
                  obj.description,
            });            
        });

        this.state.socket.on('active games', (games) => {            
            this.setState({
                active_games: games
            });
        });

    }

    joinRoom = () => {
        if(this.state.nickname != "" && this.state.roomNumber != "") {
            this.state.socket.emit('join game', {roomId: this.state.roomNumber, user: this.props.user} );
        };
    }

    searchGame = () => {
        if(this.state.nickname != "") {
            this.state.socket.emit('search game', this.props.user );
        };
    }

    createRoom = _ => {
        /* 
            add room to user in users array?
            on the backend, socket.join(random name)
            load board page. (add room id as a prop somehow?)
            have room id in the url?

            Don't change to board page until the backend emits back to the frontend confirming the room was joined
         */
        if(this.state.nickname != ""){
            this.state.socket.emit('create game', {
                user: this.props.user,
                max_players: this.state.createGameMaxPlayers,
                max_rounds: this.state.createGameMaxRounds,
                round_length: this.state.createGameRoundLength,
                isPrivate: this.state.createGameIsPrivate
            });
        } else {
            console.error("Please set nickname");
        }
    }

    joinRoomSocket = _ => {
        this.state.socket.on('game joined', (GAME) => {
            if(GAME != null) {
                console.log('game joined successfully', GAME.room);
                this.props.setRoom(GAME.room);
                this.setState({ roomJoined: true });
            } else {
                console.error('Room not found');
            }

        });   
    }




    render(){
        if (this.state.roomJoined) {
            return <Redirect to={"/board"} />
        }
        return (
            <div>
                <h4>Home</h4>
                
                <Modal
                    title="Set nickname"
                    visible={this.state.nickModalVisible}
                    onOk={() => {
                        this.handleNickOk();
                    }}
                    onCancel={this.handleNickCancel}
                    >
                    <Input onKeyDown={(e) => {
                        if(e.key === "Enter") this.handleNickOk();
                    }} onChange={(e) => {
                        this.setState({ nickname: e.target.value })
                    }} placeholder="John Smith" suffix="Nickname" />
                </Modal>

                <Modal
                    title="Create game"
                    className="create_game_modal"
                    visible={this.state.createGameModalVisible}
                    onOk={() => {
                        this.handleCreateGameOk();
                    }}
                    onCancel={this.handleCreateGameCancel}
                    >
                    
                    
                    <Input onKeyDown={(e) => {if(e.key === "Enter") this.handleCreateGameOk();}} value={this.state.createGameMaxRounds} onChange={(e) => {
                        this.setState({ createGameMaxRounds: e.target.value })
                    }} placeholder="Maximum number of rounds" suffix="# Rounds" />
                    <Input onKeyDown={(e) => {if(e.key === "Enter") this.handleCreateGameOk();}} value={this.state.createGameMaxPlayers} onChange={(e) => {
                        this.setState({ createGameMaxPlayers: e.target.value })
                    }} placeholder="Maximum number of players" suffix="# Players" />
                    <Input onKeyDown={(e) => {if(e.key === "Enter") this.handleCreateGameOk();}} value={this.state.createGameRoundLength} onChange={(e) => {
                        this.setState({ createGameRoundLength: e.target.value })
                    }} placeholder="Rounds Length (in seconds)" suffix="Round Length" />
                    <Checkbox value={this.state.createGameIsPrivate} onChange={(e) => {
                        this.setState({ createGameIsPrivate: e.target.checked });
                    }}>Private (Only users with ID can join)</Checkbox>

                </Modal>

                <Row>
                    <Row>
                        <Col span={4} offset={10}>
                            <h1>
                                Draw
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} offset={10} >
                            <div className="homeFormGroup">
                                <Input onKeyDown={(e) => {
                                    if(e.key === "Enter") {
                                        this.setState({ creatingOrJoining: "joining" });
                                        this.showModal();
                                    }
                                }} onChange={(e) => {this.setState({roomNumber: e.target.value})}}  placeholder="Room #" />
                                <Button size="large" type="" onClick={() => {
                                    this.setState({ creatingOrJoining: "joining" });
                                    this.showModal();
                                }}><Icon type="enter" /></Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} offset={10} >
                            <div className="homeFormGroup">
                                <center>
                                    <Button size="large" type="" onClick={() => {
                                        this.setState({ creatingOrJoining: "searching" });
                                        this.showModal();
                                    }}><Icon type="search" />Find Game</Button>
                                </center>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} offset={10} >
                            <div className="homeFormGroup">
                                <center>
                                    <Button size="large" type="" onClick={() => {
                                        this.setState({ creatingOrJoining: "creating" });
                                        this.showModal();
                                    }}><Icon type="plus" /> Create Game</Button>
                                </center>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <p>
                            { this.state.active_games } active games
                        </p>
                    </Row>
                </Row>

            </div>
        );
    }
}