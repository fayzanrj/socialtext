import ChangePassord from "@/components/profileComponents/ChangePassord";
import ChangeVisibility from "@/components/profileComponents/ChangeVisibility";
import DeleteAccount from "@/components/profileComponents/DeleteAccount";
import MyProfileIcon from "@/components/profileComponents/MyProfileIcon";
import Link from "next/link";
import React from "react";

// HEADERS FOR API REQUEST
const headers = {
  "Content-Type": "application/json",
  api_key: process.env.API_KEY,
};

const MyProfile = async ({ params }) => {
  const response = await fetch(
    `${process.env.HOST}/api/user/getUser/${params.userId}`,
    { cache: "no-store", headers: headers }
  );

  const res = await response.json();
  const user = await res.user;

  return (
    <div className="block sm:pl-80 h-[100svh]">
      <main className="SCROLL_BAR w-full relative bg-white p-4 sm:p-8  h-[92.5%] text-center overflow-y-auto sm:h-[100%] ">
        {/* PROFILE */}
        <div className="flex gap-5 flex-col md:flex-row justify-center items-center">
          <div className="bg-white w-[95%] sm:w-72  md:h-72 p-10 shadow-xl rounded-lg drop-shadow-lg text-center ">
            {/* ICON */}
            <MyProfileIcon userId={params.userId} icon={user.icon} />

            {/* USERNAME & EMAIL */}
            <div className="text-center mt-8">
              <h3 className="font-semibold text-4xl">@{user.username}</h3>
              <p className="mt-4">{user.email}</p>
            </div>
          </div>

          <div className="bg-white w-[95%] sm:w-72 h-40 md:h-72 p-10 shadow-xl rounded-lg drop-shadow-1/2 w-lg text-center relative ">
            <table className="w-5/6  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2">
              <tr>
                <td className="w-1/2 text-xl text-left">
                  <Link href={`/${params.userId}/users/friends`}>Friends</Link>
                </td>
                <td className="w-1/2 text-xl text-right">
                  {user.friends.length}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 text-xl text-left">
                  <Link href={`/${params.userId}/users/requests`}>
                    Requests
                  </Link>
                </td>
                <td className="w-1/2 text-xl text-right">
                  {user.requestedBy.length}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 text-xl text-left">
                  <Link href={`/${params.userId}/users/requested`}>
                    Requested
                  </Link>
                </td>
                <td className="w-1/2 text-xl text-right">
                  {user.hasRequested.length}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 text-xl text-left">
                  <Link href={`/${params.userId}/users/blocked`}>Blocked</Link>
                </td>
                <td className="w-1/2 text-xl text-right">
                  {user.hasBlocked.length}
                </td>
              </tr>
            </table>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <ChangePassord userId={params.userId} />

        {/* CHANGE VISIBILITY */}
        <ChangeVisibility
          isUserPrivate={user.isPrivate}
          userId={params.userId}
        />

        {/* DELETE ACCOUNT */}
        {/* <DeleteAccount /> */}
      </main>
    </div>
  );
};

export default MyProfile;
