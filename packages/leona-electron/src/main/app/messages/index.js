// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { checkClockSync, signerNewToken } from '@susy-js/electron';
import settings from 'electron-settings';

import { bundledSusyPath } from '../utils/paths';
import cli from '../cli';
import Pino from '../utils/pino';
import { TRUSTED_LOOPBACK } from '../constants';

const pino = Pino();

/**
 * Handle all asynchronous messages from renderer to main.
 */
export default async (leonaApp, event, data) => {
  try {
    pino.debug(
      `Received IPC message from ${data.from}, with data ${JSON.stringify(
        data
      )}`
    );
    if (!data) {
      return;
    }

    switch (data.action) {
      case 'APP_RIGHT_CLICK_REQUEST': {
        if (!leonaApp.win) {
          return;
        }
        leonaApp.contextWindowMenu.getMenu().popup({ window: leonaApp.win });
        break;
      }
      case 'CHECK_CLOCK_SYNC_REQUEST': {
        const payload = await checkClockSync();
        event.sender.send('send-to-renderer', {
          action: 'CHECK_CLOCK_SYNC_RESPONSE',
          from: 'leona:electron',
          payload
        });

        break;
      }
      case 'SET_LANGUAGE_REQUEST': {
        event.sender.send('send-to-renderer', {
          action: 'SET_LANGUAGE_RESPONSE',
          from: 'leona:electron',
          payload: settings.get('leona-language')
        });
        break;
      }
      case 'SIGNER_NEW_TOKEN_REQUEST': {
        const token = await signerNewToken({ susyPath: bundledSusyPath });
        // Send back the token to the renderer process
        event.sender.send('send-to-renderer', {
          action: 'SIGNER_NEW_TOKEN_RESPONSE',
          from: 'leona:electron',
          payload: token
        });
        break;
      }
      case 'WS_INTERFACE_REQUEST': {
        event.sender.send('send-to-renderer', {
          action: 'WS_INTERFACE_RESPONSE',
          from: 'leona:electron',
          payload: TRUSTED_LOOPBACK
        });

        break;
      }
      case 'WS_PORT_REQUEST': {
        event.sender.send('send-to-renderer', {
          action: 'WS_PORT_RESPONSE',
          from: 'leona:electron',
          payload: cli.wsPort
        });

        break;
      }
      default:
    }
  } catch (err) {
    pino.error(err);
  }
};
