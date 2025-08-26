import { useState } from "react";

import {
  Webchat,
  WebchatProvider,
  Fab,
  getClient,
} from "@botpress/webchat";

const clientId = "07119900-76cb-4964-b279-24817c9570d8";

export default function Chatbot() {
  const client = getClient({
    clientId,
  });

  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <WebchatProvider client={client} >
        <Fab onClick={toggleWebchat} />
        <div
          style={{
            display: isWebchatOpen ? "block" : "none",
          }}
        >
          <Webchat />
        </div>
      </WebchatProvider>
    </div>
  );
}
