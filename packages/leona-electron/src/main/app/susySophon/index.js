// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import { isSusyRunning, runSusy } from '@susy-js/electron';
import getRemainingArgs from 'commander-remaining-args';

import { bundledSusyPath } from '../utils/paths';
import handleError from '../utils/handleError';
import cli from '../cli';
import Pino from '../utils/pino';

const pino = Pino();

let hasCalledInitSusySophon = false;

class SusySophon {
  constructor () {
    if (hasCalledInitSusySophon) {
      throw new Error('Unable to initialise Susy Sophon more than once');
    }

    /*
     * - If an instance of Susy Sophon is already running, we connect to it
     *   and then check in leona-react if the susy_versionInfo RPC returns
     *   a compatible version; otherwise, we error out.
     * - If no instance of Susy Sophon is running, we run the bundled Susy
     *   Sophon binary.
     *
     * `susy signer new-token` is run on the bundled binary in any case. We
     * don't use the $PATH anymore.
     */

    // Run the bundled Susy Sophon if needed and wanted
    return new Promise(async (resolve, reject) => {
      // Susy Sophon is already running: don't run the bundled binary
      if (await this.isRunning()) {
        resolve(true);
        return;
      }

      // User ran Leona with --no-run-susy: don't run the bundled binary
      if (!cli.runSusy) {
        resolve(false);
        return;
      }

      // Susy Sophon isn't running: run the bundled binary
      await this.run();
      pino.info('Running Susy Sophon');
      resolve(true);
    }).catch(handleError);
  }

  isRunning = async () => {
    return isSusyRunning({
      wsPort: cli.wsPort
    });
  };

  // Run the bundled Susy Sophon binary
  run = async () => {
    return runSusy({
      susyPath: bundledSusyPath,
      flags: [
        ...getRemainingArgs(cli),
        '--light',
        '--chain',
        cli.chain,
        '--ws-port',
        cli.wsPort
      ],
      onSusyError: err =>
        handleError(err, 'An error occured with Susy Sophon.')
    });
  };
}

export default SusySophon;
