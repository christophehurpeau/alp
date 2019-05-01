import { hot } from 'react-hot-loader/root';
import React, { ReactElement } from 'react';
import HelloModule from '../hello/HelloModule';

const App = (): ReactElement => <HelloModule />;

export default hot(App);
