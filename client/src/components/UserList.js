import React from 'react';
import {
    List,
    Avatar
} from 'antd';

export default class UserList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            users: props.users,
            socket: props.socket,
            artist: null
        }
    }

    componentDidUpdate = () => {
        console.log('user list updated')
        if(this.props.artist){
            /* this.setState({
                artist: this.props.artist
            }); */
        }
    }

    render(){

        this.state.socket.on('game info', (game) => {
            this.setState({
                users: game.players
            });
        });

        return(
            <div>
                <List
                    itemLayout="vertical"
                    dataSource={this.state.users}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="#">{item.nickname}</a>}
                        />
                    </List.Item>
                    )}
                />
            </div>
        );
    }
}