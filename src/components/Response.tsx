import { useExecuteRequest } from "@/commands";
import {
  humanizeMicroseconds,
  humanizeBytes,
  humanizeHttpVersion,
} from "@/utils";
import { getHttpStatusCodeColor, httpMethodColors } from "@/utils";

interface Props {
  response: ReturnType<typeof useExecuteRequest>["data"];
}

const Response: React.FC<Props> = ({ response }) => (
  <div className="bg-black flex-1 border-black bg-opacity-20 text-white flex flex-col overflow-y-scroll">
    <div
      className="p-2 border-b-[0.5px] border-black flex justify-between bg-black bg-opacity-20"
      data-tauri-drag-region
    >
      <div data-tauri-drag-region>
        <span className={response && getHttpStatusCodeColor(response.status)}>
          {response?.status}
        </span>{" "}
        -{" "}
        <span className={response && httpMethodColors[response?.method]}>
          {response?.method}
        </span>{" "}
        {response?.url}
      </div>
      <div className="text-gray-400">
        <span>{response && humanizeHttpVersion[response.version]} - </span>
        {response?.content_length && (
          <span>{humanizeBytes(response.content_length)} - </span>
        )}
        {response?.remote_addr && <span>{response?.remote_addr} - </span>}
        {response && humanizeMicroseconds(response.timing.response)}
      </div>
    </div>
    <pre className="p-2 flex-1 overflow-scroll" data-tauri-drag-region>
      <code>{response?.body}</code>
    </pre>
    {response?.headers && (
      <pre
        className="p-2 bg-black bg-opacity-20 border-t-[0.5px] border-black flex overflow-scroll"
        data-tauri-drag-region
      >
        <table className="table-fixed">
          <tbody>
            {response.headers.map(([key, value]) => (
              <tr key={key}>
                <td className="text-left px-2 font-bold">{key}</td>
                <td className="text-left px-2 break-all whitespace-break-spaces">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </pre>
    )}
  </div>
);

export default Response;
