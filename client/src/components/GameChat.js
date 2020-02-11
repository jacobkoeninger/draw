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
        console.log(props);
    }

    render(){

        const data = [
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

        return (
            <div className="chat">
                <Input
                    placeholder="Chat..."
                    shape=""
                    style={{ width: '40%' }}
                />
                <Button
                    type="primary"
                    shape=""
                    style={{ width: '5%', margin: '0 0 0 0.5%' }}
                > Send </Button>
                <List
                    className="comment-list"
                    header={`${data.length} replies`}
                    itemLayout="horizontal"
                    dataSource={data}
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