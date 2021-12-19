import { Helmet } from 'alp-react';
import { appLogger } from 'nightingale-app-console';
// eslint-disable-next-line import/no-extraneous-dependencies
import ObjectAssign from 'object-assign';
import type { ReactElement } from 'react';
import React, { useContext, useEffect, useState } from 'react';
import ReactAlpContext from 'react-alp-context';
import { useT } from 'react-alp-translate';
import ClickToThrow from './components/ClickToThrow';
import Counter from './components/Counter';
import Hello from './components/HelloComponent';

const logger = appLogger.child('HomePage');

function HelloWorld(): ReactElement {
  return <div>Hello World !</div>;
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
(async function test() {
  console.log(
    await new Promise((resolve) => {
      resolve('ok');
    }),
  );

  console.log(ObjectAssign({}, { a: true }));
})();

export default function IndexView(): ReactElement {
  const ctx = useContext(ReactAlpContext);
  const [name, setName] = useState((): string | undefined => {
    if (ctx.request.query.name) {
      return ctx.request.query.name as string | undefined;
    }
    return '';
  });
  logger.info('render', { name });

  const handleChangeName = (newName: string): void => {
    logger.info('name changed', { newName });
    if (name === newName) return;
    setName(newName);
  };

  useEffect(() => {
    const queryParams = ctx.request.searchParams;
    if (!name) {
      queryParams.delete('name');
    } else {
      queryParams.set('name', name);
    }

    const queryString = queryParams.toString();
    logger.info('new queryString', { queryString });

    const location = window.location;
    window.history.replaceState(
      { name },
      document.title,
      (location.pathname.slice(0, -(location.search.length - 1)) || '/') +
        (queryString && `?${queryString}`),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const title = useT('Hello {name}!', { name: name || 'World' }, [name]);
  return (
    <div>
      <Helmet title={title} />
      <HelloWorld />
      <Hello name={name} onChangeName={handleChangeName} />
      <Counter />
      <ClickToThrow />
    </div>
  );
}
