import { Dispatch, SetStateAction } from "react";
import { Trash2Icon } from "lucide-react";

import { Header } from "@/utils/types";

export interface HeadersProps {
  headers: Header[];
  setHeaders: Dispatch<SetStateAction<Header[]>>;
}

const Headers: React.FC<HeadersProps> = ({ headers, setHeaders }) => (
  <table className="w-full p-2">
    <thead className="p-2">
      <tr className="border-b-[0.5px] border-black bg-black bg-opacity-40 ">
        <th></th>
        <th className="text-left px-2 py-1 font-normal">Key</th>
        <th className="text-left px-2 py-1 font-normal">Value</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {headers.map(({ enabled, value, key }, index) => (
        <tr key={index} className="border-b-[0.5px] border-black">
          <td className="w-8">
            {index !== headers.length - 1 && (
              <input
                type="checkbox"
                checked={enabled}
                className="ms-2"
                onChange={(e) =>
                  setHeaders((prev) => {
                    const newHeaders = [...prev];
                    newHeaders[index].enabled = e.target.checked;
                    return newHeaders;
                  })
                }
              />
            )}
          </td>
          <td className="text-left px-2 py-1">
            <input
              type="text"
              className={`w-full bg-transparent ${key === "" && "italic"}`}
              placeholder="Key"
              value={key}
              onChange={(e) => {
                setHeaders((prev) => {
                  const newHeaders = [...prev];
                  newHeaders[index].key = e.target.value;
                  if (index === newHeaders.length - 1) {
                    newHeaders.push({
                      enabled: true,
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
                setHeaders((prev) => {
                  const newHeaders = [...prev];
                  newHeaders[index].value = e.target.value;
                  if (index === newHeaders.length - 1) {
                    newHeaders.push({
                      enabled: true,
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
            {index !== headers.length - 1 && (
              <Trash2Icon
                className="w-4 h-4 opacity-50 hover:text-red-400 hover:opacity-100 cursor-pointer"
                strokeWidth={1}
                onClick={() =>
                  setHeaders((prev) => {
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

export default Headers;
