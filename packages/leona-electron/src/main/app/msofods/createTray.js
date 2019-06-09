// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { Tray } from 'electron';

function createTray (leonaApp) {
  const {
    app: { dock },
    options
  } = leonaApp;

  if (options.withTaskbar) {
    leonaApp.tray = new Tray(options.icon);

    if (process.platform === 'darwin' && dock) {
      dock.setIcon(options.iconDock);
    }
  }
}

export default createTray;
