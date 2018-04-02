'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint no-debugger: "warn" */


/**
 * Predefined constants
 * @type {Object}
 */
var constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      reverseDirection: 'right',
      coordinate: 'x'
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      reverseDirection: 'bottom',
      coordinate: 'y'
    }
  }
};

var Slider = function (_Component) {
  _inherits(Slider, _Component);

  function Slider(props, context) {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props, context));

    _this.handleFormat = function (value) {
      var format = _this.props.format;

      return format ? format(value) : value;
    };

    _this.handleUpdate = function () {
      if (!_this.slider) {
        // for shallow rendering
        return;
      }
      var orientation = _this.props.orientation;

      var dimension = (0, _utils.capitalize)(constants.orientation[orientation].dimension);
      var sliderPos = _this.slider['offset' + dimension];
      var handlePos = _this.end['offset' + dimension];
      _this.setState({
        limit: sliderPos - handlePos,
        grab: handlePos / 2
      });
    };

    _this.handleStart = function (e) {
      e.stopPropagation();
      var onChangeStart = _this.props.onChangeStart;

      document.addEventListener('mousemove', _this.handleDrag);
      document.addEventListener('mouseup', _this.handleEnd);
      _this.setState({
        active: true,
        activeEl: document.activeElement === _this.start ? 'start' : 'end'
      }, function () {
        onChangeStart && onChangeStart(e);
      });
    };

    _this.handleDrag = function (e) {
      e.stopPropagation();
      var onChange = _this.props.onChange;
      var _e$target = e.target,
          className = _e$target.className,
          classList = _e$target.classList,
          dataset = _e$target.dataset;

      if (!onChange || className === 'rangeslider__labels') return;

      var sliderValue = _this.position(e);

      if (classList && classList.contains('rangeslider__label-item') && dataset.value) {
        sliderValue = parseFloat(dataset.value);
      }

      _this.updateValue(sliderValue, e);
    };

    _this.handleEnd = function (e) {
      e.stopPropagation();
      var onChangeComplete = _this.props.onChangeComplete;

      _this.setState({
        active: false
      }, function () {
        onChangeComplete && onChangeComplete(e);
      });
      document.removeEventListener('mousemove', _this.handleDrag);
      document.removeEventListener('mouseup', _this.handleEnd);
    };

    _this.handleKeyDown = function (e) {
      e.preventDefault();
      var keyCode = e.keyCode;
      var _this$props = _this.props,
          value = _this$props.value,
          min = _this$props.min,
          max = _this$props.max,
          step = _this$props.step;

      var changedValue = value.start || value.end ? value[_this.state.activeEl] : value;
      var sliderValue = void 0;

      switch (keyCode) {
        case 38:
        case 39:
          sliderValue = changedValue + step > max ? max : changedValue + step;
          _this.updateValue(sliderValue, e);
          break;
        case 37:
        case 40:
          sliderValue = changedValue - step < min ? min : changedValue - step;
          _this.updateValue(sliderValue, e);
          break;
      }
    };

    _this.updateValue = function (sliderValue, e) {
      var _this$props2 = _this.props,
          onChange = _this$props2.onChange,
          mode = _this$props2.mode,
          min = _this$props2.min,
          max = _this$props2.max,
          value = _this$props2.value;

      if (mode === 'single') {
        onChange && onChange(sliderValue, e);
      } else {
        (function () {
          var isHandlerClicked = document.activeElement === _this.start || document.activeElement === _this.end;
          var values = function values(activeEl) {
            return {
              start: activeEl === 'start' ? (0, _utils.clamp)(sliderValue, min, value.end) : value.start,
              end: activeEl === 'end' ? (0, _utils.clamp)(sliderValue, value.start, max) : value.end
            };
          };
          _this.setState({
            activeEl: isHandlerClicked ? document.activeElement === _this.start ? 'start' : 'end' : _this.state.activeEl
          }, function () {
            onChange && onChange(values(_this.state.activeEl), e);
          });
        })();
      }
    };

    _this.getPositionFromValue = function (value) {
      var limit = _this.state.limit;
      var _this$props3 = _this.props,
          min = _this$props3.min,
          max = _this$props3.max;

      var diffMaxMin = max - min;
      var calcPos = function calcPos(val) {
        return Math.round((val - min) / diffMaxMin * limit);
      };
      return (0, _utils.isObject)(value) ? {
        start: (0, _utils.clamp)(calcPos(value.start), min, calcPos(value.end)),
        end: (0, _utils.clamp)(calcPos(value.end), calcPos(value.start), limit)
      } : calcPos(value);
    };

    _this.getValueFromPosition = function (pos) {
      var limit = _this.state.limit;
      var _this$props4 = _this.props,
          orientation = _this$props4.orientation,
          min = _this$props4.min,
          max = _this$props4.max,
          step = _this$props4.step;

      var calcBaseVal = function calcBaseVal(position) {
        return step * Math.round((0, _utils.clamp)(position, 0, limit) / (limit || 1) * (max - min) / step);
      };
      var calcValue = function calcValue(base) {
        return (0, _utils.clamp)(orientation === 'horizontal' ? base + min : max - base, min, max);
      };
      return (0, _utils.isObject)(pos) ? {
        start: (0, _utils.clamp)(calcValue(calcBaseVal(pos.start)), min, calcValue(calcBaseVal(pos.end))),
        end: (0, _utils.clamp)(calcValue(calcBaseVal(pos.end)), calcValue(calcBaseVal(pos.start)), max)
      } : calcValue(calcBaseVal(pos));
    };

    _this.position = function (e) {
      var grab = _this.state.grab;
      var _this$props5 = _this.props,
          orientation = _this$props5.orientation,
          reverse = _this$props5.reverse;


      var node = _this.slider;
      var coordinateStyle = constants.orientation[orientation].coordinate;
      var directionStyle = reverse ? constants.orientation[orientation].reverseDirection : constants.orientation[orientation].direction;
      var clientCoordinateStyle = 'client' + (0, _utils.capitalize)(coordinateStyle);
      var coordinate = !e.touches ? e[clientCoordinateStyle] : e.touches[0][clientCoordinateStyle];
      var direction = node.getBoundingClientRect()[directionStyle];
      var pos = reverse ? direction - coordinate - grab : coordinate - direction - grab;
      var value = _this.getValueFromPosition(pos);

      return value;
    };

    _this.coordinates = function (pos) {
      var _this$state = _this.state,
          limit = _this$state.limit,
          grab = _this$state.grab;
      var _this$props6 = _this.props,
          orientation = _this$props6.orientation,
          min = _this$props6.min;

      var value = _this.getValueFromPosition(pos);
      var position = _this.getPositionFromValue(value);
      var calcHandlePos = function calcHandlePos(val) {
        return orientation === 'horizontal' ? val + grab : val;
      };
      var calcFillPos = function calcFillPos(val) {
        return orientation === 'horizontal' ? val : limit - val;
      };
      // N.B. the lable value is only calculated when the param is number, as it takes array key
      if ((0, _utils.isObject)(pos)) {
        var startHandlePos = calcHandlePos(position.start);
        var endHandlePos = calcHandlePos(position.end);
        return {
          fill: [Math.abs(endHandlePos - startHandlePos), (0, _utils.clamp)(startHandlePos, min, endHandlePos)],
          handle: {
            start: (0, _utils.clamp)(startHandlePos, min, endHandlePos),
            end: (0, _utils.clamp)(endHandlePos, startHandlePos, limit + 2 * grab)
          }
        };
      }
      return {
        fill: [calcFillPos(calcHandlePos(position))],
        handle: calcHandlePos(position),
        label: calcHandlePos(position)
      };
    };

    _this.renderLabels = function (labels) {
      return _react2.default.createElement(
        'ul',
        {
          ref: function ref(sl) {
            _this.labels = sl;
          },
          className: (0, _classnames2.default)('rangeslider__labels')
        },
        labels
      );
    };

    _this.renderHandler = function (value, refString, handleStyle, showTooltip, handleLabel) {
      return _react2.default.createElement(
        'div',
        {
          ref: function ref(sh) {
            _this[refString] = sh;
          },
          key: refString,
          tabIndex: 0,
          role: 'button',
          className: 'rangeslider__handle',
          onMouseDown: _this.handleStart,
          onMouseUp: _this.handleEnd,
          onTouchMove: _this.handleDrag,
          onTouchEnd: _this.handleEnd,
          onKeyDown: _this.handleKeyDown,
          onKeyUp: _this.handleEnd,
          style: _extends({}, handleStyle, { zIndex: '' + (_this.state.activeEl === refString ? 1 : 0) })
        },
        showTooltip[refString] ? _react2.default.createElement(
          'div',
          {
            ref: function ref(st) {
              _this.tooltip = st;
            },
            className: 'rangeslider__handle-tooltip'
          },
          _react2.default.createElement(
            'span',
            null,
            _this.handleFormat(value)
          )
        ) : null,
        _react2.default.createElement(
          'div',
          { className: 'rangeslider__handle-label' },
          handleLabel[refString]
        )
      );
    };

    _this.renderDoubleHandler = function (value, handleStyle, showTooltip, handleLabel) {
      return [_this.renderHandler(value.start, 'start', handleStyle.start, showTooltip, handleLabel), _this.renderHandler(value.end, 'end', handleStyle.end, showTooltip, handleLabel)];
    };

    _this.state = {
      active: false,
      limit: 0,
      grab: 0,
      activeEl: 'end'
    };
    return _this;
  }

  _createClass(Slider, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleUpdate();
      var resizeObserver = new _resizeObserverPolyfill2.default(this.handleUpdate);
      resizeObserver.observe(this.slider);
    }

    /**
     * Format label/tooltip value
     * @param  {Number} - value
     * @return {Formatted Number}
     */


    /**
     * Update slider state on change
     * @return {void}
     */


    /**
     * Attach event listeners to mousemove/mouseup events
     * @return {void}
     */


    /**
     * Handle drag/mousemove event
     * @param  {Object} e - Event object
     * @return {void}
     */


    /**
     * Detach event listeners to mousemove/mouseup events
     * @return {void}
     */


    /**
     * Support for key events on the slider handle
     * @param  {Object} e - Event object
     * @return {void}
     */


    /**
     * Calculate position of slider based on its value
     * @param  {number} value - Current value of slider, might be a single number or object
     * @return {position} pos - Calculated position of slider based on value
     */


    /**
     * Translate position of slider to slider value
     * @param  {number} or {object} pos - Current position/coordinates of slider
     * @return {number} or {object} value - Slider value
     */


    /**
     * Calculate position of slider based on value
     * @param  {Object} e - Event object
     * @return {number} value - Slider value
     */


    /**
     * Grab coordinates of slider
     * @param  pos - Position object or a single number
     * @return {Object} - Slider fill/handle coordinates
     */

  }, {
    key: 'render',
    value: function render() {
      var _fillStyle,
          _this2 = this;

      var _props = this.props,
          value = _props.value,
          orientation = _props.orientation,
          className = _props.className,
          tooltip = _props.tooltip,
          reverse = _props.reverse,
          labels = _props.labels,
          min = _props.min,
          max = _props.max,
          handleLabel = _props.handleLabel,
          mode = _props.mode;
      var _state = this.state,
          active = _state.active,
          activeEl = _state.activeEl;

      var dimension = constants.orientation[orientation].dimension;
      var direction = reverse ? constants.orientation[orientation].reverseDirection : constants.orientation[orientation].direction;
      var position = this.getPositionFromValue(value);
      var coords = this.coordinates(position);
      var fillStyle = (_fillStyle = {}, _defineProperty(_fillStyle, dimension, coords.fill[0] + 'px'), _defineProperty(_fillStyle, direction, (coords.fill[1] || 0) + 'px'), _fillStyle);
      var handleStyle = mode === 'single' ? _defineProperty({}, direction, coords.handle + 'px') : {
        start: _defineProperty({}, direction, coords.handle.start + 'px'),
        end: _defineProperty({}, direction, coords.handle.end + 'px')
      };

      var showTooltip = {
        start: tooltip && active && activeEl === 'start',
        end: tooltip && active && activeEl === 'end'
      };

      var labelItems = [];
      var labelKeys = Object.keys(labels);

      if (labelKeys.length > 0) {
        labelKeys = labelKeys.sort(function (a, b) {
          return reverse ? a - b : b - a;
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = labelKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            var labelPosition = this.getPositionFromValue(Number(key));
            var labelCoords = this.coordinates(labelPosition);
            var labelStyle = _defineProperty({}, direction, labelCoords.label + 'px');

            labelItems.push(_react2.default.createElement(
              'li',
              {
                key: key,
                className: (0, _classnames2.default)('rangeslider__label-item'),
                'data-value': key,
                onMouseDown: this.handleDrag,
                onTouchStart: this.handleStart,
                onTouchEnd: this.handleEnd,
                style: labelStyle
              },
              this.props.labels[key]
            ));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(s) {
            _this2.slider = s;
          },
          className: (0, _classnames2.default)('rangeslider', 'rangeslider-' + orientation, { 'rangeslider-reverse': reverse }, className),
          onMouseDown: this.handleDrag,
          onMouseUp: this.handleEnd,
          onTouchStart: this.handleStart,
          onTouchEnd: this.handleEnd,
          'aria-valuemin': min,
          'aria-valuemax': max,
          'aria-valuenow': value,
          'aria-orientation': orientation
        },
        _react2.default.createElement('div', { className: 'rangeslider__fill', style: fillStyle }),
        mode === 'single' ? this.renderHandler(value, 'end', handleStyle, showTooltip.end, handleLabel) : this.renderDoubleHandler(value, handleStyle, showTooltip, handleLabel),
        labels ? this.renderLabels(labelItems) : null
      );
    }
  }]);

  return Slider;
}(_react.Component);

Slider.propTypes = {
  min: _propTypes2.default.number,
  max: _propTypes2.default.number,
  step: _propTypes2.default.number,
  value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({
    start: _propTypes2.default.number,
    end: _propTypes2.default.number
  })]),
  orientation: _propTypes2.default.string,
  tooltip: _propTypes2.default.bool,
  reverse: _propTypes2.default.bool,
  labels: _propTypes2.default.object,
  handleLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.shape({
    start: _propTypes2.default.string,
    end: _propTypes2.default.string
  })]),
  format: _propTypes2.default.func,
  onChangeStart: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onChangeComplete: _propTypes2.default.func,
  mode: _propTypes2.default.string,
  className: _propTypes2.default.string
};
Slider.defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  value: 0,
  orientation: 'horizontal',
  tooltip: true,
  reverse: false,
  labels: {},
  handleLabel: '',
  mode: 'single'
};
exports.default = Slider;