// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import EventEmitter from 'events';

import {
  calculateWinPosition,
  createPositioner,
  createTray,
  createWindow,
  fixWinPosition,
  getScreenResolution,
  hideWindow,
  loadTray,
  moveWindowUp,
  onTrayClick,
  onWindowClose,
  processSaveWinPosition,
  setupAppListeners,
  setupDebug,
  setupGlobals,
  setupLogger,
  setupMenu,
  setupSusySophon,
  setupRequestListeners,
  setupSecurity,
  setupWinListeners,
  setupWin32Listeners,
  showTrayBalloon,
  showWindow,
  updateProgress,
  windowClear
} from './methods';

let hasCalledInitLeonaApp = false;

class LeonaApp extends EventEmitter {
  constructor (electronApp, options) {
    super();

    if (hasCalledInitLeonaApp) {
      this.emit(
        'error',
        new Error('Unable to initialise Leona app more than once')
      );
    }

    /**
     * After the Leona instance and leonaApp.win has been created.
     * If the user then chooses from the Leona Menu "Window > Close"
     * it runs windowClear, which deletes leonaApp.win and associated
     * listeners since the 'close' event also occurs when the user exits.
     * If the user then clicks the tray icon to re-open the Leona window,
     * it will run the onTrayClick method, which calls leonaApp.showWindow
     * and if leonaApp.win does not exist, it runs showWindow and createWindow
     * to restore create leonaApp.win again and associated listeners. However we
     * do not need to run all the leonaApp methods again like we did on the
     * when leonaApp.win was first created (i.e. createTray, loadTray,
     * setupDebug, setupSecurity, setupLogger, setupSusySophon, setupGlobals)
     */
    this.app = electronApp;
    this.options = options;

    this.createWindow();
    this.updateProgress(0.4, undefined);

    // These methods are called only once when Leona instance is created
    // (i.e. not called again when the Leona window closed and re-opened)
    this.createTray();
    this.loadTray();
    this.setupDebug();
    this.setupSecurity();
    this.setupLogger();
    this.setupSusySophon();
    this.setupGlobals();

    this.updateProgress(0.8, undefined);
    this.showWindow(undefined);
    this.updateProgress(1.0, undefined);
    this.updateProgress(-1, 'after-create-app');
  }

  calculateWinPosition = () => calculateWinPosition(this);
  createPositioner = () => createPositioner(this);
  createTray = () => createTray(this);
  createWindow = () => createWindow(this);
  fixWinPosition = positionStruct => fixWinPosition(this, positionStruct);
  getScreenResolution = () => getScreenResolution();
  hideWindow = () => hideWindow(this);
  loadTray = () => loadTray(this);
  moveWindowUp = () => moveWindowUp(this);
  onTrayClick = (e, bounds) => onTrayClick(this, e, bounds);
  onWindowClose = () => onWindowClose(this);
  processSaveWinPosition = () => processSaveWinPosition(this);
  setupAppListeners = () => setupAppListeners(this);
  setupDebug = () => setupDebug(this);
  setupGlobals = () => setupGlobals();
  setupLogger = () => setupLogger();
  setupMenu = () => setupMenu(this);
  setupSusySophon = () => setupSusySophon(this);
  setupRequestListeners = () => setupRequestListeners(this);
  setupSecurity = () => setupSecurity(this);
  setupWinListeners = () => setupWinListeners(this);
  setupWin32Listeners = () => setupWin32Listeners(this);
  showTrayBalloon = () => showTrayBalloon(this);
  showWindow = trayPos => showWindow(this, trayPos);
  updateProgress = (percentage, eventListenerName) =>
    updateProgress(this, percentage, eventListenerName);
  windowClear = () => windowClear(this);
}

export default LeonaApp;
