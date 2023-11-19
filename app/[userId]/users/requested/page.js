import List from "@/components/UsersComponents/List";

// HEADERS FOR API REQUEST
const headers = {
  "Content-Type": "application/json",
  api_key: process.env.API_KEY,
};

const Page = async ({ params }) => {
  const response = await fetch(
    `${process.env.HOST}/api/users/getSentRequests/${params.userId}`,
    { cache: "no-store", headers: headers }
  );

  const res = await response.json();
  const requests = await res.requests;

  return <List items={requests} userId={params.userId} />;
};

export default Page;
