import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1688097",
  key: "ffcbc2f5cc0fcbe57fd8",
  secret: "bdf788bfcc02672c8036",
  cluster: "ap2",
  useTLS: true,
});

// const pusher = new Pusher({
//   appId: "APP_ID",
//   key: "APP_KEY",
//   secret: "APP_SECRET",
//   cluster: "APP_CLUSTER",
//   useTLS: true,
// });

/**
 * The following pusher client uses auth, not neccessary for the video chatroom example
 * Only the cluster would be important for that
 * These values can be found after creating a pusher app under
 * @see https://dashboard.pusher.com/apps/<YOUR_APP_ID>/keys
 */

export const pusherClient = new PusherClient("ffcbc2f5cc0fcbe57fd8", {
  cluster: "ap2",
  authEndpoint: "/api/pusher-auth",
  authTransport: "ajax",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
