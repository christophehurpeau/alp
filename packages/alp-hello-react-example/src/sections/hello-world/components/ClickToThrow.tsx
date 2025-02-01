import { appLogger } from "nightingale-app-console";
import type { ReactNode } from "react";
import { Button } from "tamagui";

const clickToThrowLogger = appLogger.child("counter");

export default function ClickToThrow(): ReactNode {
  return (
    <div>
      <Button
        onPress={() => {
          throw new Error("Error on click");
        }}
      >
        Click me to throw
      </Button>
      <Button
        onPress={() => {
          clickToThrowLogger.error(new Error("Error on click"));
        }}
      >
        Click me to log error
      </Button>
    </div>
  );
}
