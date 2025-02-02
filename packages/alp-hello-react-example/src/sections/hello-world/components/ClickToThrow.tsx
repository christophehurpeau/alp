import { Button } from "alouette";
import { appLogger } from "nightingale-app-console";
import type { ReactNode } from "react";

const clickToThrowLogger = appLogger.child("counter");

export default function ClickToThrow(): ReactNode {
  return (
    <div>
      <Button
        text="Click me to throw"
        onPress={() => {
          throw new Error("Error on click");
        }}
      />
      <Button
        text="Click me to log error"
        onPress={() => {
          clickToThrowLogger.error(new Error("Error on click"));
        }}
      />
    </div>
  );
}
