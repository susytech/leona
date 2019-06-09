// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

function loadTray (leonaApp) {
  const { app, onTrayClick, options, showTrayBalloon, tray } = leonaApp;

  if (options.withTaskbar) {
    leonaApp.emit('load-tray');

    if (process.platform === 'darwin' && app.dock && !options.showDockIcon) {
      app.dock.hide();
    }

    // Note: See https://github.com/RocketChat/Rocket.Chat.Electron/issues/44
    if (process.platform === 'win32') {
      showTrayBalloon(leonaApp);
    }

    tray.setContextMenu(leonaApp.contextTrayMenu.getMenu());

    // Right-click event listener does not work on Windows
    tray.on('right-click', () => {
      pino.info('Detected right-click on tray icon');

      tray.popUpContextMenu();
      leonaApp.win.focus();
    });

    // Single click event listener works on Windows
    tray.on('click', () => {
      pino.info('Detected single click on tray icon');

      onTrayClick(leonaApp);
      leonaApp.win.focus();
    });
    tray.setToolTip(options.tooltip);
    tray.setHighlightMode('never');
  }
}

export default loadTray;
