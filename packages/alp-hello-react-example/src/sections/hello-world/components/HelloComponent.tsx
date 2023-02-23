import { Center, Text, View } from 'native-base';
import type { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import InputName from './InputNameComponent';

interface HelloComponentProps {
  name: undefined | string;
  onChangeName: (name: string) => void;
}

export default function HelloComponent({
  name,
  onChangeName,
}: HelloComponentProps): ReactElement {
  return (
    <Center pt="10%">
      <View width="60%">
        <Text fontSize="lg" data-testid="hello-text">
          <FormattedMessage
            id="HelloComponent.text"
            defaultMessage="Hello {name}!"
            values={{ name: name || 'World' }}
          />
        </Text>
        <InputName value={name} onChange={onChangeName} />
      </View>
    </Center>
  );
}
