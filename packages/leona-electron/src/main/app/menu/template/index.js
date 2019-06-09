// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import electron from 'electron';
import settings from 'electron-settings';

import { IS_PROD } from '../../constants';
import i18n from '../i18n';

const { shell } = electron;

// Preferences menu
const getPreferences = leonaApp => {
  return {
    label: i18n.t('menu.file.preferences.languages.submenu_name'),
    submenu: [
      {
        label: i18n.t('menu.file.preferences.languages.english'),
        type: 'radio',
        checked: settings.get('leona-language') === 'en',
        click () {
          // Backend menu change language
          i18n.changeLanguage('en');
          settings.set('leona-language', 'en');
          leonaApp.setupMenu(leonaApp);
          // Frontend change language
          leonaApp.win.webContents.send('send-to-renderer', {
            action: 'SET_LANGUAGE_RESPONSE',
            from: 'leona:electron',
            payload: 'en'
          });
        }
      },
      {
        label: i18n.t('menu.file.preferences.languages.german'),
        type: 'radio',
        checked: settings.get('leona-language') === 'de',
        click () {
          // Backend menu change language
          i18n.changeLanguage('de');
          settings.set('leona-language', 'de');
          leonaApp.setupMenu(leonaApp);
          // Frontend change language
          leonaApp.win.webContents.send('send-to-renderer', {
            action: 'SET_LANGUAGE_RESPONSE',
            from: 'leona:electron',
            payload: 'de'
          });
        }
      }
    ]
  };
};

// Create the Application's main menu
// https://github.com/electron/electron/blob/master/docs/api/menu.md#examples
const getMenubarMenuTemplate = leonaApp => {
  // File menu
  const fileTab =
    process.platform === 'darwin'
      ? {
        label: i18n.t('menu.file.submenu_name'),
        submenu: [
          { role: 'about', label: i18n.t('menu.file.about') },
          { type: 'separator' },
          {
            label: i18n.t('menu.file.preferences.submenu_name'),
            submenu: [getPreferences(leonaApp)]
          },
          { type: 'separator' },
          {
            role: 'services',
            label: i18n.t('menu.file.services'),
            submenu: []
          },
          { type: 'separator' },
          { role: 'hide', label: i18n.t('menu.file.hide') },
          { role: 'hideothers', label: i18n.t('menu.file.hide_others') },
          { role: 'unhide', label: i18n.t('menu.file.unhide') },
          { type: 'separator' },
          { role: 'quit', label: i18n.t('menu.file.quit') }
        ]
      }
      : {
        label: i18n.t('menu.file.submenu_name'),
        submenu: [{ role: 'quit', label: i18n.t('menu.file.quit') }]
      };

  /* eslint-disable no-sparse-arrays */
  const editTabMacOS = {
    label: i18n.t('menu.edit.submenu_name'),
    submenu: [
      { role: 'undo', label: i18n.t('menu.edit.undo') },
      { role: 'redo', label: i18n.t('menu.edit.redo') },
      { type: 'separator' },
      { role: 'cut', label: i18n.t('menu.edit.cut') },
      { role: 'copy', label: i18n.t('menu.edit.copy') },
      { role: 'paste', label: i18n.t('menu.edit.paste') },
      { type: 'separator' },
      { role: 'delete', label: i18n.t('menu.edit.delete') },
      { role: 'selectall', label: i18n.t('menu.edit.select_all') }
    ]
  };
  /* eslint-enable no-sparse-arrays */

  /**
   * On win32 we need to use `webContents` to make some of the menu items
   * functional (whereas it is not required on Linux and macOS).
   * i.e on macOS/Linux `{ role: 'undo' }` suffices to add the Undo menu item,
   * whereas on win32 we must use `webContents` as follows:
   * `{ label: 'Undo', click: () => leonaApp.win.webContents.undo() }`.
   * Since all items in the 'Edit' menu work with `webContents` we will use
   * it to prevent code duplication
   */
  const editTab = {
    label: i18n.t('menu.edit.submenu_name'),
    submenu: [
      {
        label: i18n.t('menu.edit.undo'),
        click: () => leonaApp.win.webContents.undo()
      },
      {
        label: i18n.t('menu.edit.redo'),
        click: () => leonaApp.win.webContents.redo()
      },
      { type: 'separator' },
      {
        label: i18n.t('menu.edit.cut'),
        click: () => leonaApp.win.webContents.cut()
      },
      {
        label: i18n.t('menu.edit.copy'),
        click: () => leonaApp.win.webContents.copy()
      },
      {
        label: i18n.t('menu.edit.paste'),
        click: () => leonaApp.win.webContents.paste()
      },
      { type: 'separator' },
      {
        label: i18n.t('menu.edit.delete'),
        click: () => leonaApp.win.webContents.delete()
      },
      {
        label: i18n.t('menu.edit.select_all'),
        click: () => leonaApp.win.webContents.selectAll()
      }
    ]
  };

  const viewTab = {
    label: i18n.t('menu.view.submenu_name'),
    submenu: [
      { role: 'reload', label: i18n.t('menu.view.reload') },
      {
        role: 'toggledevtools',
        label: i18n.t('menu.view.toggle_developer_tools')
      }
    ]
  };

  /**
   * On win32 we need to use `webContents` to make some of the menu items
   * functional (whereas it is not required on Linux and macOS).
   * Note that some menu items are not available in `webContents`
   * (i.e. resetzoom, zoomin, zoomout, togglefullscreen), however they
   * add no benefit to users anyway
   */
  const viewTabWindowsOS = {
    label: i18n.t('menu.view.submenu_name'),
    submenu: [
      {
        label: i18n.t('menu.view.reload'),
        click: () => leonaApp.win.webContents.reload()
      },
      {
        label: i18n.t('menu.view.toggle_developer_tools'),
        click: () => leonaApp.win.webContents.toggleDevTools()
      }
    ]
  };

  const windowTab = {
    role: 'window',
    label: i18n.t('menu.window.submenu_name'),
    submenu: [
      { role: 'minimize', label: i18n.t('menu.window.minimize') },
      { role: 'close', label: i18n.t('menu.window.close') }
    ]
  };

  const helpTab = {
    role: 'help',
    label: i18n.t('menu.help.submenu_name'),
    submenu: [
      {
        label: i18n.t('menu.help.learn_more'),
        click () {
          shell.openExternal('http://superstring.ch');
        }
      }
    ]
  };

  const template = [
    fileTab,
    process.platform === 'darwin' ? editTabMacOS : editTab,
    process.platform === 'win32' ? viewTabWindowsOS : viewTab,
    windowTab,
    helpTab
  ];

  if (process.platform === 'darwin') {
    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: i18n.t('menu.edit.speech.submenu_name'),
        submenu: [
          {
            role: 'startspeaking',
            label: i18n.t('menu.edit.speech.start_speaking')
          },
          {
            role: 'stopspeaking',
            label: i18n.t('menu.edit.speech.stop_speaking')
          }
        ]
      }
    );
  }

  if (process.platform === 'darwin') {
    // Window menu
    template[3].submenu = [
      { role: 'close', label: i18n.t('menu.window.close') },
      { role: 'minimize', label: i18n.t('menu.window.minimize') },
      { role: 'zoom', label: i18n.t('menu.window.zoom') },
      { type: 'separator' },
      { role: 'front', label: i18n.t('menu.window.bring_all_to_front') }
    ];
  }

  if (leonaApp.options.withTaskbar) {
    // Remove Window menu tab when running as taskbar app
    template.splice(3, 1);
  }

  return template;
};

