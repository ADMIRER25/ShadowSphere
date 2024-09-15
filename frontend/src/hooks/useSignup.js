import React from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  function handleInputErrors({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) {
    if (!fullName || !username || !confirmPassword || !gender) {
      toast.error("Please fill all the fields");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  }

  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleInputErrors({
      fullName,
      username,
      password,
      confirmPassword, 
      gender,
    });
    if (!success) return;
    setLoading(true);
    try {
      // await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-type": "application/json" },
      //   body: JSON.stringify({
      //     fullName,
      //     username,
      //     password,
      //     confirmPassword,
      //     gender,
      //   }),
      // })
      // .then((response) => response.json())
      // .then(data => (

      // ))
      // .catch((error)=>{
      //   toast.error(error.message);
      // })
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message); // Throw error with message from backend
      }
      //console.log(data);
      //console,log(data.data);
      localStorage.setItem("chat-user", JSON.stringify(data.data));
      toast.success("Signup successful");
      setAuthUser(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;
