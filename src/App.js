import { request, gql } from 'graphql-request';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, ChannelList, LoadingIndicator, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const id = getRandomInt(1000).toString()

const createToken = gql`
  mutation {
    createPost(id: ${id}) {
      token
    }
  }
`



const filters = { type: 'messaging', members: { $in: [id] } };
const sort = { last_message_at: -1 };



const App = () => {
  const [chatClient, setChatClient] = useState(null);
  
  // const mutation = useMutation(() => request('https://sles5aebb2.execute-api.af-south-1.amazonaws.com/dev/graphql', createToken))
  const mutation = useMutation(() => request('http://localhost:4000', createToken))
  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance('92ev7u4spvvh');
      const {createPost} = await mutation.mutateAsync()
      console.log(createPost)
      await client.connectUser(
        {
          id: id,
          name: id,
          image: 'https://getstream.io/random_png/?id=odd-night-9&name=odd-night-9',
        },
        createPost.token
      );

      setChatClient(client);
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme='messaging dark'>
      <ChannelList filters={filters} sort={sort} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;