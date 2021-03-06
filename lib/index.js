'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _resizer = require('./resizer');

var _resizer2 = _interopRequireDefault(_resizer);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var clamp = function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
};
var snap = function snap(n, size) {
  return Math.round(n / size) * size;
};

var Resizable = function (_Component) {
  _inherits(Resizable, _Component);

  function Resizable(props) {
    _classCallCheck(this, Resizable);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Resizable).call(this, props));

    var width = props.width;
    var height = props.height;

    _this.state = {
      isActive: false,
      width: width,
      height: height
    };

    _this.onTouchMove = _this.onTouchMove.bind(_this);
    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);

    window.addEventListener('mouseup', _this.onMouseUp);
    window.addEventListener('mousemove', _this.onMouseMove);
    window.addEventListener('touchmove', _this.onTouchMove);
    window.addEventListener('touchend', _this.onMouseUp);
    return _this;
  }

  _createClass(Resizable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var size = this.getBoxSize();
      this.setSize(size);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var width = _ref.width;
      var height = _ref.height;

      if (width !== this.props.width) this.setState({ width: width });
      if (height !== this.props.height) this.setState({ height: height });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _lodash2.default)(this.props, nextProps) || !(0, _lodash2.default)(this.state, nextState);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onMouseUp);
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(event) {
      this.onMouseMove(event.touches[0]);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(_ref2) {
      var clientX = _ref2.clientX;
      var clientY = _ref2.clientY;
      var _state = this.state;
      var direction = _state.direction;
      var original = _state.original;
      var isActive = _state.isActive;
      var width = _state.width;
      var height = _state.height;
      var _props = this.props;
      var minWidth = _props.minWidth;
      var maxWidth = _props.maxWidth;
      var minHeight = _props.minHeight;
      var maxHeight = _props.maxHeight;

      if (!isActive) return;
      var newWidth = original.width;
      var newHeight = original.height;
      if (/right/i.test(direction)) {
        newWidth = original.width + clientX - original.x;
        var min = minWidth < 0 || typeof minWidth === 'undefined' ? 0 : minWidth;
        var max = maxWidth < 0 || typeof maxWidth === 'undefined' ? newWidth : maxWidth;
        newWidth = clamp(newWidth, min, max);
        newWidth = snap(newWidth, this.props.grid[0]);
      }
      if (/left/i.test(direction)) {
        newWidth = original.width - clientX + original.x;
        var _min = minWidth < 0 || typeof minWidth === 'undefined' ? 0 : minWidth;
        var _max = maxWidth < 0 || typeof maxWidth === 'undefined' ? newWidth : maxWidth;
        newWidth = clamp(newWidth, _min, _max);
        newWidth = snap(newWidth, this.props.grid[0]);
      }
      if (/bottom/i.test(direction)) {
        newHeight = original.height + clientY - original.y;
        var _min2 = minHeight < 0 || typeof minHeight === 'undefined' ? 0 : minHeight;
        var _max2 = maxHeight < 0 || typeof maxHeight === 'undefined' ? newHeight : maxHeight;
        newHeight = clamp(newHeight, _min2, _max2);
        newHeight = snap(newHeight, this.props.grid[1]);
      }
      if (/top/i.test(direction)) {
        newHeight = original.height - clientY + original.y;
        var _min3 = minHeight < 0 || typeof minHeight === 'undefined' ? 0 : minHeight;
        var _max3 = maxHeight < 0 || typeof maxHeight === 'undefined' ? newHeight : maxHeight;
        newHeight = clamp(newHeight, _min3, _max3);
        newHeight = snap(newHeight, this.props.grid[1]);
      }
      this.setState({
        width: width !== 'auto' ? newWidth : 'auto',
        height: height !== 'auto' ? newHeight : 'auto'
      });
      var resizable = this.refs.resizable;
      var styleSize = {
        width: newWidth || this.state.width,
        height: newHeight || this.state.height
      };
      var clientSize = {
        width: resizable.clientWidth,
        height: resizable.clientHeight
      };
      var delta = {
        width: newWidth - original.width,
        height: newHeight - original.height
      };
      this.props.onResize(direction, styleSize, clientSize, delta);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      var _state2 = this.state;
      var isActive = _state2.isActive;
      var direction = _state2.direction;
      var original = _state2.original;

      if (!isActive) return;
      var resizable = this.refs.resizable;
      var styleSize = this.getBoxSize();
      var clientSize = {
        width: resizable.clientWidth,
        height: resizable.clientHeight
      };
      var delta = {
        width: styleSize.width - original.width,
        height: styleSize.height - original.height
      };
      this.props.onResizeStop(direction, styleSize, clientSize, delta);
      this.setState({ isActive: false });
    }
  }, {
    key: 'onResizeStart',
    value: function onResizeStart(direction, e) {
      var clientSize = {
        width: this.refs.resizable.clientWidth,
        height: this.refs.resizable.clientHeight
      };
      this.props.onResizeStart(direction, this.getBoxSize(), clientSize, e);
      var size = this.getBoxSize();
      this.setState({
        original: {
          x: e.clientX,
          y: e.clientY,
          width: size.width,
          height: size.height
        },
        isActive: true,
        direction: direction
      });
    }
  }, {
    key: 'getBoxSize',
    value: function getBoxSize() {
      var style = window.getComputedStyle(this.refs.resizable, null);
      var width = ~~style.getPropertyValue('width').replace('px', '');
      var height = ~~style.getPropertyValue('height').replace('px', '');
      return { width: width, height: height };
    }
  }, {
    key: 'setSize',
    value: function setSize(size) {
      this.setState({
        width: this.state.width || size.width,
        height: this.state.height || size.height
      });
    }
  }, {
    key: 'getBoxStyle',
    value: function getBoxStyle() {
      var _this2 = this;

      var getSize = function getSize(key) {
        if (typeof _this2.state[key] === 'undefined' || _this2.state[key] === 'auto') return 'auto';else if (/px$/.test(_this2.state[key].toString())) return _this2.state[key];else if (/%$/.test(_this2.state[key].toString())) return _this2.state[key];
        return _this2.state[key] + 'px';
      };
      return {
        width: getSize('width'),
        height: getSize('height')
      };
    }
  }, {
    key: 'renderResizer',
    value: function renderResizer() {
      var _this3 = this;

      var _props2 = this.props;
      var isResizable = _props2.isResizable;
      var handleStyle = _props2.handleStyle;
      var handleClass = _props2.handleClass;

      return Object.keys(isResizable).map(function (dir) {
        var onResizeStart = _this3.onResizeStart.bind(_this3, dir);
        if (isResizable[dir] !== false) {
          return _react2.default.createElement(_resizer2.default, {
            key: dir,
            type: dir,
            onResizeStart: onResizeStart,
            replaceStyles: handleStyle[dir],
            className: handleClass[dir]
          });
        }
        return null;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var userSelect = this.state.isActive ? {
        userSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        MsUserSelect: 'none'
      } : {
        userSelect: 'auto',
        MozUserSelect: 'auto',
        WebkitUserSelect: 'auto',
        MsUserSelect: 'auto'
      };
      var style = this.getBoxStyle();
      var _props3 = this.props;
      var onClick = _props3.onClick;
      var customStyle = _props3.customStyle;
      var customClass = _props3.customClass;
      var onMouseDown = _props3.onMouseDown;
      var onDoubleClick = _props3.onDoubleClick;
      var onTouchStart = _props3.onTouchStart;

      return _react2.default.createElement(
        'div',
        {
          ref: 'resizable',
          style: _extends({
            position: 'relative'
          }, userSelect, customStyle, style),
          className: customClass,
          onClick: onClick,
          onMouseDown: onMouseDown,
          onDoubleClick: onDoubleClick,
          onTouchStart: onTouchStart
        },
        this.props.children,
        this.renderResizer()
      );
    }
  }]);

  return Resizable;
}(_react.Component);

