import { Panel } from "@/utils/types";

interface HeaderProps {
  selectedPanel: Panel;
  panel: Panel;
  onClick: (panel: Panel) => void;
  count: number;
  isMiddle: boolean;
}

const RequestPanelSelectorHeader: React.FC<HeaderProps> = ({
  selectedPanel,
  panel,
  onClick,
  count,
  isMiddle,
}) => {
  const isSelected = selectedPanel === panel;

  return (
    <button
      onClick={() => onClick(panel)}
      className={`bg-black text-white border-black px-2 py-1 flex-1 ${
        isSelected
          ? "bg-opacity-40"
          : "bg-opacity-0 text-opacity-50 border-b-[0.5px] border-t-[0.5px]"
      }
      ${isMiddle && "border-r-[0.5px] border-l-[0.5px]"}
    `}
    >
      {panel} - {count}
    </button>
  );
};

export default RequestPanelSelectorHeader;
