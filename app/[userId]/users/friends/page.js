import List from "@/components/UsersComponents/List";

// HEADERS FOR API REQUEST
const headers = {
  "Content-Type": "application/json",
  api_key: process.env.API_KEY,
};

const Page = async ({ params }) => {
  const response = await fetch(
    `${process.env.HOST}/api/users/getFriendList/${params.userId}`,
    { cache: "no-store", headers: headers }
  );

  const res = await response.json();
  const friends = await res.friends;

  return <List items={friends} userId={params.userId} />;
};

export default Page;
