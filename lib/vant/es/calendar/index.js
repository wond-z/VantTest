// Utils
import { raf } from '../utils/dom/raf';
import { isDate } from '../utils/validate/date';
import { getScrollTop } from '../utils/dom/scroll';
import { t, bem, copyDate, copyDates, getNextDay, compareDay, calcDateNum, compareMonth, createComponent, getDayByOffset } from './utils'; // Components

import Popup from '../popup';
import Button from '../button';
import Toast from '../toast';
import Month from './components/Month';
import Header from './components/Header';
export default createComponent({
  props: {
    title: String,
    color: String,
    value: Boolean,
    readonly: Boolean,
    formatter: Function,
    rowHeight: [Number, String],
    confirmText: String,
    rangePrompt: String,
    defaultDate: [Date, Array],
    getContainer: [String, Function],
    allowSameDay: Boolean,
    confirmDisabledText: String,
    type: {
      type: String,
      default: 'single'
    },
    round: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'bottom'
    },
    poppable: {
      type: Boolean,
      default: true
    },
    maxRange: {
      type: [Number, String],
      default: null
    },
    lazyRender: {
      type: Boolean,
      default: true
    },
    showMark: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    showSubtitle: {
      type: Boolean,
      default: true
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    },
    minDate: {
      type: Date,
      validator: isDate,
      default: function _default() {
        return new Date();
      }
    },
    maxDate: {
      type: Date,
      validator: isDate,
      default: function _default() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
      }
    },
    firstDayOfWeek: {
      type: [Number, String],
      default: 0,
      validator: function validator(val) {
        return val >= 0 && val <= 6;
      }
    }
  },
  inject: {
    vanPopup: {
      default: null
    }
  },
  data: function data() {
    return {
      subtitle: '',
      currentDate: this.getInitialDate()
    };
  },
  computed: {
    months: function months() {
      var months = [];
      var cursor = new Date(this.minDate);
      cursor.setDate(1);

      do {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      } while (compareMonth(cursor, this.maxDate) !== 1);

      return months;
    },
    buttonDisabled: function buttonDisabled() {
      var type = this.type,
          currentDate = this.currentDate;

      if (currentDate) {
        if (type === 'range') {
          return !currentDate[0] || !currentDate[1];
        }

        if (type === 'multiple') {
          return !currentDate.length;
        }
      }

      return !currentDate;
    },
    dayOffset: function dayOffset() {
      return this.firstDayOfWeek ? this.firstDayOfWeek % 7 : 0;
    }
  },
  watch: {
    value: 'init',
    type: function type() {
      this.reset();
    },
    defaultDate: function defaultDate(val) {
      this.currentDate = val;
      this.scrollIntoView();
    }
  },
  mounted: function mounted() {
    this.init(); // https://github.com/vant-ui/vant/issues/9845

    if (!this.poppable) {
      var _this$vanPopup;

      (_this$vanPopup = this.vanPopup) == null ? void 0 : _this$vanPopup.$on('opened', this.onScroll);
    }
  },

  /* istanbul ignore next */
  activated: function activated() {
    this.init();
  },
  methods: {
    // @exposed-api
    reset: function reset(date) {
      if (date === void 0) {
        date = this.getInitialDate();
      }

      this.currentDate = date;
      this.scrollIntoView();
    },
    init: function init() {
      var _this = this;

      if (this.poppable && !this.value) {
        return;
      }

      this.$nextTick(function () {
        // add Math.floor to avoid decimal height issues
        // https://github.com/vant-ui/vant/issues/5640
        _this.bodyHeight = Math.floor(_this.$refs.body.getBoundingClientRect().height);

        _this.onScroll();

        _this.scrollIntoView();
      });
    },
    // @exposed-api
    scrollToDate: function scrollToDate(targetDate) {
      var _this2 = this;

      raf(function () {
        var displayed = _this2.value || !_this2.poppable;
        /* istanbul ignore if */

        if (!targetDate || !displayed) {
          return;
        }

        _this2.months.some(function (month, index) {
          if (compareMonth(month, targetDate) === 0) {
            var _this2$$refs = _this2.$refs,
                body = _this2$$refs.body,
                months = _this2$$refs.months;
            months[index].scrollIntoView(body);
            return true;
          }

          return false;
        });

        _this2.onScroll();
      });
    },
    // scroll to current month
    scrollIntoView: function scrollIntoView() {
      var currentDate = this.currentDate;

      if (currentDate) {
        var targetDate = this.type === 'single' ? currentDate : currentDate[0];
        this.scrollToDate(targetDate);
      }
    },
    getInitialDate: function getInitialDate() {
      var type = this.type,
          minDate = this.minDate,
          maxDate = this.maxDate,
          defaultDate = this.defaultDate;

      if (defaultDate === null) {
        return defaultDate;
      }

      var defaultVal = new Date();

      if (compareDay(defaultVal, minDate) === -1) {
        defaultVal = minDate;
      } else if (compareDay(defaultVal, maxDate) === 1) {
        defaultVal = maxDate;
      }

      if (type === 'range') {
        var _ref = defaultDate || [],
            startDay = _ref[0],
            endDay = _ref[1];

        return [startDay || defaultVal, endDay || getNextDay(defaultVal)];
      }

      if (type === 'multiple') {
        return defaultDate || [defaultVal];
      }

      return defaultDate || defaultVal;
    },
    // calculate the position of the elements
    // and find the elements that needs to be rendered
    onScroll: function onScroll() {
      var _this$$refs = this.$refs,
          body = _this$$refs.body,
          months = _this$$refs.months;
      var top = getScrollTop(body);
      var bottom = top + this.bodyHeight;
      var heights = months.map(function (item) {
        return item.getHeight();
      });
      var heightSum = heights.reduce(function (a, b) {
        return a + b;
      }, 0); // iOS scroll bounce may exceed the range

      if (bottom > heightSum && top > 0) {
        return;
      }

      var height = 0;
      var currentMonth;
      var visibleRange = [-1, -1];

      for (var i = 0; i < months.length; i++) {
        var visible = height <= bottom && height + heights[i] >= top;

        if (visible) {
          visibleRange[1] = i;

          if (!currentMonth) {
            currentMonth = months[i];
            visibleRange[0] = i;
          }

          if (!months[i].showed) {
            months[i].showed = true;
            this.$emit('month-show', {
              date: months[i].date,
              title: months[i].title
            });
          }
        }

        height += heights[i];
      }

      months.forEach(function (month, index) {
        month.visible = index >= visibleRange[0] - 1 && index <= visibleRange[1] + 1;
      });
      /* istanbul ignore else */

      if (currentMonth) {
        this.subtitle = currentMonth.title;
      }
    },
    onClickDay: function onClickDay(item) {
      if (this.readonly) {
        return;
      }

      var date = item.date;
      var type = this.type,
          currentDate = this.currentDate;

      if (type === 'range') {
        if (!currentDate) {
          this.select([date, null]);
          return;
        }

        var startDay = currentDate[0],
            endDay = currentDate[1];

        if (startDay && !endDay) {
          var compareToStart = compareDay(date, startDay);

          if (compareToStart === 1) {
            this.select([startDay, date], true);
          } else if (compareToStart === -1) {
            this.select([date, null]);
          } else if (this.allowSameDay) {
            this.select([date, date], true);
          }
        } else {
          this.select([date, null]);
        }
      } else if (type === 'multiple') {
        if (!currentDate) {
          this.select([date]);
          return;
        }

        var selectedIndex;
        var selected = this.currentDate.some(function (dateItem, index) {
          var equal = compareDay(dateItem, date) === 0;

          if (equal) {
            selectedIndex = index;
          }

          return equal;
        });

        if (selected) {
          var _currentDate$splice = currentDate.splice(selectedIndex, 1),
              unselectedDate = _currentDate$splice[0];

          this.$emit('unselect', copyDate(unselectedDate));
        } else if (this.maxRange && currentDate.length >= this.maxRange) {
          Toast(this.rangePrompt || t('rangePrompt', this.maxRange));
        } else {
          this.select([].concat(currentDate, [date]));
        }
      } else {
        this.select(date, true);
      }
    },
    togglePopup: function togglePopup(val) {
      this.$emit('input', val);
    },
    select: function select(date, complete) {
      var _this3 = this;

      var emit = function emit(date) {
        _this3.currentDate = date;

        _this3.$emit('select', copyDates(_this3.currentDate));
      };

      if (complete && this.type === 'range') {
        var valid = this.checkRange(date);

        if (!valid) {
          // auto selected to max range if showConfirm
          if (this.showConfirm) {
            emit([date[0], getDayByOffset(date[0], this.maxRange - 1)]);
          } else {
            emit(date);
          }

          return;
        }
      }

      emit(date);

      if (complete && !this.showConfirm) {
        this.onConfirm();
      }
    },
    checkRange: function checkRange(date) {
      var maxRange = this.maxRange,
          rangePrompt = this.rangePrompt;

      if (maxRange && calcDateNum(date) > maxRange) {
        Toast(rangePrompt || t('rangePrompt', maxRange));
        return false;
      }

      return true;
    },
    onConfirm: function onConfirm() {
      this.$emit('confirm', copyDates(this.currentDate));
    },
    genMonth: function genMonth(date, index) {
      var h = this.$createElement;
      var showMonthTitle = index !== 0 || !this.showSubtitle;
      return h(Month, {
        "ref": "months",
        "refInFor": true,
        "attrs": {
          "date": date,
          "type": this.type,
          "color": this.color,
          "minDate": this.minDate,
          "maxDate": this.maxDate,
          "showMark": this.showMark,
          "formatter": this.formatter,
          "rowHeight": this.rowHeight,
          "lazyRender": this.lazyRender,
          "currentDate": this.currentDate,
          "showSubtitle": this.showSubtitle,
          "allowSameDay": this.allowSameDay,
          "showMonthTitle": showMonthTitle,
          "firstDayOfWeek": this.dayOffset
        },
        "scopedSlots": {
          'top-info': this.$scopedSlots['top-info'],
          'bottom-info': this.$scopedSlots['bottom-info']
        },
        "on": {
          "click": this.onClickDay
        }
      });
    },
    genFooterContent: function genFooterContent() {
      var h = this.$createElement;
      var slot = this.slots('footer');

      if (slot) {
        return slot;
      }

      if (this.showConfirm) {
        var text = this.buttonDisabled ? this.confirmDisabledText : this.confirmText;
        return h(Button, {
          "attrs": {
            "round": true,
            "block": true,
            "type": "danger",
            "color": this.color,
            "disabled": this.buttonDisabled,
            "nativeType": "button"
          },
          "class": bem('confirm'),
          "on": {
            "click": this.onConfirm
          }
        }, [text || t('confirm')]);
      }
    },
    genFooter: function genFooter() {
      var h = this.$createElement;
      return h("div", {
        "class": bem('footer', {
          unfit: !this.safeAreaInsetBottom
        })
      }, [this.genFooterContent()]);
    },
    genCalendar: function genCalendar() {
      var _this4 = this;

      var h = this.$createElement;
      return h("div", {
        "class": bem()
      }, [h(Header, {
        "attrs": {
          "title": this.title,
          "showTitle": this.showTitle,
          "subtitle": this.subtitle,
          "showSubtitle": this.showSubtitle,
          "firstDayOfWeek": this.dayOffset
        },
        "scopedSlots": {
          title: function title() {
            return _this4.slots('title');
          }
        }
      }), h("div", {
        "ref": "body",
        "class": bem('body'),
        "on": {
          "scroll": this.onScroll
        }
      }, [this.months.map(this.genMonth)]), this.genFooter()]);
    }
  },
  render: function render() {
    var _this5 = this;

    var h = arguments[0];

    if (this.poppable) {
      var _attrs;

      var createListener = function createListener(name) {
        return function () {
          return _this5.$emit(name);
        };
      };

      return h(Popup, {
        "attrs": (_attrs = {
          "round": true,
          "value": this.value
        }, _attrs["round"] = this.round, _attrs["position"] = this.position, _attrs["closeable"] = this.showTitle || this.showSubtitle, _attrs["getContainer"] = this.getContainer, _attrs["closeOnPopstate"] = this.closeOnPopstate, _attrs["closeOnClickOverlay"] = this.closeOnClickOverlay, _attrs),
        "class": bem('popup'),
        "on": {
          "input": this.togglePopup,
          "open": createListener('open'),
          "opened": createListener('opened'),
          "close": createListener('close'),
          "closed": createListener('closed')
        }
      }, [this.genCalendar()]);
    }

    return this.genCalendar();
  }
});