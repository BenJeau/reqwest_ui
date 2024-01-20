import { Panel, panels } from "@/utils/types";

import RequestPanelSelectorHeader from "./RequestPanelSelectorHeader";

interface Props {
  selectedPanel: Panel;
  setSelectedPanel: (panel: Panel) => void;
  counts: { [key in Panel]: number };
}

const RequestPanelSelector: React.FC<Props> = ({
  selectedPanel,
  setSelectedPanel,
  counts,
}) => (
  <div className="flex">
    {panels.map((key, i) => (
      <RequestPanelSelectorHeader
        key={key}
        selectedPanel={selectedPanel}
        panel={key}
        isMiddle={i !== 0 && i !== panels.length - 1}
        count={counts[key]}
        onClick={setSelectedPanel}
      />
    ))}
  </div>
);

export default RequestPanelSelector;
