// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from '../utils/pino';

const pino = Pino();

function setupWin32Listeners (leonaApp) {
  const { onWindowClose, processSaveWinPosition, win } = leonaApp;

  if (process.platform === 'win32') {
    /**
     * Hook WM_SYSKEYUP
     *
     * Open the Leona Electron menu when the Leona window is active
     * and the user enters a keyboard ALT key or both ALT and another key togsophy.
     * Reference: https://docs.microsoft.com/en-gb/windows/desktop/inputdev/wm-syskeyup
     */
    win.hookWindowMessage(Number.parseInt('0x0105'), (wParam, lParam) => {
      /**
       * Detect when user presses ALT+keyCode.
       * i.e. Use `wParam && wParam.readUInt32LE(0) === 77` to detect ALT+m.
       * Reference: https://nodejs.org/api/buffer.html
       */
      if (wParam) {
        pino.info('Detected ALT key pressed');
        // showTrayBalloon(leonaApp);
      }
    });

    /**
     * Hook WM_SYSCOMMAND
     *
     * Detect events on Windows
     * Credit: http://robmayhew.com/listening-for-events-from-windows-in-electron-tutorial/
     */
    win.hookWindowMessage(Number.parseInt('0x0112'), (wParam, lParam) => {
      let eventName = null;

      if (wParam.readUInt32LE(0) === 0xf060) {
        // SC_CLOSE
        eventName = 'close';
        onWindowClose(leonaApp);
      } else if (wParam.readUInt32LE(0) === 0xf030) {
        // SC_MAXIMIZE
        eventName = 'maximize';
      } else if (wParam.readUInt32LE(0) === 0xf020) {
        // SC_MINIMIZE
        eventName = 'minimize';
        processSaveWinPosition(leonaApp);
      } else if (wParam.readUInt32LE(0) === 0xf120) {
        // SC_RESTORE
        eventName = 'restored';
      }

      if (eventName !== null) {
        pino.info('Detected event:', eventName);
      }
    });

    /**
     * Hook WM_EXITSIZEMOVE
     *
     * Detect event on Windows when Leona window was moved or resized
     */
    win.hookWindowMessage(Number.parseInt('0x0232'), (wParam, lParam) => {
      pino.info('Detected completion of moved or resize event');

      // Save Leona window position to Electron settings
      processSaveWinPosition(leonaApp);
    });
  }
}

export default setupWin32Listeners;
