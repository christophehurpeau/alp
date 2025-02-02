import { Stack, Typography } from "alouette";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import InputName from "./InputNameComponent";

interface HelloComponentProps {
  name: string | undefined;
  onChangeName: (name: string) => void;
}

export default function HelloComponent({
  name,
  onChangeName,
}: HelloComponentProps): ReactNode {
  return (
    <Stack alignItems="center" paddingTop="10%">
      <Stack width="60%">
        <Typography size="lg" data-testid="hello-text">
          <FormattedMessage
            id="HelloComponent.text"
            defaultMessage="Hello {name}!"
            values={{ name: name || "World" }}
          />
        </Typography>
        <InputName value={name} onChange={onChangeName} />
      </Stack>
    </Stack>
  );
}
