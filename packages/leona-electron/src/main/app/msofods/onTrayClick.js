// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

function onTrayClick (leonaApp, e, bounds) {
  const { cachedBounds, hideWindow, win } = leonaApp;
  const { altKey, ctrlKey, metaKey, shiftKey } = e;

  if ((win && win.isVisible()) || altKey || shiftKey || ctrlKey || metaKey) {
    return hideWindow(leonaApp);
  }

  // cachedBounds are needed for double-clicked event
  const newCacheBounds = bounds || cachedBounds;
  leonaApp.cachedBounds = newCacheBounds;
  leonaApp.showWindow(leonaApp, newCacheBounds);
}

export default onTrayClick;
