import { Input } from "../types/Input";

export default function CustomInput({
  value = "",
  placeHolder = "",
  className = "",
  Icon,
  width = "full",
  type = "text",
  rounded = true,
  transparent = false,
  onChange,
  label = "",
  border = "",
  padding = "p-3",
  textColor = "text-gray-500",
  color = "bg-gray-100",
  disableDark = false,
  maxLength = 100,
  height = "",
  onIconClick,
}: Input) {
  return (
    <div className={`${className} w-${width}`}>
      {label && (
        <label
          htmlFor="floatingInput"
          className="ml-1 text-gray-500 dark:text-gray-300
"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          type={type}
          className={`
                  ${height}
                  w-full
                  ${transparent ? "bg-transparent" : color}
                  ${padding}
                  ${disableDark ? "" : "dark:bg-slate-700"}
                  ${border}
                  text-base
                  font-normal
                  ${disableDark ? "" : "dark:border-gray-700"}
                  ${textColor}
                  ${disableDark ? "" : "dark:text-gray-300"}
                  ${rounded ? "rounded-2xl" : ""}
                  transition
                  ease-in-out
                  ${transparent ? "" : "focus:border border-border-light"}
                  ${
                    disableDark ? "" : "dark:focus:border-blue-400"
                  }                  
                  ${
                    transparent
                      ? "focus:ring-0 focus:ring-offset-0"
                      : "focus:border-blue-400"
                  } focus:outline-none`}
          id="floatingInput"
          placeholder={placeHolder}
        />
        {Icon && (
          <div
            onClick={() => onIconClick && onIconClick()}
            className={`bg-slate-300  ${
              disableDark ? "" : "dark:bg-slate-900"
            } absolute top-1/2 -translate-y-1/2  right-2 rounded-full p-1.5 flex items-center justify-center ${
              onIconClick ? "cursor-pointer" : ""
            }`}
          >
            {Icon}
          </div>
        )}
      </div>
    </div>
  );
}
