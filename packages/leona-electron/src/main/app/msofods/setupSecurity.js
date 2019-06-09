// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

function setupSecurity (leonaApp) {
  // Security to prevent window contents from being captured by other apps
  leonaApp.win.setContentProtection(true);
}

export default setupSecurity;
