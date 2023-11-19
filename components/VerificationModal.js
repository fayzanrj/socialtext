"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";

const requestHeaders = {
  "Content-Type": "application/json",
  api_key: "RkgZRrE6mUxZLnPrKrW8aoNyPsfHL9fCZHUUSGHgEnkVXS5Vbv",
};

const VerificationModal = ({ setModal, variant, username }) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const code =
      ref1?.current.value +
      ref2?.current.value +
      ref3?.current.value +
      ref4?.current.value +
      ref5?.current.value +
      ref6?.current.value;
    console.log(code);

    try {
      const response = await axios.put(
        "/api/auth/verifyCode",
        {
          verificationCode: Number.parseInt(code),
          username: username,
        },
        { headers: requestHeaders }
      );

      if (variant === "REGISTER") {
        toast.success(`${response.data.msg} You may login now.`, {
          duration: 6000,
        });
        router.push("/login");
        setModal(false);
      } else {
        toast.success(`${response.data.msg} You can log in now.`, {
          duration: 6000,
        });
        setModal(false);
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="form" onSubmit={handleSubmit}>
      <span className="close" onClick={() => setModal(false)}>
        X
      </span>

      <div className="info">
        <span className="title">Email Verification</span>
        <p className="description">
          Open your email and enter the verification code below
        </p>
      </div>
      <div className="input-fields">
        <input ref={ref1} required type="tel" maxLength="1" />
        <input ref={ref2} required type="tel" maxLength="1" />
        <input ref={ref3} required type="tel" maxLength="1" />
        <input ref={ref4} required type="tel" maxLength="1" />
        <input ref={ref5} required type="tel" maxLength="1" />
        <input ref={ref6} required type="tel" maxLength="1" />
      </div>

      <button
        type="submit"
        className="w-full bg-[#a18aff] rounded h-10 mt-4  text-white relative"
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : "VERIFY"}
      </button>
    </form>
  );
};

export default VerificationModal;
