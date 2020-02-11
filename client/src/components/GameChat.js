import React from 'react';
import * as moment from 'moment'; 
import { 
    Comment,
    Tooltip,
    List,
    Input,
    Button
 } from 'antd';

export default class GameChat extends React.Component {
    

    
    
    constructor(props){
        super(props);
        this.state = {
            messsage: "",
            socket: props.socket,
            game: props.game,
            data: []
        }
        this.receiveMessageSocket();
    }
    
    componentDidMount() {
        
    }

    sendMessage = () => {
        this.state.socket.emit('send message', ({
            message: this.state.message
        }));
    }

    componentDidUpdate = () => {

    }

    
    
    receiveMessageSocket = () => {
        this.state.socket.on('receive message', (obj) => {
            
            let newData = this.state.data;
            newData.unshift({
                author: obj.nickname,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                content: (
                    <p>
                        { obj.message }
                    </p>
                ),
                datetime: (
                    <Tooltip
                    title={moment()
                        .subtract(2, 'days')
                        .format('YYYY-MM-DD HH:mm:ss')}
                    >
                    <span>
                        {moment()
                        .subtract(2, 'days')
                        .fromNow()}
                    </span>
                    </Tooltip>
                ),
            });
            this.setState({
                data: newData
            })
        });
    }

    render(){

        
        
        
        

        return (
            <div className="chat">
                <h4>{ this.props.user.nickname }</h4>
                <Input
                    placeholder="Chat..."
                    style={{ width: '80%' }}
                    onChange={(e) => this.setState({
                        message: e.target.value
                    })}
                />
                <Button
                    type="primary"
                    style={{ width: '17.5%', margin: '0 0 0 0.5%' }}
                    onClick={this.sendMessage}
                > Send </Button>
                
                <List
                    className="comment-list"
                    header={`${this.state.data.length} replies`}
                    itemLayout="horizontal"
                    dataSource={(this.state.data)}
                    renderItem={item => (
                    <li>
                        <Comment
                        author={item.author}
                        content={item.content}
                        />
                    </li>
                    )}
                />

            </div>
        );
    }
}