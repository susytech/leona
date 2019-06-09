// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { app, dialog, shell } from 'electron';

import { bugs, name, susy } from '../../../../package.json';
import Pino from './pino';

const logFile = `${app.getPath('userData')}/${name}.log`;
const pino = Pino();

export default (err, message = 'An error occurred.') => {
  pino.error(err);
  dialog.showMessageBox(
    {
      buttons: ['OK', 'Open logs'],
      defaultId: 0, // Default button id
      detail: `Please file an issue at ${
        bugs.url
      }. Please attach the following debugging info:
      
OS: ${process.platform}
Arch: ${process.arch}
Channel: ${susy.channel}
Error: ${err.message}

Please also attach the contents of the following file:
${logFile}.
Click on "Open logs" to open this file.`,
      message: `${message}`,
      title: 'Susy Error',
      type: 'error'
    },
    buttonId => {
      switch (buttonId) {
        case 1:
          shell.openItem(logFile);
          break;
        default:
          app.exit(1);
      }
    }
  );
};
