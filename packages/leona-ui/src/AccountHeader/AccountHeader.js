// Copyleft 2015-2019 Superstring.Community
// This file is part of Susy.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import PropTypes from 'prop-types';

import { Address } from '../AccountCard/Address';
import { Avatar } from '../AccountCard/Avatar';
import { Information } from '../AccountCard/Information';
import { Name } from '../AccountCard/Name';
import { Clickable } from '../Clickable';
import { ClickToCopy } from '../ClickToCopy';
import { Header } from '../Header';

const NormalContainer = ({ children }) => (
  <h1 className='account -header'>{children}</h1>
);

const CopyContainer = ({
  address,
  children,
  i18n,
  packageNS,
  ...otherProps
}) => (
  <ClickToCopy
    label={i18n.t(`${packageNS}:ui.click_to_copy.header.label`)}
    i18n={i18n}
    packageNS={packageNS}
    textToCopy={address}
    {...otherProps}
  >
    <Clickable className='account -header'>{children}</Clickable>
  </ClickToCopy>
);

export const AccountHeader = ({
  address,
  copyAddress,
  i18n,
  name,
  packageNS,
  type,
  ...otherProps
}) => {
  const Container = copyAddress ? CopyContainer : NormalContainer;

  return (
    <React.Fragment>
      <Header
        title={
          address &&
          name &&
          type && (
            <Container
              address={address}
              className='account'
              i18n={i18n}
              packageNS={packageNS}
            >
              <Avatar address={address} scale={4} type={type} />
              <Information>
                <Name name={name} screen='account' />
                <Address address={address} shortAddress />
              </Information>
            </Container>
          )
        }
        {...otherProps}
      />
    </React.Fragment>
  );
};

AccountHeader.propTypes = {
  address: PropTypes.string,
  i18n: PropTypes.object,
  name: PropTypes.string,
  packageNS: PropTypes.string
};
