import type { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Text, Stack } from 'tamagui';
import InputName from './InputNameComponent';

interface HelloComponentProps {
  name: string | undefined;
  onChangeName: (name: string) => void;
}

export default function HelloComponent({
  name,
  onChangeName,
}: HelloComponentProps): ReactElement {
  return (
    <Stack alignItems="center" paddingTop="10%">
      <Stack width="60%">
        <Text fontSize="$6" data-testid="hello-text">
          <FormattedMessage
            id="HelloComponent.text"
            defaultMessage="Hello {name}!"
            values={{ name: name || 'World' }}
          />
        </Text>
        <InputName value={name} onChange={onChangeName} />
      </Stack>
    </Stack>
  );
}
