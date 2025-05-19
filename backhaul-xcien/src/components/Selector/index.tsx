import { ChangeEventHandler, Dispatch, FC, SetStateAction } from "react";
import { Select, SelectItem } from "@heroui/react";
import { SelectOption } from "./types";


interface Props {
  options: SelectOption[];
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<string>>;
}

const Selector: FC<Props> = ({
  options,
  selectedValue,
  setSelectedValue,
}) => {

  const handleSelectionChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <Select
      disallowEmptySelection
      onChange={handleSelectionChange}
      selectedKeys={[selectedValue]}
      selectionMode="single"
    >
      {options.map((option) => (
        <SelectItem key={option.key}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  )
}

export default Selector;