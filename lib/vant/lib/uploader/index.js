"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _utils2 = require("./utils");

var _field = require("../mixins/field");

var _icon = _interopRequireDefault(require("../icon"));

var _image = _interopRequireDefault(require("../image"));

var _loading = _interopRequireDefault(require("../loading"));

var _imagePreview = _interopRequireDefault(require("../image-preview"));

// Utils
// Mixins
// Components
var _createNamespace = (0, _utils.createNamespace)('uploader'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  inheritAttrs: false,
  mixins: [_field.FieldMixin],
  model: {
    prop: 'fileList'
  },
  props: {
    disabled: Boolean,
    readonly: Boolean,
    lazyLoad: Boolean,
    uploadText: String,
    afterRead: Function,
    beforeRead: Function,
    beforeDelete: Function,
    previewSize: [Number, String],
    previewOptions: Object,
    name: {
      type: [Number, String],
      default: ''
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    fileList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    maxSize: {
      type: [Number, String, Function],
      default: Number.MAX_VALUE
    },
    maxCount: {
      type: [Number, String],
      default: Number.MAX_VALUE
    },
    deletable: {
      type: Boolean,
      default: true
    },
    showUpload: {
      type: Boolean,
      default: true
    },
    previewImage: {
      type: Boolean,
      default: true
    },
    previewFullImage: {
      type: Boolean,
      default: true
    },
    imageFit: {
      type: String,
      default: 'cover'
    },
    resultType: {
      type: String,
      default: 'dataUrl'
    },
    uploadIcon: {
      type: String,
      default: 'photograph'
    }
  },
  computed: {
    previewSizeWithUnit: function previewSizeWithUnit() {
      return (0, _utils.addUnit)(this.previewSize);
    },
    // for form
    value: function value() {
      return this.fileList;
    }
  },
  created: function created() {
    this.urls = [];
  },
  beforeDestroy: function beforeDestroy() {
    this.urls.forEach(function (url) {
      return URL.revokeObjectURL(url);
    });
  },
  methods: {
    getDetail: function getDetail(index) {
      if (index === void 0) {
        index = this.fileList.length;
      }

      return {
        name: this.name,
        index: index
      };
    },
    onChange: function onChange(event) {
      var _this = this;

      var files = event.target.files;

      if (this.disabled || !files.length) {
        return;
      }

      files = files.length === 1 ? files[0] : [].slice.call(files);

      if (this.beforeRead) {
        var response = this.beforeRead(files, this.getDetail());

        if (!response) {
          this.resetInput();
          return;
        }

        if ((0, _utils.isPromise)(response)) {
          response.then(function (data) {
            if (data) {
              _this.readFile(data);
            } else {
              _this.readFile(files);
            }
          }).catch(this.resetInput);
          return;
        }
      }

      this.readFile(files);
    },
    readFile: function readFile(files) {
      var _this2 = this;

      var oversize = (0, _utils2.isOversize)(files, this.maxSize);

      if (Array.isArray(files)) {
        var maxCount = this.maxCount - this.fileList.length;

        if (files.length > maxCount) {
          files = files.slice(0, maxCount);
        }

        Promise.all(files.map(function (file) {
          return (0, _utils2.readFile)(file, _this2.resultType);
        })).then(function (contents) {
          var fileList = files.map(function (file, index) {
            var result = {
              file: file,
              status: '',
              message: ''
            };

            if (contents[index]) {
              result.content = contents[index];
            }

            return result;
          });

          _this2.onAfterRead(fileList, oversize);
        });
      } else {
        (0, _utils2.readFile)(files, this.resultType).then(function (content) {
          var result = {
            file: files,
            status: '',
            message: ''
          };

          if (content) {
            result.content = content;
          }

          _this2.onAfterRead(result, oversize);
        });
      }
    },
    onAfterRead: function onAfterRead(files, oversize) {
      var _this3 = this;

      this.resetInput();
      var validFiles = files;

      if (oversize) {
        var oversizeFiles = files;

        if (Array.isArray(files)) {
          oversizeFiles = [];
          validFiles = [];
          files.forEach(function (item) {
            if (item.file) {
              if ((0, _utils2.isOversize)(item.file, _this3.maxSize)) {
                oversizeFiles.push(item);
              } else {
                validFiles.push(item);
              }
            }
          });
        } else {
          validFiles = null;
        }

        this.$emit('oversize', oversizeFiles, this.getDetail());
      }

      var isValidFiles = Array.isArray(validFiles) ? Boolean(validFiles.length) : Boolean(validFiles);

      if (isValidFiles) {
        this.$emit('input', [].concat(this.fileList, (0, _utils2.toArray)(validFiles)));

        if (this.afterRead) {
          this.afterRead(validFiles, this.getDetail());
        }
      }
    },
    onDelete: function onDelete(file, index) {
      var _file$beforeDelete,
          _this4 = this;

      var beforeDelete = (_file$beforeDelete = file.beforeDelete) != null ? _file$beforeDelete : this.beforeDelete;

      if (beforeDelete) {
        var response = beforeDelete(file, this.getDetail(index));

        if (!response) {
          return;
        }

        if ((0, _utils.isPromise)(response)) {
          response.then(function () {
            _this4.deleteFile(file, index);
          }).catch(_utils.noop);
          return;
        }
      }

      this.deleteFile(file, index);
    },
    deleteFile: function deleteFile(file, index) {
      var fileList = this.fileList.slice(0);
      fileList.splice(index, 1);
      this.$emit('input', fileList);
      this.$emit('delete', file, this.getDetail(index));
    },
    resetInput: function resetInput() {
      /* istanbul ignore else */
      if (this.$refs.input) {
        this.$refs.input.value = '';
      }
    },
    onClickUpload: function onClickUpload(event) {
      this.$emit('click-upload', event);
    },
    onPreviewImage: function onPreviewImage(item) {
      var _this5 = this;

      if (!this.previewFullImage) {
        return;
      }

      var imageFiles = this.fileList.filter(function (item) {
        return (0, _utils2.isImageFile)(item);
      });
      var imageContents = imageFiles.map(function (item) {
        if (item.file && !item.url && item.status !== 'failed') {
          item.url = URL.createObjectURL(item.file);

          _this5.urls.push(item.url);
        }

        return item.url;
      });
      this.imagePreview = (0, _imagePreview.default)((0, _extends2.default)({
        images: imageContents,
        startPosition: imageFiles.indexOf(item),
        onClose: function onClose() {
          _this5.$emit('close-preview');
        }
      }, this.previewOptions));
    },
    // @exposed-api
    closeImagePreview: function closeImagePreview() {
      if (this.imagePreview) {
        this.imagePreview.close();
      }
    },
    // @exposed-api
    chooseFile: function chooseFile() {
      if (this.disabled) {
        return;
      }
      /* istanbul ignore else */


      if (this.$refs.input) {
        this.$refs.input.click();
      }
    },
    genPreviewMask: function genPreviewMask(item) {
      var h = this.$createElement;
      var status = item.status,
          message = item.message;

      if (status === 'uploading' || status === 'failed') {
        var MaskIcon = status === 'failed' ? h(_icon.default, {
          "attrs": {
            "name": "close"
          },
          "class": bem('mask-icon')
        }) : h(_loading.default, {
          "class": bem('loading')
        });
        var showMessage = (0, _utils.isDef)(message) && message !== '';
        return h("div", {
          "class": bem('mask')
        }, [MaskIcon, showMessage && h("div", {
          "class": bem('mask-message')
        }, [message])]);
      }
    },
    genPreviewItem: function genPreviewItem(item, index) {
      var _item$deletable,
          _this6 = this,
          _item$previewSize,
          _item$imageFit;

      var h = this.$createElement;
      var deleteAble = (_item$deletable = item.deletable) != null ? _item$deletable : this.deletable;
      var showDelete = item.status !== 'uploading' && deleteAble;
      var DeleteIcon = showDelete && h("div", {
        "class": bem('preview-delete'),
        "on": {
          "click": function click(event) {
            event.stopPropagation();

            _this6.onDelete(item, index);
          }
        }
      }, [h(_icon.default, {
        "attrs": {
          "name": "cross"
        },
        "class": bem('preview-delete-icon')
      })]);
      var PreviewCoverContent = this.slots('preview-cover', (0, _extends2.default)({
        index: index
      }, item));
      var PreviewCover = PreviewCoverContent && h("div", {
        "class": bem('preview-cover')
      }, [PreviewCoverContent]);
      var previewSize = (_item$previewSize = item.previewSize) != null ? _item$previewSize : this.previewSize;
      var imageFit = (_item$imageFit = item.imageFit) != null ? _item$imageFit : this.imageFit;
      var Preview = (0, _utils2.isImageFile)(item) ? h(_image.default, {
        "attrs": {
          "fit": imageFit,
          "src": item.content || item.url,
          "width": previewSize,
          "height": previewSize,
          "lazyLoad": this.lazyLoad
        },
        "class": bem('preview-image'),
        "on": {
          "click": function click() {
            _this6.onPreviewImage(item);
          }
        }
      }, [PreviewCover]) : h("div", {
        "class": bem('file'),
        "style": {
          width: this.previewSizeWithUnit,
          height: this.previewSizeWithUnit
        }
      }, [h(_icon.default, {
        "class": bem('file-icon'),
        "attrs": {
          "name": "description"
        }
      }), h("div", {
        "class": [bem('file-name'), 'van-ellipsis']
      }, [item.file ? item.file.name : item.url]), PreviewCover]);
      return h("div", {
        "class": bem('preview'),
        "on": {
          "click": function click() {
            _this6.$emit('click-preview', item, _this6.getDetail(index));
          }
        }
      }, [Preview, this.genPreviewMask(item), DeleteIcon]);
    },
    genPreviewList: function genPreviewList() {
      if (this.previewImage) {
        return this.fileList.map(this.genPreviewItem);
      }
    },
    genUpload: function genUpload() {
      var h = this.$createElement;

      if (this.fileList.length >= this.maxCount) {
        return;
      }

      var slot = this.slots();
      var Input = this.readonly ? null : h("input", {
        "attrs": (0, _extends2.default)({}, this.$attrs, {
          "type": "file",
          "accept": this.accept,
          "disabled": this.disabled
        }),
        "ref": "input",
        "class": bem('input'),
        "on": {
          "change": this.onChange
        }
      });

      if (slot) {
        return h("div", {
          "class": bem('input-wrapper'),
          "key": "input-wrapper",
          "on": {
            "click": this.onClickUpload
          }
        }, [slot, Input]);
      }

      var style;

      if (this.previewSize) {
        var size = this.previewSizeWithUnit;
        style = {
          width: size,
          height: size
        };
      }

      return h("div", {
        "directives": [{
          name: "show",
          value: this.showUpload
        }],
        "class": bem('upload', {
          readonly: this.readonly
        }),
        "style": style,
        "on": {
          "click": this.onClickUpload
        }
      }, [h(_icon.default, {
        "attrs": {
          "name": this.uploadIcon
        },
        "class": bem('upload-icon')
      }), this.uploadText && h("span", {
        "class": bem('upload-text')
      }, [this.uploadText]), Input]);
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "class": bem()
    }, [h("div", {
      "class": bem('wrapper', {
        disabled: this.disabled
      })
    }, [this.genPreviewList(), this.genUpload()])]);
  }
});

exports.default = _default2;