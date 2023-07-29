import { appLogger } from 'nightingale-app-console';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button } from 'tamagui';

const counterLogger = appLogger.child('counter');

export default function Counter(): ReactElement {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <Button
        type="button"
        onPress={() => {
          counterLogger.info('inc', { count });
          setCount(count + 1);
        }}
      >
        Click me
      </Button>
    </div>
  );
}
