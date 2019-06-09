// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import 'symbol-observable'; // TODO Remove this once https://github.com/acdlite/recompose/pull/660 is merged

import React from 'react';
import { from } from 'rxjs';
import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';
import { setObservableConfig } from 'recompose';

import App from './App';
import rootStore from './stores';
import './index.css';

// Show debug logs
window.localStorage.debug = 'leona*,@susy*'; // https://github.com/visionmedia/debug#browser-support

// Set recompose to use RxJS
// https://github.com/acdlite/recompose/blob/master/docs/API.md#setobservableconfig
setObservableConfig({
  // Converts a plain ES observable to an RxJS 5 observable
  fromESObservable: from,
  toESObservable: x => x
});

ReactDOM.render(
  <Provider {...rootStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
