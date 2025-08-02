import { Stack, Typography, VStack } from "alouette";
import Head from "next/head";
import { appLogger } from "nightingale-app-console";
import { useState } from "react";
import type { ReactNode } from "react";
import { defineMessages, useIntl } from "react-intl";
import ClickToThrow from "./components/ClickToThrow";
import Counter from "./components/Counter";
import Hello from "./components/HelloComponent";
import { ToggleTheme } from "./components/ToggleTheme";

const logger = appLogger.child("HomePage");

function HelloWorld(): ReactNode {
  return <Typography>Hello World !</Typography>;
}

const messages = defineMessages({
  title: {
    id: "HomeView.title",
    defaultMessage: "Hello {name}!",
  },
});

export function HomeView(): ReactNode {
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
    <Stack padding="$4" $medium={{ padding: "$8" }}>
      <Head>
        <title>
          {intl.formatMessage(messages.title, { name: name || "World" })}
        </title>
      </Head>
      <VStack gap={1}>
        <ToggleTheme />
        <HelloWorld />
        <Hello name={name} onChangeName={handleChangeName} />
        <Counter />
        <ClickToThrow />
      </VStack>

      <div>
        <a href="/auth">Auth</a>
      </div>
    </Stack>
  );
}
