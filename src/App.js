import { request, gql } from 'graphql-request';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { StreamChat } from 'stream-chat';
import {
  Attachment,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';

const createToken = gql`
  mutation {
    createPost(id: "Naa") {
      token
    }
  }
`


const filters = { type: 'messaging', members: { $in: ['Naa'] } };
const sort = { last_message_at: -1 };

const attachments = [
  {
    image: 'https://images-na.ssl-images-amazon.com/images/I/71k0cry-ceL._SL1500_.jpg',
    name: 'iPhone',
    type: 'product',
    url: 'https://goo.gl/ppFmcR',
  },
];

const CustomAttachment = (props) => {
  const { attachments } = props;
  const [attachment] = attachments || [];

  if (attachment?.type === 'product') {
    return (
      <div>
        Product:
        <a href={attachment.url} rel='noreferrer'>
          <img alt='custom-attachment' height='100px' src={attachment.image} />
          <br />
          {attachment.name}
        </a>
      </div>
    );
  }

  return <Attachment {...props} />;
};

const App = () => {
  const [chatClient, setChatClient] = useState(null);
  
  const mutation = useMutation(() => request('https://sles5aebb2.execute-api.af-south-1.amazonaws.com/dev/graphql', createToken))
  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance('92ev7u4spvvh');
      const {createPost} = await mutation.mutateAsync()
      console.log(createPost)
      await client.connectUser(
        {
          id: 'Naa',
          name: 'Naa',
          image: 'https://getstream.io/random_png/?id=odd-night-9&name=odd-night-9',
        },
        createPost.token
      );

      const [channelResponse] = await client.queryChannels(filters, sort);

      await channelResponse.sendMessage({
        text: 'Your selected product is out of stock, would you like to select one of these alternatives?',
        attachments,
      });

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
      <Channel Attachment={CustomAttachment}>
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