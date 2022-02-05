/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';
import ReactAlpContext from 'react-alp-context';
import HomePage from '.';

function renderWithAlpContext(
  component: ReactNode,
  query: Record<string, string> = {},
) {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([name, value]) => {
    searchParams.append(name, value);
  });
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const ctx: any = {
    request: { query, searchParams },
    t: (id: string, params: any) => `${id} ; ${JSON.stringify(params)}`,
  };
  return render(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <ReactAlpContext.Provider value={ctx}>
      {component}
    </ReactAlpContext.Provider>,
  );
}

describe('HelloComponent', () => {
  test('hello without name', () => {
    const { getByTestId } = renderWithAlpContext(<HomePage />);
    expect(getByTestId('hello-text')).toMatchInlineSnapshot(`
      <span
        class="hello"
        data-testid="hello-text"
      >
        Hello {name}! ; {"name":"World"}
      </span>
    `);
  });

  test('hello with name', () => {
    const { getByTestId } = renderWithAlpContext(<HomePage />, {
      name: 'John',
    });
    expect(getByTestId('hello-text')).toMatchInlineSnapshot(`
      <span
        class="hello"
        data-testid="hello-text"
      >
        Hello {name}! ; {"name":"John"}
      </span>
    `);

    const input = getByTestId('input-name');
    act(() => {
      fireEvent.change(input, { target: { value: 'Jane' } });
    });
    expect(getByTestId('hello-text')).toMatchInlineSnapshot(`
      <span
        class="hello"
        data-testid="hello-text"
      >
        Hello {name}! ; {"name":"Jane"}
      </span>
    `);
  });
});
