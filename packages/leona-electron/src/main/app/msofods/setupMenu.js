// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import {
  LeonaContextTrayMenu,
  LeonaContextWindowMenu,
  LeonaMenubarMenu
} from '../menu';
import Pino from '../utils/pino';

const pino = Pino();

function setupMenu (leonaApp) {
  leonaApp.menubarMenu = new LeonaMenubarMenu(leonaApp);
  leonaApp.menubarMenu.setMenu();

  if (leonaApp.options.withTaskbar) {
    leonaApp.contextTrayMenu = new LeonaContextTrayMenu(leonaApp);
  }

  leonaApp.contextWindowMenu = new LeonaContextWindowMenu(leonaApp);

  /**
   * Toggle the Leona menubar menu in window frame when options `frame: true`.
   * If not shown by default then when shown it may crop the bottom
   * of the window when menu open/close toggled on Windows.
   */
  leonaApp.win.setAutoHideMenuBar(false); // Pressing ALT shows menu bar
  leonaApp.win.setMenuBarVisibility(true);

  pino.info('Finished configuring Electron menu');
}

export default setupMenu;