const getContextTrayMenuTemplate = leonaApp => {
  if (leonaApp.options.withTaskbar) {
    const template = [
      {
        label: i18n.t('menu.show_hide_leona'),
        click () {
          if (leonaApp.win.isVisible() && leonaApp.win.isFocused()) {
            leonaApp.win.hide();
          } else {
            leonaApp.win.show();
            leonaApp.win.focus();
          }
        }
      }
    ];

    if (!IS_PROD) {
      template.push({
        label: i18n.t('menu.view.reload'),
        click: () => leonaApp.win.webContents.reload()
      });
    }

    template.push({ role: 'quit', label: i18n.t('menu.file.quit') });

    return template;
  }
};

const getContextWindowMenuTemplate = leonaApp => {
  const template = getMenubarMenuTemplate(leonaApp);

  if (leonaApp.options.withTaskbar) {
    // Remove File and Help menus in taskbar mode for window context menu
    template.shift();
    template.pop();
    template.push({
      label: i18n.t('menu.file.preferences.submenu_name'),
      submenu: [getPreferences(leonaApp)]
    });
    template.push({
      role: 'help',
      label: i18n.t('menu.help.submenu_name'),
      submenu: [
        {
          label: i18n.t('menu.help.learn_more'),
          click () {
            shell.openExternal('http://superstring.ch');
          }
        }
      ]
    });

    if (process.platform === 'darwin') {
      template[3].submenu.push({
        role: 'about',
        label: i18n.t('menu.file.about')
      });
    }

    template.push({ role: 'quit', label: i18n.t('menu.file.quit') });
  }

  return template;
};

export {
  getContextTrayMenuTemplate,
  getContextWindowMenuTemplate,
  getMenubarMenuTemplate
};
