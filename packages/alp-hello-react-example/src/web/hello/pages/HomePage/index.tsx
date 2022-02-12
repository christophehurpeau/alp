import { Helmet } from 'alp-react';
import { appLogger } from 'nightingale-app-console';
import type { ReactElement } from 'react';
import { useContext, useEffect, useState } from 'react';
import ReactAlpContext from 'react-alp-context';
import { useT } from 'react-alp-translate';
import ClickToThrow from './components/ClickToThrow';
import Counter from './components/Counter';
import Hello from './components/HelloComponent';

const logger = appLogger.child('HomePage');

function HelloWorld(): ReactElement {
  return <div>Hello World !</div>;
}

export default function HomePage(): ReactElement {
  const ctx = useContext(ReactAlpContext);
  const [name, setName] = useState((): string | undefined => {
    return ctx.request.searchParams.get('name') ?? '';
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
