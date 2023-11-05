import { useState } from "react";

type Tab = {
  Tab: () => JSX.Element | undefined;
  name: string;
  id: number;
};

function Tabs({ tabs }: { tabs: Tab[] }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="w-full">
      <ul className="bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 flex flex-row flex-wrap list-none pl-0 justify-around">
        {tabs.map(({ name, id }) => (
          <li role="presentation" key={id}>
            <button
              onClick={() => setSelected(id)}
              className={`
                              block
                              font-medium
                              text-xs
                              leading-tight
                              uppercase
                              border-t-0 
                              px-2
                              py-3
                              hover:border-transparent hover:bg-gray-100 dark:hover:bg-gray-800
                              focus:border-transparent
                              relative
                              ${
                                id == selected
                                  ? "text-blue-500"
                                  : "text-gray-700 dark:text-gray-100"
                              }`}
            >
              {name}
              {id == selected && (
                <div className="bg-blue-500 w-full h-[5px] rounded-t-md bottom-0 left-1/2 -translate-x-1/2 absolute" />
              )}
            </button>
          </li>
        ))}
      </ul>
      <div id="tabs-tabContent" className="h-full">
        {tabs
          .filter((tab) => tab.id === selected)
          .map(({ Tab, name, id }) => (
            <div
              key={id}
              className={`tab-pane fade relative  ${id == 0 ? "show active" : ""}`}
            >
              {/**@ts-ignore */}
              <Tab key={id} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Tabs;
