import { InputText } from "alouette";
import type { ReactNode } from "react";
import { useState } from "react";

interface InputNameComponentProps {
  value: string | undefined;
  onChange: (name: string) => void;
}

export default function InputNameComponent({
  value: initialValue,
  onChange,
}: InputNameComponentProps): ReactNode {
  const [value, setValue] = useState(initialValue);

  return (
    <InputText
      // https://github.com/tamagui/tamagui/issues/1329
      testID="input-name"
      autoComplete="off"
      aria-label="Input your name"
      value={value}
      onChangeText={(newValue) => {
        setValue(newValue);
        onChange(newValue);
      }}
    />
  );
}
