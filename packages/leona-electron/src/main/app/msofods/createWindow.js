// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

const { BrowserWindow } = electron;

function createWindow (leonaApp) {
  const {
    createPositioner,
    options,
    setupAppListeners,
    setupMenu,
    setupRequestListeners
  } = leonaApp;

  leonaApp.emit('create-app');

  setupAppListeners(leonaApp);

  leonaApp.emit('create-window');

  leonaApp.win = new BrowserWindow(options);

  if (options.showOnAllWorkspaces !== false) {
    leonaApp.win.setVisibleOnAllWorkspaces(true);
  }

  setupMenu(leonaApp);

  // Opens file:///path/to/build/index.html in prod mode, or whatever is
  // passed to ELECTRON_START_URL
  leonaApp.win.loadURL(options.index);

  createPositioner(leonaApp);
  setupRequestListeners(leonaApp);

  leonaApp.emit('after-create-window');
}

export default createWindow;
