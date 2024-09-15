import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message); // Throw error with message from backend
        }
        const data = await res.json();
        // {_id:
        //   fullname:
        //   profilePic:

        // }
        setConversations(data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};
export default useGetConversations;
