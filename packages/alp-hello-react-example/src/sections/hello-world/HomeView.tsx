import Head from "next/head";
import { appLogger } from "nightingale-app-console";
import { useState } from "react";
import type { ReactElement } from "react";
import { useIntl, defineMessages } from "react-intl";
import { Stack, YStack } from "tamagui";
import ClickToThrow from "./components/ClickToThrow";
import Counter from "./components/Counter";
import Hello from "./components/HelloComponent";
import { ToggleTheme } from "./components/ToggleTheme";

const logger = appLogger.child("HomePage");

function HelloWorld(): ReactElement {
  return <div>Hello World !</div>;
}

const messages = defineMessages({
  title: {
    id: "HomeView.title",
    defaultMessage: "Hello {name}!",
  },
});

export function HomeView(): ReactElement {
  const [name, setName] = useState((): string | undefined => {
    return "";
  });
  logger.info("render", { name });

  const handleChangeName = (newName: string): void => {
    logger.info("name changed", { newName });
    if (name === newName) return;
    setName(newName);
  };

  // useEffect(() => {
  // setSearchParams((queryParams) => {
  //   if (!name) {
  //     queryParams.delete('name');
  //   } else {
  //     queryParams.set('name', name);
  //   }
  // });

  // }, [name]);

  const intl = useIntl();
  return (
    <Stack padding="$4" $md={{ padding: "$8" }}>
      <Head>
        <title>
          {intl.formatMessage(messages.title, { name: name || "World" })}
        </title>
      </Head>
      <YStack space>
        <ToggleTheme />
        <HelloWorld />
        <Hello name={name} onChangeName={handleChangeName} />
        <Counter />
        <ClickToThrow />
      </YStack>

      <div>
        <a href="/auth">Auth</a>
      </div>
    </Stack>
  );
}
