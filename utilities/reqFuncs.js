import axios from "axios";
import toast from "react-hot-toast";
const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};



export const sendRequest = async (
  userId,
  searchedUserId,
  setIsLoading,
  setRequestSent
) => {
  setIsLoading(true);
  try {
    const data = {
      sentBy: userId,
      sentTo: searchedUserId,
    };
    const res = await axios.put("/api/users/sendRequest", data, {
      headers: requestHeaders,
    });
    toast.success(res.data.msg);
    if(setRequestSent){
        setRequestSent(true);
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.msg);
    } else {
      toast.error(error.message);
    }
  } finally {
    setIsLoading(false);
  }
};

export const acceptRequest = async (userId, searchedUserId, setIsLoading) => {
  setIsLoading(true);
  try {
    const data = {
      acceptedBy: userId,
      sentBy: searchedUserId,
    };
    const res = await axios.put("/api/users/acceptRequest", data, {
      headers: requestHeaders,
    });
    toast.success(res.data.msg);
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.msg);
    } else {
      toast.error(error.message);
    }
  } finally {
    setIsLoading(false);
  }
};

export const deleteRequest = async (
  userId,
  searchedUserId,
  setIsLoading,
  setRequestSent
) => {
  setIsLoading(true);
  try {
    const res = await axios.delete(
      `/api/users/deleteRequest?sentBy=${userId}&sentTo=${searchedUserId}`,
      {
        headers: requestHeaders,
      }
    );
    toast.success(res.data.msg);
    if(setRequestSent){
        setRequestSent(true);
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.msg);
    } else {
      toast.error(error.message);
    }
  } finally {
    setIsLoading(false);
  }
};
