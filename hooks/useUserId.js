"use client"
import { useEffect, useState } from 'react';

const useUserIdFromSessionStorage = () => {
  // State to hold the user ID
  const [userId, setUserId] = useState(null);

  // Effect to run when the component mounts
  useEffect(() => {
    // Retrieve user ID from session storage
    const storedUserId = sessionStorage.getItem('userId');

    // Update the state with the retrieved user ID
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return userId;
};

export default useUserIdFromSessionStorage;