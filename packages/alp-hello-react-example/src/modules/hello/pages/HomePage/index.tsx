import React, { Component } from 'react';
import ReactAlpContext from 'react-alp-context';
import { Helmet } from 'alp-react';
import T from 'react-alp-translate';
import { appLogger } from 'nightingale-app-console';
import Hello from './components/HelloComponent';

const logger = appLogger.child('HomePage');

export default class IndexView extends Component {
  static contextType = ReactAlpContext;

  state = {
    name: undefined,
  };

  // eslint-disable-next-line react/sort-comp
  context!: React.ContextType<typeof ReactAlpContext>;

  componentDidMount(): void {
    const queryParams = this.context.searchParams;
    if (queryParams.name) {
      this.setState({ name: queryParams.name });
    }
  }

  handleChangeName = (newName: string) => {
    logger.info('name changed', { newName });
    if (this.state.name === newName) return;

    this.setState({ name: newName }, () => {
      const queryParams = this.context.searchParams;
      if (!newName) {
        queryParams.delete('name');
      } else {
        queryParams.set('name', newName);
      }

      const queryString = queryParams.toString();
      logger.info('new queryString', { queryString });

      history.replaceState(
        { name: newName },
        document.title,
        (location.pathname.slice(0, -(location.search.length - 1)) || '/') +
          (queryString && `?${queryString}`),
      );
    });
  };

  render() {
    console.log('render');
    const { name } = this.state;
    return (
      <div>
        <T id="Hello {name}!" name={name || 'World'}>
          {(title) => <Helmet title={title} />}
        </T>
        <Hello name={name} onChangeName={this.handleChangeName} />
      </div>
    );
  }
}
