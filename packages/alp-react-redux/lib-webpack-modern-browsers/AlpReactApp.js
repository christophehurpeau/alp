import React from 'react';
/* eslint-disable prefer-template */
import { Helmet, App as DefaultApp } from 'fody';


export default ((_ref) => {
  var children = _ref.children,
      context = _ref.context,
      moduleDescriptor = _ref.moduleDescriptor,
      scriptName = _ref.scriptName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext;

  var version = context.config.get('version');
  var moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;
  if (!version) throw new Error('Invalid version');

  return React.createElement(
    DefaultApp,
    { context: context },
    React.createElement(
      'div',
      { className: 'react-app' },
      null,
      children
    )
  );
});
//# sourceMappingURL=AlpReactApp.js.map