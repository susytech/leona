// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { getContextTrayMenuTemplate } from '../template';

const { Menu } = electron;

let hasCalledInitMenu = false;

class LeonaContextTrayMenu {
  constructor (leonaApp) {
    if (hasCalledInitMenu) {
      throw new Error(
        'Unable to initialise Leona context tray menu more than once'
      );
    }

    this.setMenuTemplate(getContextTrayMenuTemplate(leonaApp));
    this.buildMenuTemplate(this.menuTemplate);
  }

  setMenuTemplate = menuTemplate => {
    this.menuTemplate = menuTemplate;
  };

  buildMenuTemplate = menuTemplate => {
    this.builtMenu = Menu.buildFromTemplate(menuTemplate);
  };

  getMenu = () => {
    return this.builtMenu;
  };
}

export default LeonaContextTrayMenu;
