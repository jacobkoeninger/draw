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
    

    data = [
        {
          actions: [<span key="comment-list-reply-to-0">Reply to</span>],
          author: 'Han Solo',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: (
            <p>
              We supply a series of design principles, practical patterns and high quality design
              resources (Sketch and Axure), to help people create their product prototypes beautifully and
              efficiently.
            </p>
          ),
          datetime: (
            <Tooltip
              title={moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD HH:mm:ss')}
            >
              <span>
                {moment()
                  .subtract(1, 'days')
                  .fromNow()}
              </span>
            </Tooltip>
          ),
        },
        {
          actions: [<span key="comment-list-reply-to-0">Reply to</span>],
          author: 'Han Solo',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: (
            <p>
              We supply a series of design principles, practical patterns and high quality design
              resources (Sketch and Axure), to help people create their product prototypes beautifully and
              efficiently.
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
        },
    ];
    
    constructor(props){
        super(props);
        this.state = {
            messsage: "",
            socket: props.socket,
            game: props.game
        }
        this.receiveMessageSocket();
    }
    
    componentDidMount() {
        console.log('chat mounted')
    }

    sendMessage = () => {
        this.state.socket.emit('send message', ({
            message: this.state.message
        }));
    }

    getMessages = () => {
        return <List
            className="comment-list"
            header={`${this.data.length} replies`}
            itemLayout="horizontal"
            dataSource={this.data}
            renderItem={item => (
            <li>
                <Comment
                author={item.author}
                content={item.content}
                />
            </li>
            )}
        />
    }   
    
    receiveMessageSocket = () => {
        this.state.socket.on('receive message', (obj) => {
            console.log(obj.message);
            this.data.push({
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

                console.log(this.data)
        });
    }

    render(){

        
        
        
        

        return (
            <div className="chat">
                <Input
                    placeholder="Chat..."
                    style={{ width: '40%' }}
                    onChange={(e) => this.setState({
                        message: e.target.value
                    })}
                />
                <Button
                    type="primary"
                    style={{ width: '5%', margin: '0 0 0 0.5%' }}
                    onClick={this.sendMessage}
                > Send </Button>
                { this.getMessages() }
            </div>
        );
    }
}