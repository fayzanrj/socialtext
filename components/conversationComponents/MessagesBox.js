"use client";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import MsgItem from "../msgComponent/MsgItem";
import { pusherClient } from "@/utilities/pusher";
import axios from "axios";
import { AppContext } from "@/context/Provider";
const MessagesBox = ({ messages, chatId, userId, chatRoomId }) => {
  const context = useContext(AppContext);
  const { msgsToSend, setMsgsToSend } = context;
  const [allMessages, setAllMessages] = useState(messages);
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [seenBy, setSeenBy] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const addToReadBy = async () => {
    const response = await axios.put(
      `/api/message/readBy?chatId=${chatId}&userId=${userId}`
    );
  };

  useEffect(() => {
    addToReadBy();
  }, []);

  useEffect(() => {
    pusherClient.subscribe(chatRoomId);

    const handleIncomingMessage = (text) => {
      setSeenBy([]);
      setMsgsToSend((prev) => {
        const msgsList = [...prev]; // Create a shallow copy of the current state
        msgsList.shift(); // Remove the first element from the copied array
        return [...msgsList]; // Add the new element 'text' to the end of the copied array
      });
      setAllMessages((prev) => [...prev, text]);
      if (text.sender != userId) {
        setTimeout(() => {
          addToReadBy();
        }, [2000]);
      }
    };

    const handleReadyBy = (msg) => {
      if (msg.sender === userId) {
        setSeenBy((prev) => {
          const filteredArray = msg.readBy.filter(
            (item) => item._id !== userId
          );
          return filteredArray;
        });
      }
    };
    pusherClient.bind("incoming-message", handleIncomingMessage);
    pusherClient.bind("update-seenBy", handleReadyBy);

    return async () => {
      pusherClient.unsubscribe(chatRoomId);
      pusherClient.unbind("update-readBy", handleReadyBy);
      pusherClient.unbind("incoming-message", handleIncomingMessage);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [incomingMessages, msgsToSend, seenBy]);

  return (
    <div className="SCROLL_BAR w-full h-[84%] max-w-full max-h-[84%] p-3 overflow-hidden overflow-y-auto">
      {allMessages.map((msg, index, array) => {
        let nextMsg;
        let nextIcon;
        if (array[index - 1]) {
          nextMsg =  array[index-1].isChatUpdate ? "" : array[index - 1].sender.username;
          nextIcon = array[index-1].isChatUpdate ? "" : array[index - 1].sender.icon;
        }
        return msg.isChatUpdate ? (
          <div key={index} className="w-full text-center my-5">
            <p>{msg.content}</p>
          </div>
        ) : (
          <MsgItem
            name={
              nextMsg === msg.sender.username ? "" : `@${msg.sender.username}`
            }
            icon={nextIcon === msg.sender.icon ? "" : msg.sender.icon}
            key={index}
            msg={msg.content}
            isChatUpdate={msg.isChatUpdate}
            sentBy={msg.sender._id.toString()}
            userId={userId}
            sentAt={new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        );
      })}
      {msgsToSend.length > 0 &&
        msgsToSend.map((msg, index) => {
          return (
            <MsgItem
              key={index}
              name={""}
              msg={msg}
              sentBy={userId}
              userId={userId}
              sentAt={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          );
        })}
      {seenBy.length > 0 && (
        <div className="text-right max-w-1/2 text-gray-500">
          seen by{" "}
          {seenBy.map((item, index) => {
            return <span key={index}>{item.username}, </span>;
          })}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(MessagesBox);

// {msgsToSend && (
//   <MsgItem
//     // name={nextMsg === msg.sender.username ? "" : msg.sender.username}
//     // key={index}
//     msg={msgsToSend}
//     sentBy={userId}
//     userId={userId}
//   />
// )}
