// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

const withDebug = process.env.DEBUG === 'true';

function setupDebug (leonaApp) {
  const { options, win } = leonaApp;
  // Enable with `DEBUG=true yarn start` and access Developer Tools
  if (withDebug && options.webPreferences.devTools) {
    win.webContents.openDevTools();
  }
}

export default setupDebug;
