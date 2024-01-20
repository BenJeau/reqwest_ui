import { Dispatch, SetStateAction } from "react";

import { HttpMethod, httpMethods } from "@/utils/types";
import { httpMethodColors } from "@/utils";

interface Props {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  method: HttpMethod;
  setMethod: Dispatch<SetStateAction<HttpMethod>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const TitleBar: React.FC<Props> = ({
  url,
  setUrl,
  method,
  setMethod,
  onSubmit,
}) => (
  <form className="flex bg-black bg-opacity-40 -mb-2 ps-20" onSubmit={onSubmit}>
    <select
      className={`bg-transparent text-blue-400 px-2 rounded-none ${httpMethodColors[method]}`}
      value={method}
      onChange={(e) => setMethod(e.target.value as any)}
    >
      {httpMethods.map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
    <input
      id="greet-input"
      placeholder="Enter a URL"
      className="bg-transparent flex-1  py-[0.35rem] px-4 text-white"
      onChange={(e) => setUrl(e.target.value)}
      value={url}
    />
    <button
      type="submit"
      className="bg-fuchsia-800 text-white px-5 bg-opacity-50 hover:bg-opacity-70 active:bg-opacity-30 transition-all duration-100"
    >
      Send
    </button>
  </form>
);

export default TitleBar;
