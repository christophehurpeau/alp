import { appLogger } from "nightingale-app-console";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "tamagui";

const counterLogger = appLogger.child("counter");

export default function Counter(): ReactNode {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <Button
        onPress={() => {
          counterLogger.info("inc", { count });
          setCount(count + 1);
        }}
      >
        Click me
      </Button>
    </div>
  );
}
