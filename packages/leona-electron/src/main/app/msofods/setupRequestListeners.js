// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import messages from '../messages';

const { ipcMain, session } = electron;

function setupRequestListeners (leonaApp) {
  // Listen to messages from renderer process
  ipcMain.on('send-to-main', (...args) => {
    return messages(leonaApp, ...args);
  });

  // WS calls have Origin `file://` by default, which is not trusted.
  // We override Origin header on all WS connections with an authorized one.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ['ws://*/*', 'wss://*/*']
    },
    (details, callback) => {
      if (!leonaApp.win || !leonaApp.win.id) {
        // There might be a split second where the user closes the app, so
        // this.leona.window is null, but there is still a network request done.
        return;
      }
      details.requestHeaders.Origin = `susy://${leonaApp.win.id}.ui.susy`;
      callback({ requestHeaders: details.requestHeaders }); // eslint-disable-line
    }
  );
}

export default setupRequestListeners;
