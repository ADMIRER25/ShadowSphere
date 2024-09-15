import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from '../assets/sounds/notification.mp3';

const useListenMessage = () => {
  const { socket } = useSocketContext();
  const { selectedConversation,messages, setMessages } = useConversation();
  const [senderIdtemp,setSenderIdtemp]  = useState("");
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      // console.log(newMessage);
      // console.log(selectedConversation);

      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setSenderIdtemp(newMessage.senderId);
      if(selectedConversation._id === newMessage.senderId) setMessages([...messages, newMessage]);
    });
    if(selectedConversation._id !== senderIdtemp) return () => socket?.off("newMessage");
    return () => socket?.off("newMessage");
  }, [socket,setMessages,messages]);
};

export default useListenMessage;
