import React, { Component, useState } from "react";
import Input from "../input/CustomInput";
import Button from "../buttons/Button";
import { AiOutlineSearch } from "react-icons/ai";

function Header() {
  const [text, setText] = useState("");
  return (
    <header className="hidden sm:flex-1 h-16 bg-white dark:bg-slate-900 sm:flex flex-row items-center border-b px-4 sticky top-0 z-50">
      <Input
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        width="full"
        className="ml-8"
        placeHolder="Search"
        Icon={<AiOutlineSearch size={19} className="text-gray-400" />}
        type="text"
      />
      <div className="w-full flex justify-end items-center">
        <Button
          onClick={() => console.log("cippa")}
          type="thirdary"
          text="Write Article"
          className="mr-8 hidden md:block"
        />
        <Button
          onClick={() => console.log("cippa")}
          type="primary"
          text="Signup"
          className="mr-8"
        />
      </div>
    </header>
  );
}

export default Header;
