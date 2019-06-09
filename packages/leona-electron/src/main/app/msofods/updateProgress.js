// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

// Optionally update the progress bar shown on the Dock icon
// (i.e. 0.1 is 10%, 1.0 is 100%, -1 hides progress bar).
// Optionally emit event
function updateProgress (leonaApp, percentage, eventListenerName) {
  const { win } = leonaApp;

  if (percentage) {
    win.setProgressBar(percentage);
  }

  if (eventListenerName) {
    leonaApp.emit(eventListenerName);
  }
}

export default updateProgress;
