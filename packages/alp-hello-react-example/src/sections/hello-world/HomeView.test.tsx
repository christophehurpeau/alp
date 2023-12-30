/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { TamaguiProvider } from 'tamagui';
import TamaguiConfig from '../../tamagui.config';
import { HomeView } from './HomeView';

function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <TamaguiProvider config={TamaguiConfig}>
      <IntlProvider locale="en" defaultLocale="en">
        {children}
      </IntlProvider>
    </TamaguiProvider>
  );
}

describe('HomeView', () => {
  test('hello without name', () => {
    render(<HomeView />, { wrapper: Providers });
    expect(screen.getByTestId('hello-text')).toMatchSnapshot();
  });

  test('hello with name', () => {
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
    const input = screen.getByLabelText('Input your name');
    act(() => {
      fireEvent.change(input, { target: { value: 'Jane' } });
    });
    expect(screen.getByTestId('hello-text')).toMatchSnapshot();
  });
});