Resizable.propTypes = {
  children: _react.PropTypes.any,
  onClick: _react.PropTypes.func,
  onDoubleClick: _react.PropTypes.func,
  onMouseDown: _react.PropTypes.func,
  onResizeStop: _react.PropTypes.func,
  onResizeStart: _react.PropTypes.func,
  onTouchStart: _react.PropTypes.func,
  onResize: _react.PropTypes.func,
  customStyle: _react.PropTypes.object,
  handleStyle: _react.PropTypes.shape({
    top: _react.PropTypes.object,
    right: _react.PropTypes.object,
    bottom: _react.PropTypes.object,
    left: _react.PropTypes.object,
    topRight: _react.PropTypes.object,
    bottomRight: _react.PropTypes.object,
    bottomLeft: _react.PropTypes.object,
    topLeft: _react.PropTypes.object
  }),
  handleClass: _react.PropTypes.shape({
    top: _react.PropTypes.string,
    right: _react.PropTypes.string,
    bottom: _react.PropTypes.string,
    left: _react.PropTypes.string,
    topRight: _react.PropTypes.string,
    bottomRight: _react.PropTypes.string,
    bottomLeft: _react.PropTypes.string,
    topLeft: _react.PropTypes.string
  }),
  isResizable: _react.PropTypes.shape({
    top: _react.PropTypes.bool,
    right: _react.PropTypes.bool,
    bottom: _react.PropTypes.bool,
    left: _react.PropTypes.bool,
    topRight: _react.PropTypes.bool,
    bottomRight: _react.PropTypes.bool,
    bottomLeft: _react.PropTypes.bool,
    topLeft: _react.PropTypes.bool
  }),
  customClass: _react.PropTypes.string,
  width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  height: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  minWidth: _react.PropTypes.number,
  minHeight: _react.PropTypes.number,
  maxWidth: _react.PropTypes.number,
  maxHeight: _react.PropTypes.number,
  grid: _react.PropTypes.arrayOf(_react.PropTypes.number)
};
Resizable.defaultProps = {
  onResizeStart: function onResizeStart() {
    return null;
  },
  onResize: function onResize() {
    return null;
  },
  onResizeStop: function onResizeStop() {
    return null;
  },
  isResizable: {
    top: true, right: true, bottom: true, left: true,
    topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
  },
  customStyle: {},
  handleStyle: {},
  handleClass: {},
  grid: [1, 1]
};
exports.default = Resizable;
module.exports = exports['default'];