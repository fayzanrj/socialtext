"use client";
import { AppContext } from "@/context/Provider";
import { pusherServer } from "@/utilities/pusher";
import axios from "axios";
import React, { useContext, useState } from "react";
import { BsFillSendFill, BsFillImageFill } from "react-icons/bs";
const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const ChatInputBox = ({ userId, conversationId, chatRoomId }) => {
  const context = useContext(AppContext);
  const { setMsgsToSend } = context;
  const [text, setText] = useState("");
  const [isBtnDisable, setIsBtnDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (text.length > 0) {
        setMsgsToSend((prev) => {
          const msgsList = [...prev];
          return [...msgsList, text];
        });
        setIsBtnDisable(true);
        const data = {
          chatId: conversationId,
          sendBy: userId,
          msg: text,
          msgType : "text",
          chatRoom: chatRoomId,
        };
        setText("");
        const res = await axios.post("/api/message/sendMessage", data, {
          headers: requestHeaders,
        });

        if (res.data.status === "success") {
          // console.log(res.data);
        }
        // setIsBtnDisable(false);
      }
    } catch {
    } finally {
      setIsBtnDisable(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full h-[8%] flex justify-between items-center px-[2.5%] text-sm  border-t-2 border-stone-200"
    >
      {/* SEND IMAGE ICON */}
      <button type="button" className="w-[10%] sm:w-[5%] text-right">
        <BsFillImageFill size={"1.5rem"} color="#1e88e5" />
      </button>
      {/* LABEL & INPUT */}
      <div className="my-2 w-[75%] sm:w-[80%] md:w-[85%]">
        <label htmlFor={"msg"} className={`sr-only`}>
          Text
        </label>
        <input
          className=" box-border w-full py-2 text-[1rem] px-4 outline-none bg-white  rounded-full border-stone-200 border-2"
          type={"text"}
          id={"msg"}
          placeholder={"Send a text"}
          onChange={(e) => setText(e.target.value)}
          value={text}
          autoComplete="off"
        />
      </div>
      {/* SEND ICON */}
      <button
        disabled={isBtnDisable}
        type="submit"
        className="w-[10%] sm:w-[10%] md:w-[5%] text-center overflow-hidden"
      >
        <BsFillSendFill size={"1.3rem"} color="#1e88e5" />
      </button>
    </form>
  );
};

export default ChatInputBox;
