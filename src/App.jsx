import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const OTP_STATUS = {
  DEFAULT: "",
  SUCCESS: "OTP Authentication Successful!",
  FAILURE: "OTP is Wrong or Expired!",
  INCOMPLETE: "Enter the OTP!",
};

function App() {
  const [digits, setDigits] = useState([
    { name: "firstDigit", digit: "" },
    { name: "secondDigit", digit: "" },
    { name: "thirdDigit", digit: "" },
    { name: "fourthDigit", digit: "" },
  ]);
  const [otpLength, setOtpLength] = useState(4);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState(OTP_STATUS.DEFAULT);

  // console.log(digits.map((item) => item.digit));
  console.log("verify otp", verifyOtp);
  //console.log("userOtp", userOtp);

  const generateOtp = () => {
    const array = new Uint8Array(otpLength);
    window.crypto.getRandomValues(array);
    const otp = Array.from(array, (item) => item % 10).join("");
    setVerifyOtp(otp);
  };

  const handleGenrarteOtp = () => {
    setDigits((prevDigits) =>
      prevDigits.map((item) => ({ ...item, digit: "" }))
    );
    setUserOtp("");
    generateOtp();
  };

  const handleOnchange = (name, value, index) => {
    if (value.length > 1) return;
    setDigits((prevDigits) =>
      prevDigits.map((item) =>
        item.name === name ? { ...item, digit: value } : item
      )
    );

    if (value && index < otpLength - 1) {
      document.getElementById(`focus-${index + 1}`).focus();
    }
  };

  useEffect(() => {
    document.getElementById("focus-0").focus();
  }, []);

  const handleKeyDown = (e, index) => {
    if (e.key == "Backspace" && !digits[index].digit && index > 0) {
      document.getElementById(`focus-${index - 1}`).focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    navigator.clipboard.readText().then((text) => {
      const otp = text.trim().slice(0, 4).split("");
      console.log(otp);
      setDigits((prevDigits) =>
        prevDigits.map((item, index) => ({ ...item, digit: otp[index] }))
      );
    });
  };

  useEffect(() => {
    const otp = digits.map((item) => item.digit).join("");
    setUserOtp(otp);
  }, [digits]);

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (userOtp.length < otpLength) {
      setOtpStatus(OTP_STATUS.INCOMPLETE);
      return;
    }
    if (userOtp === verifyOtp) {
      setOtpStatus(OTP_STATUS.SUCCESS);
    }
    if (userOtp !== verifyOtp) {
      setOtpStatus(OTP_STATUS.FAILURE);
    }

    setTimeout(() => {
      setOtpStatus(OTP_STATUS.DEFAULT);
    }, 2000);
  };

  return (
    <div className=" w-md bg-emerald-600 place-self-center p-2 rounded-md min-h-[50vh]">
      <h2 className=" font-semibold">OTP Verification</h2>
      <button
        className=" m-2 p-1 rounded-md bg-blue-400"
        onClick={handleGenrarteOtp}
        type="button"
      >
        Genearte OTP
      </button>
      <div className=" flex flex-col space-x-2">
        <form onSubmit={handleOtpSubmit}>
          {digits.map((item, index) => (
            <input
              id={`focus-${index}`}
              key={item.name}
              className=" bg-slate-300 text-slate-950 m-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]::appearance-none  [-moz-appearance: textfield] rounded-sm text-center outline-0"
              name={item.name}
              value={item.digit}
              type="number"
              onChange={(e) => handleOnchange(item.name, e.target.value, index)}
              onPaste={handlePasteOtp}
              onKeyDown={(e) => handleKeyDown(e, index)}
              min="0"
              max="9"
              minLength="1"
            />
          ))}
          <button className=" m-2 p-1 rounded-md bg-blue-400" type="submit">
            SUBMIT
          </button>
        </form>
        <span
          className={` ${
            otpStatus && "p-1"
          } bg-slate-100 text-black  w-fit place-self-center rounded-sm`}
        >
          {otpStatus}
        </span>
      </div>
    </div>
  );
}

export default App;
