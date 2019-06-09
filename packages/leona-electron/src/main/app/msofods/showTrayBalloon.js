// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import path from 'path';

import { staticPath } from '../utils/paths';
import Pino from '../utils/pino';

const iconBalloonPath = path.join(
  staticPath,
  'assets',
  'icons',
  'win',
  'iconBalloon.png'
);

const pino = Pino();

// Supported only on Windows OS
function showTrayBalloon (leonaApp) {
  const { tray } = leonaApp;

  pino.info('Showing Tray Balloon');

  tray.displayBalloon({
    content:
      'Click to toggle Leona window. Right-click Leona window to toggle Leona menu',
    icon: iconBalloonPath,
    title: 'Leona Window & Menu Usage'
  });
}

export default showTrayBalloon;
