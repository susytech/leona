// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import Positioner from 'electron-positioner';

function createPositioner (leonaApp) {
  leonaApp.positioner = new Positioner(leonaApp.win);
}

export default createPositioner;
