import { IconType } from "react-icons";

function DropDown({
  items,
  Icon,
  active,
  setActive,
  id = "dropdown",
  className = "mt-5 mb-3",
}: {
  items: string[];
  active: string;
  setActive: (val: string) => void;
  Icon: IconType;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`ml-4 ${className}`}>
      <div className="relative" data-te-dropdown-ref>
        <button
          className="text-gray-600 dark:text-gray-200 font-medium text-md leading-tight rounded transition duration-150 ease-in-out flex items-center "
          type="button"
          id={id}
          aria-expanded="false"
          data-te-dropdown-toggle-ref
          data-te-ripple-init
          data-te-ripple-color="light"
        >
          {active}
          <Icon className="tex-gray-600 ml-3" size="22" />
        </button>
        <ul
          className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-sm shadow-lg  [&[data-te-dropdown-show]]:block"
          aria-labelledby={id}
          data-te-dropdown-menu-ref
        >
          {items.map((value, idx) => (
            <li key={idx} className="hover:bg-gray-100">
              <button
                onClick={() => setActive(value)}
                className={`${
                  value === active ? "bg-blue-500 text-white" : "text-gray-500"
                } active:text-white w-full dropdown-item text-base py-2 px-12 font-normal whitespace-nowrap`}
              >
                {value}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DropDown;
