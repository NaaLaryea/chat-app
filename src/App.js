import { request, gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

const createToken = gql`
  mutation CreateToken($name: String!) {
    createToken(name: $name)
  }
`;

const name = "Ross";

const filters = { type: "messaging", members: { $in: [name] } };
const sort = { last_message_at: -1 };

const App = () => {
  const [chatClient, setChatClient] = useState(null);

  // const mutation = useMutation(() => request('https://sles5aebb2.execute-api.af-south-1.amazonaws.com/dev/graphql', createToken))
  const mutation = useMutation(() => request("http://localhost:4000", createToken, { name: name }));
  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance("92ev7u4spvvh");
      const { createToken } = await mutation.mutateAsync();

      if (createToken) {
        await client.connectUser(
          {
            id: name,
            name: name,
            image: "https://getstream.io/random_png/?id=odd-night-9&name=odd-night-9",
          },
          createToken
        );

        setChatClient(client);
      }
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme="messaging dark">
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
