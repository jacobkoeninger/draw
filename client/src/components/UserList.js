import React from 'react';
import {
    List,
    Icon,
    Avatar,
    Popconfirm
} from 'antd';
import { Socket } from 'dgram';

export default class UserList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            users: props.users,
            socket: props.socket,
            artist: null,
            correctPlayers: [],
            gameId: null,
            hostId: null,
            isHost: false
        }
    }

    componentDidUpdate = () => {
        if(this.props.artist){
            /* this.setState({
                artist: this.props.artist
            }); */
        }
    }

    getArtistNickname = () => {
        if(this.state.artist){
            return this.state.artist.nickname;
        } else {
            return '';
        }
    }

    getStar = (user) => {
        if(this.state.correctPlayers){
            let playerFound;

            this.state.correctPlayers.forEach((player) => {
                if(player.id === user.id){
                    playerFound = player;
                }
            });

            if(playerFound){
                return <Icon type="star" />;
            } else {
                return;
            }


        }
    }

    kickPlayer = (id) => {
        if(this.state.gameId){
            console.log(`kicking player ${id}`)
            this.state.socket.emit('kick player', {playerId: id, gameId: this.state.gameId});
        }
    }

    render(){

        this.state.socket.on('game info', (game) => {
            this.setState({
                users: game.players,
                artist: game.current_artist,
                correctPlayers: game.correct_players,
                gameId: game.room,
                hostId: game.host.id
            });
            if(game.host.id === this.state.socket.id) {
                this.setState({ isHost: true });
            }
        });

        return (
            <div className="userList">
                <h4> { this.getArtistNickname() } </h4>
                
                <List
                    itemLayout="vertical"
                    dataSource={this.state.users}
                    renderItem={user => (                        
                        <Popconfirm
                        title={`Are you sure you want to kick ${user.nickname}?`}
                        onConfirm={(e) => {
                            if(this.state.isHost) this.kickPlayer(user.id);
                        }}
                        disabled={!this.state.isHost}                        
                        okText="Yes"
                        cancelText="No"
                    >
                    <List.Item>
                        { /* this.getStar(user.id) */ }
                        <List.Item.Meta
                        key={user.id}
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="#">{(() => {
                            if (user.id === this.state.hostId){
                               return '👑 '; 
                            } else {
                                return '';
                            }
                        })() + user.nickname }</a>}
                        style={(() => {
                            if(user.id === this.state.socket.id){
                                return {
                                    background: '#f9f9f9',
                                    padding: '10px 10px',
                                    border: '1px solid #eee'
                                };
                            }
                        })()}
                        />
                    </List.Item>
                    </Popconfirm>
                    )}
                />
            </div>
        );
    }
}