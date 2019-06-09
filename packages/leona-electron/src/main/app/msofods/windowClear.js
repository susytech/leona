// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

function windowClear (leonaApp) {
  const { win } = leonaApp;

  if (win) {
    // Remove relevant events when window object deleted
    const events = [
      'blur',
      'close',
      'closed',
      'minimize',
      'move',
      'moved',
      'resize'
    ];
    for (let event in events) {
      win.removeAllListeners(event);
    }
    delete leonaApp.win;
  }

  leonaApp.emit('after-close-window');
}

export default windowClear;
