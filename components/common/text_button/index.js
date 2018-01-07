//  <CommonTextButton>
//  ==================

//  This is a simple button for text, optionally preceded by an icon.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Component imports.
import {
  CommonButton,
  CommonIcon,
} from 'flavours/go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CommonTextButton ({
  active,
  children,
  className,
  data,
  disabled,
  href,
  icon,
  onClick,
  passive,
  proportional,
  role,
  title,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--TEXT_BUTTON', className);

  //  The result.
  return (
    <CommonButton
      active={active}
      className={computedClass}
      disabled={disabled}
      href={href}
      onClick={onClick}
      passive={passive}
      role={role}
      title={title}
      {...rest}
    >
      <CommonIcon
        icon={icon}
        proportional={proportional}
      />
      {children}
    </CommonButton>
  );
}

//  Props.
CommonTextButton.propTypes = {
  active: PropTypes.bool,  //  `true` if the button is active
  children: PropTypes.node,
  className: PropTypes.string,
  data: PropTypes.any,  //  For non-link buttons, this will be passed to `onClick`
  disabled: PropTypes.bool,  //  Whether the button is disabled
  href: PropTypes.string,  //  Creates a button which is also a link
  icon: PropTypes.node,  //  The button icon; will be passed to `<CommonIcon>`
  onClick: PropTypes.func,  //  The function to call when clicking the button
  passive: PropTypes.bool,  //  `true` if clicking the button shouldn't affect focus
  proportional: PropTypes.bool,  //  `true` if the icon should not be fullwidth
  role: PropTypes.string,  //  The ARIA role of the button, if not `'button'`
  title: PropTypes.string,  //  The button's label
};
