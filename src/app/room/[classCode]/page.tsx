"use client";

import { Skeleton } from "@/components/Ui/skeleton";
import {
  VideoConference,
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const BASEURL = process.env.NEXT_PUBLIC_SERVER_URL;

const socket = io(`${BASEURL}`);

const VideoCall = ({ params }: { params: { classCode: string } }) => {
  const classCode = params?.classCode;
  const Router = useRouter();
  // console.log("params vanaii datat", classCode);
  const [username, setName] = useState<String>("");
  const [token, setToken] = useState("");
  function handledisconect() {
    setToken("");
    Router.back();
  }
  useEffect(() => {
    // Assume this function is called when the video call starts
    const startVideoCall = () => {
      socket.emit("startCall", { message: "Video call started" });
    };

    startVideoCall();
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const userDataString = localStorage.getItem("User");
        // console.log("ssss", userDataString);
        // console.log("This is user data from localStorage:", userDataString);

        if (userDataString !== null) {
          const userDataObject = JSON.parse(userDataString);
          const Name = userDataObject.name;
          setName(Name);
          // console.log("The name of the user is:", Name);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const room = classCode;
        const name = username;
        // console.log("check", username, room);

        const resp = await fetch(
          `/api/get-participant-token?room=${room}&username=${username}`
        );
        const data = await resp.json();
        // console.log('api token',data);

        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [username,classCode]);

  if (token === "") {
    return (
      <div className="flex flex-col space-y-3 bg-white">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={handledisconect}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100dvh" }}
      
    >
      <VideoConference />
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
};

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
export default VideoCall;
