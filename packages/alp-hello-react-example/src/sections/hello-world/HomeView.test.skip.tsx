/* eslint-disable @typescript-eslint/no-floating-promises */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { AlouetteProvider } from "alouette";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import TamaguiConfig from "../../tamagui.config";
import { HomeView } from "./HomeView";

function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <AlouetteProvider tamaguiConfig={TamaguiConfig}>
      <IntlProvider locale="en" defaultLocale="en">
        {children}
      </IntlProvider>
    </AlouetteProvider>
  );
}

describe("HomeView", () => {
  test("hello without name", () => {
    render(<HomeView />, { wrapper: Providers });
    assert.ok(screen.getByTestId("hello-text"));
  });

  test("hello with name", () => {
    // TODO pass query params: name=John
    render(<HomeView />, { wrapper: Providers });

    // expect(getByTestId('hello-text')).toMatchInlineSnapshot(`
    //   <span
    //     class="h199brc1"
    //     data-testid="hello-text"
    //   >
    //     Hello {name}! ; {"name":"John"}
    //   </span>
    // `);

    // https://github.com/tamagui/tamagui/issues/1329
    const input = screen.getByLabelText("Input your name");
    act(() => {
      fireEvent.change(input, { target: { value: "Jane" } });
    });
    assert.equal(screen.getByTestId("hello-text").textContent, "Hello Jane!");
  });
});
