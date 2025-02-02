import { Button, TypographyParagraph } from "alouette";
import { appLogger } from "nightingale-app-console";
import type { ReactNode } from "react";
import { useState } from "react";

const counterLogger = appLogger.child("counter");

export default function Counter(): ReactNode {
  const [count, setCount] = useState(0);
  return (
    <div>
      <TypographyParagraph>You clicked {count} times</TypographyParagraph>
      <Button
        text="Click me"
        onPress={() => {
          counterLogger.info("inc", { count });
          setCount(count + 1);
        }}
      />
    </div>
  );
}
