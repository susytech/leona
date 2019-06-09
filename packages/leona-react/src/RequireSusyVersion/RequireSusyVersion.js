// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import light from '@susy-js/light.js-react';
import { Modal } from 'leona-ui';
import { startWith, catchError } from 'rxjs/operators';
import { versionInfo$ } from '@susy-js/light.js';
import { of } from 'rxjs';
import semver from 'semver';

import { susy } from 'leona/package.json';
const requiredVersion = susy.version;

@light({
  versionInfo: props =>
    versionInfo$().pipe(
      startWith(undefined),
      catchError(e => {
        /*
         * susy_versionInfo was implemented on the LC with Susy v2.4.1
         * If the RPC errors out, it means we're using Susy < v2.4.1

         * Checking the version of Susy Sophon in Leona was first released
         * (Leona v0.3) along with a feature (#394) that requires Susy
         * Sophon >= v2.4.0

         * Leona v0.3 should theoretically work with v2.4.0, but since there is
         * no way to check for this exact version, we made Leona v0.3 require
         * >= v2.4.1 (which we can check).
         *
         * If the RPC errors out, we're using Susy < v2.4.1 and Leona v0.3
         * is "officially" not compatible with this version.
         */
        return of({ version: { major: 0, minor: 0, patch: 0 } });
      })
    )
})
class RequireSusyVersion extends Component {
  render () {
    const { versionInfo } = this.props;

    if (versionInfo) {
      const { major, minor, patch } = versionInfo.version;
      if (!semver.satisfies(`${major}.${minor}.${patch}`, requiredVersion)) {
        const friendlyVersion =
          major === 0 && minor === 0 && patch === 0
            ? '<2.4.1'
            : `${major}.${minor}.${patch}`;
        return (
          <Modal
            title='Unsupported version'
            description={`You are running Susy Sophon ${friendlyVersion}, which is unsupported. Please use Susy Sophon ${requiredVersion}`}
            visible
          />
        );
      }
    }

    return this.props.children;
  }
}

export default RequireSusyVersion;
