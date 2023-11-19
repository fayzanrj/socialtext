import Sidebar from "@/components/sidebar/Sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = async (props) => {
  // HEADERS FOR API REQUEST
  const headers = {
    "Content-Type": "application/json",
    api_key: process.env.API_KEY,
  };

  const response = await fetch(
    `${process.env.HOST}/api/chat/getAllChats/${props.params.userId}`,
    { cache: "no-store", headers: headers }
  );

  const res = await response.json();
  const chats = await res.chats;

  return (
    <>
      <Sidebar userId={props.params.userId} allChats={chats} />
      <main className="h-full">{props.children}</main>
    </>
  );
};

export default RootLayout;
