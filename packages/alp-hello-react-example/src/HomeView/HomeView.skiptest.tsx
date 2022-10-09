/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render } from '@testing-library/react';
import { NativeBaseProvider } from 'native-base';
import type { ReactNode } from 'react';
import ReactAlpContext from 'react-alp-context';
import { HomeView } from './HomeView';

// function renderWithAlpContext(
//   component: ReactNode,
//   query: Record<string, string> = {},
// ) {
//   const searchParams = new URLSearchParams();
//   Object.entries(query).forEach(([name, value]) => {
//     searchParams.append(name, value);
//   });
//   // eslint-disable-next-line react/jsx-no-constructed-context-values
//   const ctx: any = {
//     request: { query, searchParams },
//     t: (id: string, params: any) => `${id} ; ${JSON.stringify(params)}`,
//   };
//   return render(
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     <ReactAlpContext.Provider value={ctx}>
//       {component}
//     </ReactAlpContext.Provider>,
//   );
// }

const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe('HomeView', () => {
  test('hello without name', () => {
    const { getByTestId } = render(
      <NativeBaseProvider initialWindowMetrics={inset}>
        <HomeView />
      </NativeBaseProvider>,
    );
    expect(getByTestId('hello-text')).toMatchInlineSnapshot(`
      <span
        class="h199brc1"
        data-testid="hello-text"
      >
        Hello {name}! ; {"name":"World"}
      </span>
    `);
  });

  // test('hello with name', () => {
  //   const { getByTestId } = renderWithAlpContext(<HomeView />, {
  //     name: 'John',
  //   });
  //   expect(getByTestId('hello-text')).toMatchInlineSnapshot(`
  //     <span
  //       class="h199brc1"
  //       data-testid="hello-text"
  //     >
  //       Hello {name}! ; {"name":"John"}
  //     </span>
  //   `);

  //   const input = getByTestId('input-name');
  //   act(() => {
  //     fireEvent.change(input, { target: { value: 'Jane' } });
  //   });
  //   expect(getByTestId('hello-text')).toMatchInlineSnapshot(`
  //     <span
  //       class="h199brc1"
  //       data-testid="hello-text"
  //     >
  //       Hello {name}! ; {"name":"Jane"}
  //     </span>
  //   `);
  // });
});
