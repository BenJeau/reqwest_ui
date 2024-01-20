import { useEffect, useState } from "react";

import { Request, TitleBar } from "@/components";
import { useExecuteRequest } from "@/commands";
import { HttpMethod, Header, Panel, panels, Param } from "@/utils/types";

const Home = () => {
  const [url, setUrl] = useState("https://google.com");
  const [method, setMethod] = useState<HttpMethod>("GET");

  const [selectedPanel, setSelectedPanel] = useState<Panel>(panels[0]);

  const [body, setBody] = useState("");
  const [params, setParams] = useState<Param[]>([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState<Header[]>([
    { enabled: true, key: "", value: "" },
  ]);

  const executeRequest = useExecuteRequest();

  useEffect(() => {
    try {
      const addr = new URL(url.startsWith("http") ? url : `https://${url}`);
      console.log(addr.search);
      if (addr.search === "") {
        if (params.length === 1) return;
        return setParams([
          {
            key: "",
            value: "",
          },
        ]);
      }
      if (
        url[url.length - 1] === "?" ||
        addr.search[addr.search.length - 1] === "&" ||
        addr.search[addr.search.length - 1] === "="
      ) {
        return;
      }
      const addrParams = [] as Param[];
      addr.searchParams.forEach((value, key) => {
        addrParams.push({ key, value });
      });
      addrParams.push({ key: "", value: "" });
      setParams(addrParams);
    } catch (error) {
      console.log(error);
      setParams([{ key: "", value: "" }]);
    }
  }, [url, setParams]);

  useEffect(() => {
    try {
      if (url[url.length - 1] === "?" && params.length === 1) return;
      let searchParams = "";
      params.forEach(({ key, value }) => {
        if (key === "" && value === "") return;
        if (searchParams === "") {
          searchParams += "?";
        } else {
          searchParams += "&";
        }
        if (value === "") return (searchParams += `${key}`);
        searchParams += `${key}=${value}`;
      });
      const hasHttp = url.startsWith("http");
      const addr = new URL(hasHttp ? url : `https://${url}`);
      addr.search = searchParams;
      setUrl(hasHttp ? addr.toString() : addr.toString().slice(8));
    } catch (error) {
      console.log(error);
    }
  }, [params, setUrl]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await executeRequest.mutateAsync({
      url,
      method,
      headers,
    });
  };

  return (
    <main
      className="flex flex-col min-h-screen gap-2 text-xs"
      data-tauri-drag-region
    >
      <div className="flex flex-col gap-2 flex-1" data-tauri-drag-region>
        <TitleBar
          url={url}
          setUrl={setUrl}
          method={method}
          setMethod={setMethod}
          onSubmit={handleOnSubmit}
        />
        <Request.PanelSelector
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
          counts={{
            Params: params.length - 1,
            Headers: headers.length - 1,
            Body: body.length,
          }}
        />
        <Request.PanelContent
          selectedPanel={selectedPanel}
          params={params}
          setParams={setParams}
          headers={headers}
          setHeaders={setHeaders}
          body={body}
          setBody={setBody}
          response={executeRequest.data}
        />
      </div>
    </main>
  );
};

export default Home;
