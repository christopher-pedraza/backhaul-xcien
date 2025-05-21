import {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
} from "react";
import { Select, SelectItem } from "@heroui/react";
import { SelectOption } from "./types";

interface Props {
  isLoadingOptions: boolean;
  options: SelectOption[];
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<string>>;
}

const Selector: FC<Props> = ({
  isLoadingOptions,
  options,
  selectedValue,
  setSelectedValue,
}) => {
  // set the first option as selected if no value is selected
  useEffect(() => {
    if (!selectedValue && options.length > 0) {
      setSelectedValue(options[0].key);
    }
  }, [options]);

  const handleSelectionChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <Select
      disallowEmptySelection
      onChange={handleSelectionChange}
      selectedKeys={[selectedValue]}
      selectionMode="single"
      className="shadow shadow-gray-400 rounded-lg" 

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
