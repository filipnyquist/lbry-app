import React from "react";
import { formatCredits } from "utils";
import lbry from "../lbry.js";

//component/icon.js
export class Icon extends React.PureComponent {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    fixed: React.PropTypes.bool,
  };

  render() {
    const { fixed, className } = this.props;
    const spanClassName =
      "icon " +
      ("fixed" in this.props ? "icon-fixed-width " : "") +
      this.props.icon +
      " " +
      (this.props.className || "");
    return <span className={spanClassName} />;
  }
}

export class TruncatedText extends React.PureComponent {
  static propTypes = {
    lines: React.PropTypes.number,
  };

  static defaultProps = {
    lines: null,
  };

  render() {
    return (
      <span
        className="truncated-text"
        style={{ WebkitLineClamp: this.props.lines }}
      >
        {this.props.children}
      </span>
    );
  }
}

export class BusyMessage extends React.PureComponent {
  static propTypes = {
    message: React.PropTypes.string,
  };

  render() {
    return (
      <span>{this.props.message} <span className="busy-indicator" /></span>
    );
  }
}

export class CurrencySymbol extends React.PureComponent {
  render() {
    return <span>LBC</span>;
  }
}

export class CreditAmount extends React.PureComponent {
  static propTypes = {
    amount: React.PropTypes.number.isRequired,
    precision: React.PropTypes.number,
    isEstimate: React.PropTypes.bool,
    label: React.PropTypes.bool,
    showFree: React.PropTypes.bool,
    look: React.PropTypes.oneOf(["indicator", "plain"]),
  };

  static defaultProps = {
    precision: 1,
    label: true,
    showFree: false,
    look: "indicator",
  };

  render() {
    const formattedAmount = formatCredits(
      this.props.amount,
      this.props.precision
    );
    let amountText;
    if (this.props.showFree && parseFloat(formattedAmount) == 0) {
      amountText = __("free");
    } else if (this.props.label) {
      amountText =
        formattedAmount +
        " " +
        (parseFloat(formattedAmount) == 1 ? __("credit") : __("credits"));
    } else {
      amountText = formattedAmount;
    }

    return (
      <span className={`credit-amount credit-amount--${this.props.look}`}>
        <span>
          {amountText}
        </span>
        {this.props.isEstimate
          ? <span
              className="credit-amount__estimate"
              title={__("This is an estimate and does not include data fees")}
            >
              *
            </span>
          : null}
      </span>
    );
  }
}

let addressStyle = {
  fontFamily:
    '"Consolas", "Lucida Console", "Adobe Source Code Pro", monospace',
};
export class Address extends React.PureComponent {
  static propTypes = {
    address: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._inputElem = null;
  }

  render() {
    return (
      <input
        className="input-copyable"
        type="text"
        ref={input => {
          this._inputElem = input;
        }}
        onFocus={() => {
          this._inputElem.select();
        }}
        style={addressStyle}
        readOnly="readonly"
        value={this.props.address || ""}
      />
    );
  }
}

export class Thumbnail extends React.PureComponent {
  static propTypes = {
    src: React.PropTypes.string,
  };

  handleError() {
    if (this.state.imageUrl != this._defaultImageUri) {
      this.setState({
        imageUri: this._defaultImageUri,
      });
    }
  }

  constructor(props) {
    super(props);

    this._defaultImageUri = lbry.imagePath("default-thumb.svg");
    this._maxLoadTime = 10000;
    this._isMounted = false;

    this.state = {
      imageUri: this.props.src || this._defaultImageUri,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (this._isMounted && !this.refs.img.complete) {
        this.setState({
          imageUri: this._defaultImageUri,
        });
      }
    }, this._maxLoadTime);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const className = this.props.className ? this.props.className : "",
      otherProps = Object.assign({}, this.props);
    delete otherProps.className;
    return (
      <img
        ref="img"
        onError={() => {
          this.handleError();
        }}
        {...otherProps}
        className={className}
        src={this.state.imageUri}
      />
    );
  }
}
