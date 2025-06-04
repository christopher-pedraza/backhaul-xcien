import {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
} from "react";
import { Select, SelectItem } from "@heroui/react";
import { SelectOption } from "./types";
import { useChangeLogContext } from "@/hooks/useChangeLogContext";

interface Props {
  isLoadingOptions: boolean;
  options: SelectOption[];
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<string>>;
  width?: string | number;
}

const Selector: FC<Props> = ({
  isLoadingOptions,
  options,
  selectedValue,
  setSelectedValue,
  width,
}) => {
  const { switchTopology } = useChangeLogContext();

  // set the first option as selected if no value is selected
  useEffect(() => {
    if (!selectedValue && options.length > 0) {
      setSelectedValue(options[0].key);
      switchTopology(options[0].key); // Switch to the first topology when options are loaded
    }
  }, [options]);

  const handleSelectionChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    switchTopology(e.target.value); // Clear the change log when a new selection is made
    setSelectedValue(e.target.value);
  };

  return (
    <Select
      disallowEmptySelection
      onChange={handleSelectionChange}
      selectedKeys={[selectedValue]}
      selectionMode="single"
      className="shadow shadow-gray-400 rounded-lg"
      style={width ? { width } : {}}
    >
      {isLoadingOptions ? (
        <SelectItem key="loading">Cargando…</SelectItem>
      ) : (
        options.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))
      )}
    </Select>
  );
};

export default Selector;
