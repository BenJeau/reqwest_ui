import { Dispatch, SetStateAction } from "react";
import { Trash2Icon } from "lucide-react";

import { Param } from "@/utils/types";

export interface ParamsProps {
  params: Param[];
  setParams: Dispatch<SetStateAction<Param[]>>;
}

const Params: React.FC<ParamsProps> = ({ params, setParams }) => (
  <table className="w-full p-2">
    <thead className="p-2">
      <tr className="border-b-[0.5px] border-black bg-black bg-opacity-40 ">
        <th className="text-left px-2 py-1 font-normal">Key</th>
        <th className="text-left px-2 py-1 font-normal">Value</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {params.map(({ key, value }, index) => (
        <tr key={index} className="border-b-[0.5px] border-black">
          <td className="text-left px-2 py-1">
            <input
              type="text"
              className={`w-full bg-transparent ${key === "" && "italic"}`}
              placeholder="Key"
              value={key}
              onChange={(e) => {
                setParams((prev) => {
                  const newHeaders = [...prev];
                  newHeaders[index].key = e.target.value;
                  if (index === newHeaders.length - 1) {
                    newHeaders.push({
                      key: "",
                      value: "",
                    });
                  }
                  return newHeaders;
                });
              }}
            />
          </td>
          <td className="text-left px-2 py-1">
            <input
              type="text"
              className={`w-full bg-transparent ${value === "" && "italic"}`}
              placeholder="Value"
              value={value}
              onChange={(e) => {
                setParams((prev) => {
                  const newHeaders = [...prev];
                  newHeaders[index].value = e.target.value;
                  if (index === newHeaders.length - 1) {
                    newHeaders.push({
                      key: "",
                      value: "",
                    });
                  }
                  return newHeaders;
                });
              }}
            />
          </td>
          <td className="w-8">
            {index !== params.length - 1 && (
              <Trash2Icon
                className="w-4 h-4 opacity-50 hover:text-red-400 hover:opacity-100 cursor-pointer"
                strokeWidth={1}
                onClick={() =>
                  setParams((prev) => {
                    const newHeaders = [...prev];
                    newHeaders.splice(index, 1);
                    return newHeaders;
                  })
                }
              />
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Params;
