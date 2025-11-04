import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Drawer from "./Drawer";
import Chat from "./Chat";
import Message from "./Message";
import Inbox from "./Inbox";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Drawer" element={<Drawer />}>
          <Route index element={<Inbox />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="Inbox" element={<Inbox />} />
          <Route path="Message" element={<Message />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
