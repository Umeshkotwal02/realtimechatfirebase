import React, { useRef, useState, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZegoConfig } from "./zegoConfig";

const VideoCall = ({ roomID, userName }) => {
  const videoContainerRef = useRef(null);
  const [roomLink, setRoomLink] = useState("");

  const startCall = async () => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      ZegoConfig.appID,
      ZegoConfig.serverSecret,
      roomID,
      Date.now().toString(),
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: videoContainerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
      showPreJoinView: true,
    });

    // Generate room link for sharing
    const link = `${window.location.origin}/call/${roomID}`;
    setRoomLink(link);
    console.log("Room Link:", link);
  };

  useEffect(() => {
    startCall();

    // Cleanup function on unmount
    return () => {
      if (ZegoUIKitPrebuilt.destroy) {
        ZegoUIKitPrebuilt.destroy();
    }
    
    };
  }, [roomID, userName]);

  return (
    <div>
      <div style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
        <strong>Room Link:</strong> 
        <a href={roomLink} target="_blank" rel="noopener noreferrer">
          {roomLink || "Generating..."}
        </a>
        <p>Share this link with the person you want to call!</p>
      </div>
      <div
        ref={videoContainerRef}
        style={{ width: "100%", height: "80vh", backgroundColor: "#000" }}
      />
    </div>
  );
};

export default VideoCall;
