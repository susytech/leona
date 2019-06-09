// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { productName } from '../../../../electron-builder.json';
import { getSavedWindowPosition } from '../settings';
import Pino from '../utils/pino';

const pino = Pino();

function setupAppListeners (leonaApp) {
  leonaApp.on('create-app', () => {
    pino.info(
      `Starting ${productName} (${
        leonaApp.options.withTaskbar ? 'with' : 'without'
      } tray icon)...`
    );
  });

  leonaApp.on('create-window', () => {
    pino.info('Creating window');
  });

  leonaApp.on('after-create-window', () => {
    pino.info('Finished creating window');
  });

  leonaApp.on('load-tray', () => {
    pino.info('Configuring taskbar mode for the window');
  });

  leonaApp.on('show-window', () => {
    pino.info('Showing window');
  });

  leonaApp.on('after-show-window', () => {
    pino.info('Finished showing window');
  });

  leonaApp.on('after-create-app', () => {
    pino.info(`Ready to use ${productName}`);
  });

  leonaApp.on('minimize-window', () => {
    pino.info('Minimized window');
  });

  leonaApp.on('hide-window', () => {
    pino.info('Hiding window');
  });

  leonaApp.on('after-hide-window', () => {
    pino.info('Finished hiding window');
  });

  leonaApp.on('blur-window', () => {
    pino.info('Blur window');
  });

  leonaApp.on('after-moved-window-position-saved', () => {
    const pos = getSavedWindowPosition();

    pino.info(`Saved window position after move (x: ${pos.x}, y: ${pos.y})`);
  });

  leonaApp.on('moved-window-up-into-view', () => {
    pino.info('Moved window up into view');
  });

  leonaApp.on('after-close-window', () => {
    pino.info('Deleted window upon close');
  });

  leonaApp.on('error', error => {
    console.error(error);
  });
}

export default setupAppListeners;
