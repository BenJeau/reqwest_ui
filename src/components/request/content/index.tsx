import { Response } from "@/components";
import { useExecuteRequest } from "@/commands";
import { Panel } from "@/utils/types";

import Body, { BodyProps } from "./Body";
import Headers, { HeadersProps } from "./Headers";
import Params, { ParamsProps } from "./Params";

interface Props extends BodyProps, HeadersProps, ParamsProps {
  selectedPanel: Panel;
  response: ReturnType<typeof useExecuteRequest>["data"];
}

const PanelContent: {
  [key in Panel]: React.FC<Omit<Props, "selectedPanel" | "response">>;
} = {
  Body,
  Headers,
  Params,
};

const RequestPanelContent: React.FC<Props> = ({
  selectedPanel,
  params,
  setParams,
  headers,
  setHeaders,
  body,
  setBody,
  response,
}) => (
  <div className="flex flex-col flex-1 -mt-2">
    <div className="border-b-[0.5px] border-black text-white overflow-x-scroll overflow-y-scroll">
      {PanelContent[selectedPanel]({
        params,
        setParams,
        headers,
        setHeaders,
        body,
        setBody,
      })}
    </div>
    <Response response={response} />
  </div>
);

export default RequestPanelContent;
