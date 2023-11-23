"use client";
import React, { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

const ChangePassord = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <ChangePasswordModal setModal={setIsModalOpen} userId={userId} />
      )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white my-2 p-2 rounded-lg mt-10 z-40"
        >
          Change password
        </button>
    </>
  );
};

export default ChangePassord;

const ChangePasswordM = () => {
  return <div className="h-[100svh] bg-red-600">Hi</div>
}
