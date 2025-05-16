import {
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Skeleton,
} from "@heroui/react";

interface TabInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  errors: Array<string>;
}

export default function TabInput({
  label,
  value,
  setValue,
  errors,
}: TabInputProps) {
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
      variant="underlined"
      className="pb-4"
      size="lg"
    />
  );
}
