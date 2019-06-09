// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { getContextWindowMenuTemplate } from '../template';

const { Menu } = electron;

let hasCalledInitMenu = false;

class LeonaContextWindowMenu {
  constructor (leonaApp) {
    if (hasCalledInitMenu) {
      throw new Error(
        'Unable to initialise Leona context window menu more than once'
      );
    }

    this.setMenuTemplate(getContextWindowMenuTemplate(leonaApp));
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

export default LeonaContextWindowMenu;
