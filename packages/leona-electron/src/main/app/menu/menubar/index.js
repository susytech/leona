// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';

import { getMenubarMenuTemplate } from '../template';

const { Menu } = electron;

let hasCalledInitMenu = false;

class LeonaMenubarMenu {
  constructor (leonaApp) {
    if (hasCalledInitMenu) {
      throw new Error(
        'Unable to initialise Leona menubar menu more than once'
      );
    }

    this.setMenuTemplate(getMenubarMenuTemplate(leonaApp));
    this.buildMenuTemplate(this.menuTemplate);
  }

  setMenuTemplate = menuTemplate => {
    this.menuTemplate = menuTemplate;
  };

  buildMenuTemplate = menuTemplate => {
    this.builtMenu = Menu.buildFromTemplate(menuTemplate);
  };

  setMenu = customBuiltMenuTemplate => {
    Menu.setApplicationMenu(customBuiltMenuTemplate || this.builtMenu);
  };

  getMenu = () => {
    // return Menu.getApplicationMenu();
    return this.builtMenu;
  };
}

export default LeonaMenubarMenu;
