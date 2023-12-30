import { appLogger } from 'nightingale-app-console';
import type { ReactElement } from 'react';
import { Button } from 'tamagui';

const clickToThrowLogger = appLogger.child('counter');

export default function ClickToThrow(): ReactElement {
  return (
    <div>
      <Button
        onPress={() => {
          throw new Error('Error on click');
        }}
      >
        Click me to throw
      </Button>
      <Button
        onPress={() => {
          clickToThrowLogger.error(new Error('Error on click'));
        }}
      >
        Click me to log error
      </Button>
    </div>
  );
}
