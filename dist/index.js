'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * We use a negative right on the content to hide original OS scrollbars
 */

var OS_SCROLLBAR_WIDTH = function () {
  var outer = document.createElement('div');
  var inner = document.createElement('div');
  outer.style.overflow = 'scroll';
  outer.style.width = '100%';
  inner.style.width = '100%';
  document.body.appendChild(outer);
  outer.appendChild(inner);
  var scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.removeChild(inner);
  document.body.removeChild(outer);
  return scrollbarWidth;
}();
/**
 * We need this for OSs that automatically hide the scrollbar (so the offset
 * doesn't change in such case). Eg: macOS with "Automatically based on mouse".
 */


var SCROLLBAR_WIDTH = OS_SCROLLBAR_WIDTH || 20;
/**
 * Ported from Vitor's SimpleScrollbar library (vanilla JS):
 * https://github.com/buzinas/simple-scrollbar
 * @param {React.ReactNode} content Used as a dependency to re-run the effect
 * @param {React.MutableRefObject} [customRef]
 * @param {Object} [options={}]
 * @param {boolean} [options.disabled]
 */

function useCustomScroller(content, customRef) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      disabled = _ref.disabled;

  var _useState = React.useState(1),
      _useState2 = _slicedToArray(_useState, 2),
      scrollRatio = _useState2[0],
      setScrollRatio = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isDraggingTrack = _useState4[0],
      setIsDraggingTrack = _useState4[1];

  var ref = React.useRef();
  var scrollerRef = customRef || ref;
  var trackRef = React.useRef();
  var trackAnimationRef = React.useRef();
  var memoizedProps = React.useRef({});
  React.useLayoutEffect(function () {
    var el = scrollerRef.current;
    var scrollbarAnimation;

    var updateScrollbar = function updateScrollbar() {
      cancelAnimationFrame(scrollbarAnimation);
      scrollbarAnimation = requestAnimationFrame(function () {
        var clientHeight = el.clientHeight,
            scrollHeight = el.scrollHeight;
        setScrollRatio(clientHeight / scrollHeight);
        memoizedProps.current = {
          clientHeight: clientHeight,
          scrollHeight: scrollHeight,
          trackHeight: trackRef.current.clientHeight
        };
      });
    };

    window.addEventListener('resize', updateScrollbar);
    updateScrollbar();
    return function () {
      cancelAnimationFrame(scrollbarAnimation);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [scrollerRef, content]);
  React.useLayoutEffect(function () {
    if (!disabled) return;
    var el = scrollerRef.current;

    var onWheel = function onWheel(e) {
      return e.preventDefault();
    };

    el.addEventListener('wheel', onWheel, {
      passive: false
    });
    return function () {
      el.removeEventListener('wheel', onWheel);
    };
  }, [scrollerRef, disabled]);
  var onScroll = React.useCallback(function () {
    if (scrollRatio === 1) return;
    var el = scrollerRef.current;
    var track = trackRef.current;
    cancelAnimationFrame(trackAnimationRef.current);
    trackAnimationRef.current = requestAnimationFrame(function () {
      var _memoizedProps$curren = memoizedProps.current,
          clientHeight = _memoizedProps$curren.clientHeight,
          scrollHeight = _memoizedProps$curren.scrollHeight,
          trackHeight = _memoizedProps$curren.trackHeight;
      var ratio = el.scrollTop / (scrollHeight - clientHeight);
      var y = ratio * (clientHeight - trackHeight);
      track.style.transform = "translateY(".concat(y, "px)");
    });
  }, [scrollerRef, scrollRatio]);
  var moveTrack = React.useCallback(function (e) {
    var el = scrollerRef.current;
    var moveAnimation;
    var lastPageY = e.pageY;
    var lastScrollTop = el.scrollTop;
    setIsDraggingTrack(true);

    var drag = function drag(_ref2) {
      var pageY = _ref2.pageY;
      cancelAnimationFrame(moveAnimation);
      moveAnimation = requestAnimationFrame(function () {
        var delta = pageY - lastPageY;
        lastScrollTop += delta / scrollRatio;
        lastPageY = pageY;
        el.scrollTop = lastScrollTop;
      });
    };

    var stop = function stop() {
      setIsDraggingTrack(false);
      window.removeEventListener('mousemove', drag);
    };

    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stop, {
      once: true
    });
  }, [scrollerRef, scrollRatio]);
  var wrapperProps = {
    style: {
      marginLeft: "-".concat(SCROLLBAR_WIDTH, "px")
    }
  };
  var scrollerProps = {
    ref: scrollerRef,
    onScroll: disabled ? undefined : onScroll,
    style: {
      right: "-".concat(SCROLLBAR_WIDTH, "px"),
      padding: "0 ".concat(SCROLLBAR_WIDTH, "px 0 0"),
      width: "calc(100% + ".concat(OS_SCROLLBAR_WIDTH, "px)")
    }
  };
  var trackProps = {
    ref: trackRef,
    onMouseDown: disabled ? undefined : moveTrack,
    style: {
      right: isDraggingTrack ? 1 : undefined,
      width: isDraggingTrack ? 10 : undefined,
      height: "".concat(scrollRatio * 100, "%"),
      opacity: isDraggingTrack ? 1 : undefined,
      display: disabled || scrollRatio === 1 ? 'none' : undefined
    }
  };
  return [wrapperProps, scrollerProps, trackProps];
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".index-module_main__1fmTB {\n  position: relative;\n}\n\n.index-module_main__1fmTB:hover .index-module_track__BIi6w {\n  opacity: 0.75;\n}\n\n.index-module_wrapper__DnIZj {\n  position: relative;\n  height: 100%;\n  overflow: hidden;\n}\n\n.index-module_inner__3tgFM {\n  position: relative;\n  height: 100%;\n  box-sizing: border-box;\n  overflow-y: scroll;\n}\n\n.index-module_track__BIi6w {\n  position: absolute;\n  top: 0;\n  right: 3px;\n  cursor: default;\n  user-select: none;\n  width: 6px;\n  min-height: 30px;\n  max-height: 100%;\n  background: rgba(0, 0, 0, 0.4);\n  border-radius: 4px;\n  opacity: 0;\n  transition: opacity 0.25s ease-in;\n  z-index: 1;\n}\n\n.index-module_track__BIi6w:hover {\n  width: 10px;\n  right: 1px;\n}\n";
var styles = {"main":"index-module_main__1fmTB","track":"index-module_track__BIi6w","wrapper":"index-module_wrapper__DnIZj","inner":"index-module_inner__3tgFM"};
styleInject(css_248z);

var _excluded = ["scrollDisabled", "className", "innerClassName", "children"];

var cx = function cx() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.filter(Boolean).join(' ');
};

var CustomScroller = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var scrollDisabled = _ref.scrollDisabled,
      className = _ref.className,
      innerClassName = _ref.innerClassName,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useCustomScroller = useCustomScroller(children, ref, {
    disabled: scrollDisabled
  }),
      _useCustomScroller2 = _slicedToArray(_useCustomScroller, 3),
      wrapperProps = _useCustomScroller2[0],
      scrollerProps = _useCustomScroller2[1],
      trackProps = _useCustomScroller2[2];

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: cx(className, styles.main)
  }, props), /*#__PURE__*/React__default.createElement("div", _extends({
    className: styles.wrapper
  }, wrapperProps), /*#__PURE__*/React__default.createElement("div", _extends({
    className: cx(innerClassName, styles.inner)
  }, scrollerProps), children)), /*#__PURE__*/React__default.createElement("div", _extends({
    className: "CustomScrollerTrack"
  }, trackProps)));
});
CustomScroller.propTypes = {
  scrollDisabled: PropTypes.bool,
  innerClassName: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};
CustomScroller.displayName = 'CustomScroller';

module.exports = CustomScroller;
//# sourceMappingURL=index.js.map
