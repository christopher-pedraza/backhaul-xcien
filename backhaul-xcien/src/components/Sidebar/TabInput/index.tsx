import { Input } from "@heroui/react";

interface TabInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  errors: Array<string>;
  hasChanges: boolean;
}

export default function TabInput({
  label,
  value,
  setValue,
  errors,
  hasChanges,
}: TabInputProps) {
  var inputClass = hasChanges ? "italic" : "";
  return (
    <Input
      errorMessage={() => (
        <ul>
          {errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      )}
      isInvalid={errors.length > 0}
      label={label}
      value={value}
      onValueChange={setValue}
      isRequired={hasChanges}
      variant="underlined"
      className="pb-4"
      size="lg"
      classNames={{ input: inputClass }}
    />
  );
}
