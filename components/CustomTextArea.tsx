import { Input } from "./types/Input";

export default function CustomTextArea({
  value = "",
  placeHolder = "",
  className = "",
  width = "full",
  onChange,
  label = "",
  border = "",
  color = "bg-gray-100",
  height = "",
  rounded = true,
}: Input) {
  return (
    <div className={`${className} w-${width}`}>
      {label && (
        <label
          htmlFor="floatingTextArea"
          className="ml-1 text-gray-500 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          className={`
                  ${height}
                  resize-none
                  scrollbar-hide
                  w-full
                  ${color}
                  p-3
                  ${border}
                  text-base
                  font-normal
                  dark:bg-slate-700
                  text-gray-500
                  border-gray-300
                  dark:border-gray-700
                  dark:text-gray-300
                  ${rounded ? "rounded-2xl" : ""}
                  transition
                  ease-in-out
                  dark:focus:border-blue-400
                  focus:outline-none
                  focus:border focus:border-blue-400`}
          id="floatingTextArea"
          placeholder={placeHolder}
        />
      </div>
    </div>
  );
}
