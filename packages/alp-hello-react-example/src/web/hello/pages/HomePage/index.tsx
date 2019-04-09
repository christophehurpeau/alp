import React, { useContext, useEffect, useState } from 'react';
import ReactAlpContext from 'react-alp-context';
import { Helmet } from 'alp-react';
import { useT } from 'react-alp-translate';
import { appLogger } from 'nightingale-app-console';
import Hello from './components/HelloComponent';

const logger = appLogger.child('HomePage');

export default function IndexView() {
  console.log('render');
  const ctx = useContext(ReactAlpContext);
  const [name, setName] = useState('');

  const handleChangeName = (newName: string) => {
    logger.info('name changed', { newName });
    if (name === newName) return;
    setName(newName);
  };

  useEffect(() => {
    const queryParams = ctx.searchParams;
    if (queryParams.name) {
      setName(queryParams.name);
    }
  });

  useEffect(() => {
    const queryParams = ctx.searchParams;
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
  }, [name]);

  const title = useT('Hello {name}!', { name: name || 'World' }, [name]);
  return (
    <div>
      <Helmet title={title} />
      <Hello name={name} onChangeName={handleChangeName} />
    </div>
  );
}
