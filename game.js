var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FlashMode;
(function (FlashMode) {
    FlashMode[FlashMode["STANDARD"] = 0] = "STANDARD";
    FlashMode[FlashMode["QUICK"] = 1] = "QUICK";
    FlashMode[FlashMode["DELAYED"] = 2] = "DELAYED";
    FlashMode[FlashMode["DOUBLE"] = 3] = "DOUBLE";
})(FlashMode || (FlashMode = {}));
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["BASIC"] = 0] = "BASIC";
})(ObjectType || (ObjectType = {}));
var ObjectManager = (function () {
    function ObjectManager(_stage) {
        var _this = this;
        this.objects = [];
        this.updateAll = function () {
            for (var i = 0; i < _this.objects.length; i += 1) {
                if (_this.objects[i].toRemove) {
                    _this.removeObjectAt(i);
                    i -= 1;
                }
                else {
                    _this.objects[i].update();
                }
            }
        };
        this.stage = _stage;
    }
    ObjectManager.prototype.numObjects = function () {
        return this.objects.length;
    };
    ObjectManager.prototype.getObjectAt = function (i) {
        return this.objects[i];
    };
    ObjectManager.prototype.getObjectIndex = function (_object) {
        for (var i = 0; i < this.objects.length; i += 1) {
            if (this.objects[i] == _object) {
                return i;
            }
        }
    };
    ObjectManager.prototype.addObject = function (_object, _top) {
        if (_top === void 0) { _top = true; }
        if (_top) {
            this.stage.addChild(_object);
        }
        else {
            this.stage.addChildAt(_object, 0);
        }
        this.objects.push(_object);
        return _object;
    };
    ObjectManager.prototype.removeObject = function (_object) {
        return this.removeObjectAt(this.getObjectIndex(_object));
    };
    ObjectManager.prototype.removeObjectAt = function (i) {
        var _object = this.objects[i];
        if (_object.parent != null)
            _object.parent.removeChild(_object);
        this.objects.splice(i, 1);
        return _object;
    };
    ObjectManager.prototype.getAllInRange = function (point, maxDist, filter) {
        if (filter === void 0) { filter = {}; }
        var m = [];
        main: for (var i = 0; i < this.objects.length; i += 1) {
            var _object = this.objects[i];
            if (filter.notThis != null && filter.notThis == _object)
                continue main;
            if (filter.has != null) {
                for (var v in filter.has) {
                    if (_object[v] != filter.has[v])
                        continue main;
                }
            }
            if (filter.greater != null) {
                for (var v in filter.greater) {
                    if (_object[v] <= filter.greater[v])
                        continue main;
                }
            }
            if (filter.less != null) {
                for (var v in filter.less) {
                    if (_object[v] >= filter.less[v])
                        continue main;
                }
            }
            if (filter.not != null) {
                for (var v in filter.not) {
                    if (_object[v] == filter.not[v])
                        continue main;
                }
            }
            if (!_object.interactive)
                continue;
            var _distance = _object.getNowDistance(point);
            if (_distance <= maxDist) {
                m.push(_object);
            }
        }
        return m;
    };
    ObjectManager.prototype.getFirstObject = function (point, maxDist, filter) {
        if (filter === void 0) { filter = {}; }
        main: for (var i = 0; i < this.objects.length; i += 1) {
            var _object = this.objects[i];
            if (filter.notThis != null && filter.notThis == _object)
                continue main;
            if (filter.has != null) {
                for (var v in filter.has) {
                    if (_object[v] != filter.has[v])
                        continue main;
                }
            }
            if (filter.greater != null) {
                for (var v in filter.greater) {
                    if (_object[v] <= filter.greater[v])
                        continue main;
                }
            }
            if (filter.less != null) {
                for (var v in filter.less) {
                    if (_object[v] >= filter.less[v])
                        continue main;
                }
            }
            if (filter.not != null) {
                for (var v in filter.not) {
                    if (_object[v] == filter.not[v])
                        continue main;
                }
            }
            if (!this.objects[i].interactive)
                continue;
            if (this.objects[i].getNowDistance(point) <= maxDist) {
                return this.objects[i];
            }
        }
        return null;
    };
    ObjectManager.prototype.getClosestObject = function (point, maxDist, filter) {
        if (filter === void 0) { filter = {}; }
        var m = null;
        var _distance = maxDist;
        var _distance2 = 0;
        main: for (var i = 0; i < this.objects.length; i += 1) {
            var _object = this.objects[i];
            if (filter.notThis != null && filter.notThis == _object)
                continue main;
            if (filter.has != null) {
                for (var v in filter.has) {
                    if (_object[v] != filter.has[v])
                        continue main;
                }
            }
            if (filter.greater != null) {
                for (var v in filter.greater) {
                    if (_object[v] <= filter.greater[v])
                        continue main;
                }
            }
            if (filter.less != null) {
                for (var v in filter.less) {
                    if (_object[v] >= filter.less[v])
                        continue main;
                }
            }
            if (filter.not != null) {
                for (var v in filter.not) {
                    if (_object[v] == filter.not[v])
                        continue main;
                }
            }
            if (!this.objects[i].interactive)
                continue;
            _distance2 = this.objects[i].getNowDistance(point);
            if (_distance2 <= _distance) {
                _distance = _distance2;
                m = this.objects[i];
            }
        }
        return m;
    };
    ObjectManager.prototype.removeAll = function () {
        while (this.objects.length > 0) {
            this.removeObjectAt(0);
        }
    };
    ObjectManager.prototype.forEach = function (_function) {
        for (var i = 0; i < this.objects.length; i += 1) {
            _function.call(this.objects[i]);
        }
    };
    return ObjectManager;
}());
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject(_texture) {
        if (_texture === void 0) { _texture = null; }
        var _this = _super.call(this, _texture) || this;
        _this.baseTint = 0xffffff;
        _this.goal = new PIXI.Point(0, 0);
        _this.eventRegisters = [];
        _this.type = ObjectType.BASIC;
        _this.moving = false;
        _this.selected = false;
        _this.draggable = true;
        _this.dragging = false;
        _this.clickable = true;
        _this.toRemove = false;
        _this.tweenSpeed = 0.3;
        _this.update = function () {
            var _static = true;
            if (_this.x != _this.goal.x) {
                var diff = _this.goal.x + -_this.x;
                if (Math.abs(diff) < 1)
                    _this.x = _this.goal.x;
                else {
                    _this.x += diff * _this.tweenSpeed;
                    _static = false;
                    _this.moving = true;
                }
            }
            if (_this.y != _this.goal.y) {
                var diff = _this.goal.y - _this.y;
                if (Math.abs(diff) < 1)
                    _this.y = _this.goal.y;
                else {
                    _this.y += diff * _this.tweenSpeed;
                    _static = false;
                    _this.moving = true;
                }
            }
            if (_static && _this.moving) {
                _this.moving = false;
                _this.publishEvent(ObjectEvent.END_TWEEN, new JME_TweenEnd(_this));
            }
        };
        _this.interactive = true;
        _this.buttonMode = true;
        return _this;
    }
    Object.defineProperty(GameObject.prototype, "asPoint", {
        get: function () {
            return new PIXI.Point(this.x, this.y);
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.addEventListener = function (_type, _function, _once) {
        if (_once === void 0) { _once = false; }
        if (this.eventRegisters[_type] == null)
            this.eventRegisters[_type] = new JMERegister(_type);
        if (_once) {
            this.eventRegisters[_type].once.push(_function);
        }
        else {
            this.eventRegisters[_type].listeners.push(_function);
        }
    };
    GameObject.prototype.publishEvent = function (_type, _par) {
        if (this.eventRegisters[_type] != null)
            JME.publishSelfEvent(this.eventRegisters[_type], _par);
    };
    GameObject.prototype.setTint = function (_color) {
        this.baseTint = _color;
        this.tint = _color;
    };
    GameObject.prototype.onSelect = function () {
    };
    GameObject.prototype.clearSelect = function () {
    };
    GameObject.prototype.getDistance = function (p) {
        var dX = p.x - this.goal.x;
        var dY = p.y - this.goal.y;
        if (dX > this.width)
            dX -= this.width;
        else if (dX > 0)
            dX = 0;
        if (dY > this.height)
            dY -= this.height;
        else if (dY > 0)
            dY = 0;
        return Math.sqrt(dX * dX + dY * dY);
    };
    GameObject.prototype.getNowDistance = function (p) {
        return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
    };
    GameObject.prototype.goto = function (x, y) {
        this.goal.set(x, y);
        this.x = x;
        this.y = y;
    };
    GameObject.prototype.tweenTo = function (x, y, _output) {
        if (_output === void 0) { _output = null; }
        this.goal.set(x, y);
        if (_output != null) {
            this.addEventListener(ObjectEvent.END_TWEEN, _output, true);
        }
    };
    Object.defineProperty(GameObject.prototype, "tweening", {
        get: function () {
            if (this.goal.x != this.x || this.goal.y != this.y)
                return true;
            return false;
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.select = function (b) {
        if (b === void 0) { b = true; }
        if (b) {
        }
        else {
        }
    };
    GameObject.prototype.dispose = function () {
        this.toRemove = true;
    };
    GameObject.prototype.onWheel = function (_delta) {
    };
    GameObject.prototype.colorFlash = function (_color, _mode) {
        if (_color === void 0) { _color = -1; }
        if (_mode === void 0) { _mode = FlashMode.STANDARD; }
        if (_color < 0)
            _color = 0xff0000;
        switch (_mode) {
            case FlashMode.QUICK:
                JMBL.tweenColor(this, 4, { tint: _color }, function () {
                    JMBL.tweenColor(this, 6, { delay: 10, tint: this.baseTint });
                });
                break;
            case FlashMode.STANDARD:
                JMBL.tweenColor(this, 8, { tint: _color }, function () {
                    JMBL.tweenColor(this, 12, { delay: 20, tint: this.baseTint });
                });
                break;
            case FlashMode.DOUBLE:
                JMBL.tweenColor(this, 1, { tint: _color }, function () {
                    JMBL.tweenColor(this, 4, { tint: this.baseTint }, function () {
                        JMBL.tweenColor(this, 5, { delay: 4, tint: _color }, function () {
                            JMBL.tweenColor(this, 12, { delay: 14, tint: this.baseTint });
                        });
                    });
                });
                break;
            case FlashMode.DELAYED:
                JMBL.tweenColor(this, 7, { delay: 32, tint: _color }, function () {
                    JMBL.tweenColor(this, 10, { delay: 25, tint: this.baseTint });
                });
                break;
        }
    };
    return GameObject;
}(PIXI.Sprite));
var DisplayState;
(function (DisplayState) {
    DisplayState[DisplayState["NORMAL"] = 0] = "NORMAL";
    DisplayState[DisplayState["DARKENED"] = 1] = "DARKENED";
    DisplayState[DisplayState["BLACKENED"] = 2] = "BLACKENED";
    DisplayState[DisplayState["GREYED"] = 3] = "GREYED";
    DisplayState[DisplayState["BRIGHTENED"] = 4] = "BRIGHTENED";
})(DisplayState || (DisplayState = {}));
var BoolPlus;
(function (BoolPlus) {
    BoolPlus[BoolPlus["False"] = 0] = "False";
    BoolPlus[BoolPlus["Enabled"] = 1] = "Enabled";
    BoolPlus[BoolPlus["Active"] = 2] = "Active";
})(BoolPlus || (BoolPlus = {}));
var JMBUI_BasicElement = (function (_super) {
    __extends(JMBUI_BasicElement, _super);
    function JMBUI_BasicElement(options) {
        var _this = _super.call(this) || this;
        _this.graphics = new PIXI.Graphics;
        options = options || {};
        _this.addChild(_this.graphics);
        if (options.width != null) {
            _this.graphics.beginFill(options.bgColor || 0x808080);
            if (options.rounding != null) {
                _this.graphics.drawRoundedRect(0, 0, options.width, options.height, options.rounding);
            }
            else {
                _this.graphics.drawRect(0, 0, options.width, options.height);
            }
            _this.graphics.alpha = options.alpha == null ? 1 : options.alpha;
        }
        _this.x = options.x || 0;
        _this.y = options.y || 0;
        if (options.label != null) {
            _this.label = new PIXI.Text(options.label, options.labelStyle || {});
            if (_this.label.width > _this.graphics.width * 0.9) {
                _this.label.width = _this.graphics.width * 0.9;
                _this.label.scale.y = _this.label.scale.x;
            }
            _this.label.x = (options.width - _this.label.width) / 2;
            _this.label.y = (options.height - _this.label.height) / 2;
            _this.addChild(_this.label);
        }
        return _this;
    }
    return JMBUI_BasicElement;
}(PIXI.Sprite));
var JMBUI_InteractiveElement = (function (_super) {
    __extends(JMBUI_InteractiveElement, _super);
    function JMBUI_InteractiveElement(options) {
        var _this = _super.call(this, options) || this;
        _this.setDisplayState = function (_state) {
            if (_this.displayState == _state)
                return;
            _this.displayState = _state;
            if (_this.overlay == null)
                _this.overlay = new PIXI.Graphics();
            _this.overlay.clear();
            switch (_state) {
                case DisplayState.DARKENED:
                    _this.overlay.beginFill(0);
                    _this.overlay.alpha = 0.5;
                    _this.overlay.drawRect(0, 0, _this.graphics.width, _this.graphics.height);
                    _this.addChild(_this.overlay);
                    break;
                case DisplayState.BLACKENED:
                    _this.overlay.beginFill(0);
                    _this.overlay.alpha = 0.8;
                    _this.overlay.drawRect(0, 0, _this.graphics.width, _this.graphics.height);
                    _this.addChild(_this.overlay);
                    break;
                case DisplayState.GREYED:
                    _this.overlay.beginFill(0x999999);
                    _this.overlay.alpha = 0.5;
                    _this.overlay.drawRect(0, 0, _this.graphics.width, _this.graphics.height);
                    _this.addChild(_this.overlay);
                    break;
                case DisplayState.BRIGHTENED:
                    _this.overlay.beginFill(0xffffff);
                    _this.overlay.alpha = 0.3;
                    _this.overlay.drawRect(0, 0, _this.graphics.width, _this.graphics.height);
                    _this.addChild(_this.overlay);
                    break;
                case DisplayState.NORMAL:
                default:
                    if (_this.overlay != null && _this.overlay.parent == _this) {
                        _this.removeChild(_this.overlay);
                    }
                    break;
            }
        };
        options = options || {};
        _this.interactive = true;
        if (options.downFunction != null) {
            _this.downFunction = options.downFunction;
            _this.on("pointerdown", _this.downFunction);
        }
        options.displayState = options.displayState || DisplayState.NORMAL;
        _this.setDisplayState(options.displayState);
        return _this;
    }
    return JMBUI_InteractiveElement;
}(JMBUI_BasicElement));
var JMBUI_Button = (function (_super) {
    __extends(JMBUI_Button, _super);
    function JMBUI_Button(options) {
        var _this = _super.call(this, JMBL.applyDefaultOptions(options, {
            x: 50, y: 50, width: 200, height: 50, bgColor: 0x8080ff,
        })) || this;
        _this.downOnThis = false;
        _this.disabled = false;
        _this.timeout = BoolPlus.Enabled;
        _this.output = options.output;
        _this.buttonMode = true;
        if (facade.interactionMode == "desktop") {
            _this.addListener("pointerover", function (e) {
                if (!_this.disabled)
                    _this.setDisplayState(DisplayState.DARKENED);
                facade.disableGameInput();
            });
            _this.addListener("pointerout", function (e) {
                if (!_this.disabled)
                    _this.setDisplayState(DisplayState.NORMAL);
                _this.downOnThis = false;
                facade.disableGameInput(false);
            });
            _this.addListener("pointerdown", function (e) {
                if (!_this.disabled)
                    _this.setDisplayState(DisplayState.BRIGHTENED);
                _this.downOnThis = true;
                if (_this.timeout == BoolPlus.Enabled) {
                    _this.timeout = BoolPlus.Active;
                    window.setTimeout(function () { _this.timeout = BoolPlus.Enabled; }, CONFIG.INIT.MOUSE_HOLD);
                }
            });
            _this.addListener("pointerup", function (e) {
                if (!_this.disabled)
                    _this.setDisplayState(DisplayState.DARKENED);
                if (_this.downOnThis && !_this.disabled && _this.output != null && _this.timeout != BoolPlus.Enabled)
                    _this.output();
                _this.downOnThis = false;
            });
        }
        else {
            _this.addListener("pointerup", function (e) {
                if (!_this.disabled && _this.output != null)
                    _this.output();
            });
        }
        return _this;
    }
    JMBUI_Button.prototype.disable = function (b) {
        if (b === void 0) { b = true; }
        this.disabled = b;
        if (b) {
            this.setDisplayState(DisplayState.BLACKENED);
        }
        else {
            this.setDisplayState(DisplayState.NORMAL);
        }
    };
    return JMBUI_Button;
}(JMBUI_InteractiveElement));
var JMBUI_ClearButton = (function (_super) {
    __extends(JMBUI_ClearButton, _super);
    function JMBUI_ClearButton(options) {
        var _this = _super.call(this, JMBL.applyDefaultOptions(options, {
            bgColor: 0x00ff00,
            alpha: 0.01,
            width: 190,
            height: 50,
            x: 0,
            y: 0,
        })) || this;
        _this.buttonMode = true;
        return _this;
    }
    return JMBUI_ClearButton;
}(JMBUI_InteractiveElement));
var JMBUI_SelectButton = (function (_super) {
    __extends(JMBUI_SelectButton, _super);
    function JMBUI_SelectButton(index, selectList, selectFunction, options) {
        if (options === void 0) { options = null; }
        var _this = _super.call(this, options) || this;
        _this.index = index;
        _this.myList = selectList;
        _this.output = _this.selectThis;
        _this.selectFunction = selectFunction;
        return _this;
    }
    JMBUI_SelectButton.prototype.selectThis = function () {
        if (this.selected)
            return;
        for (var i = 0; i < this.myList.length; i += 1) {
            this.myList[i].setSelectState(this.myList[i] == this);
        }
        this.selectFunction(this.index);
    };
    JMBUI_SelectButton.prototype.setSelectState = function (b) {
        if (b) {
            if (this.selectRect == null) {
                this.selectRect = new PIXI.Graphics;
                this.selectRect.lineStyle(3, 0xffff00);
                this.selectRect.drawRect(this.graphics.x, this.graphics.y, this.graphics.width, this.graphics.height);
            }
            this.addChild(this.selectRect);
        }
        else {
            if (this.selectRect != null && this.selectRect.parent != null)
                this.selectRect.parent.removeChild(this.selectRect);
        }
        this.selected = b;
    };
    return JMBUI_SelectButton;
}(JMBUI_Button));
var JMBUI_MaskedWindow = (function (_super) {
    __extends(JMBUI_MaskedWindow, _super);
    function JMBUI_MaskedWindow(options) {
        if (options === void 0) { options = null; }
        var _this = _super.call(this, options) || this;
        _this.mask = new PIXI.Graphics;
        _this.objects = [];
        _this.offsetY = 0;
        _this.goalY = 1;
        _this.scrollbar = null;
        _this.container = new PIXI.Sprite();
        _this.vY = 0;
        _this.sortMargin = 5;
        _this.dragging = false;
        _this.scrollHeight = 0;
        _this.addScrollbar = function (_scrollbar) {
            _this.scrollbar = _scrollbar;
            _scrollbar.output = _this.setScroll;
        };
        _this.onWheel = function (e) {
            var _point = facade.windowToLocal(e);
            if (_point.x > _this.x && _point.x < _this.x + _this.mask.width && _point.y > _this.y && _point.y < _this.y + _this.mask.height) {
                _this.vY -= e.deltaY * 0.008;
            }
        };
        _this.setScroll = function (p) {
            if (_this.scrollHeight > _this.mask.height) {
                _this.container.y = p * (_this.mask.height - _this.scrollHeight);
                if (_this.container.y > 0)
                    _this.container.y = 0;
                if (_this.container.y < _this.mask.height - _this.scrollHeight)
                    _this.container.y = _this.mask.height - _this.scrollHeight;
            }
            else {
                _this.container.y = 0;
            }
        };
        _this.getRatio = function () {
            return Math.min(1, _this.mask.height / _this.scrollHeight);
        };
        _this.update = function () {
            if (_this.goalY <= 0) {
                _this.vY = (_this.goalY - _this.container.y) / 4;
            }
            if (_this.vY != 0) {
                if (Math.abs(_this.vY) < 0.1)
                    _this.vY = 0;
                else {
                    var _y = _this.container.y + _this.vY;
                    _y = Math.min(0, Math.max(_y, _this.mask.height - _this.scrollHeight));
                    _this.vY *= 0.95;
                    if (_this.scrollbar != null)
                        _this.scrollbar.setPosition(_y / (_this.mask.height - _this.scrollHeight));
                    else
                        _this.setScroll(_y / (_this.mask.height - _this.scrollHeight));
                }
            }
        };
        _this.addObject = function (_object) {
            _this.objects.push(_object);
            _object.x -= _this.x - _this.container.x;
            _object.y -= _this.y - _this.container.y;
            _this.container.addChild(_object);
            if (_this.autoSort)
                _this.sortObjects();
        };
        _this.removeObject = function (_object) {
            for (var i = 0; i < _this.objects.length; i += 1) {
                if (_this.objects[i] == _object) {
                    _this.removeObjectAt(i);
                    return;
                }
            }
        };
        _this.removeObjectAt = function (i) {
            _this.container.removeChild(_this.objects[i]);
            _this.objects.splice(i, 1);
            if (_this.autoSort)
                _this.sortObjects();
        };
        _this.sortObjects = function () {
            _this.scrollHeight = _this.sortMargin;
            for (var i = 0; i < _this.objects.length; i += 1) {
                _this.objects[i].y = _this.scrollHeight;
                _this.objects[i].timeout = BoolPlus.Enabled;
                _this.objects[i].x = 0;
                _this.scrollHeight += _this.objects[i].graphics.height + _this.sortMargin;
            }
        };
        options = options || {};
        _this.addChild(_this.container);
        _this.addChild(_this.mask);
        _this.mask.beginFill(0);
        _this.mask.drawRect(0, 0, options.width || 50, options.height || 100);
        _this.autoSort = options.autoSort || false;
        _this.interactive = true;
        _this.sortMargin = options.sortMargin || 5;
        _this.addListener("pointerover", function (e) {
            facade.disableGameInput();
        });
        _this.addListener("pointerout", function (e) {
            facade.disableGameInput(false);
        });
        _this.addListener("pointerdown", function (e) {
            var _point = facade.windowToLocal(e.data.originalEvent);
            _this.offsetY = _point.y - _this.y - _this.container.y;
            _this.dragging = true;
        });
        window.addEventListener("pointerup", function (e) {
            _this.goalY = 1;
            _this.dragging = false;
        });
        JME.addEventListener(EventType.MOVE_EVENT, function (e) {
            if (_this.dragging) {
                var _y = e.mouse.y - _this.y - _this.offsetY;
                _this.goalY = e.mouse.y - _this.y - _this.offsetY;
                _this.vY = (_y - _this.container.y) / 4;
            }
        });
        JME.addToTicker(_this.update);
        window.addEventListener("wheel", _this.onWheel);
        return _this;
    }
    return JMBUI_MaskedWindow;
}(JMBUI_BasicElement));
var JMBUI_Gauge = (function (_super) {
    __extends(JMBUI_Gauge, _super);
    function JMBUI_Gauge(color, options) {
        if (color === void 0) { color = 0x00ff00; }
        if (options === void 0) { options = null; }
        var _this = _super.call(this, JMBL.applyDefaultOptions(options, {
            width: 100, height: 20, bgColor: 0x101010
        })) || this;
        _this.front = new PIXI.Graphics();
        _this.front.beginFill(color);
        _this.front.drawRect(_this.graphics.x, _this.graphics.y, _this.graphics.width, _this.graphics.height);
        _this.addChild(_this.front);
        return _this;
    }
    JMBUI_Gauge.prototype.setValue = function (value, max) {
        if (max === void 0) { max = -1; }
        if (max >= 1)
            this.max = max;
        this.value = value;
        this.percent = this.value / this.max;
        this.front.width = Math.floor(Math.max(1, Math.min(this.percent * this.graphics.width, this.graphics.width)));
    };
    JMBUI_Gauge.prototype.setMax = function (max) {
        if (max >= 1)
            this.max = max;
        this.percent = this.value / this.max;
        this.front.width = Math.floor(Math.max(1, Math.min(this.percent * this.graphics.width, this.graphics.width)));
    };
    return JMBUI_Gauge;
}(JMBUI_BasicElement));
var JMBUI_Scrollbar = (function (_super) {
    __extends(JMBUI_Scrollbar, _super);
    function JMBUI_Scrollbar(options) {
        var _this = _super.call(this, JMBL.applyDefaultOptions(options, {
            x: 100, y: 50, width: 10, height: 100, rounding: 5, bgColor: 0x404080,
        })) || this;
        _this.mover = new PIXI.Graphics();
        _this.topY = 0;
        _this.bottomY = 40;
        _this.offsetY = 0;
        _this.drawMover = function (p) {
            p = Math.min(1, Math.max(0, p));
            if (p >= 1)
                _this.visible = false;
            else
                _this.visible = true;
            _this.mover.clear();
            _this.mover.beginFill(_this.moverColor);
            _this.mover.drawRoundedRect(0, 0, _this.graphics.width, p * _this.graphics.height, _this.graphics.width / 2);
            _this.bottomY = _this.graphics.height - _this.mover.height;
        };
        _this.setPosition = function (p) {
            var _y = p * (_this.bottomY - _this.topY) + _this.topY;
            _this.mover.y = _y;
            if (_this.output != null)
                _this.output(p);
        };
        _this.getPosition = function () {
            return (_this.mover.y - _this.topY) / (_this.bottomY - _this.topY);
        };
        _this.startMove = function (e) {
            _this.offsetY = e.y - _this.y - _this.mover.y;
            _this.dragging = true;
        };
        _this.addChild(_this.mover);
        _this.output = options.output;
        _this.interactive = true;
        _this.buttonMode = true;
        _this.moverColor = options.moverColor || 0x333333;
        _this.ratio = options.ratio || 0.5;
        _this.drawMover(_this.ratio);
        _this.setPosition(options.position || 0);
        _this.addListener("pointerover", function (e) {
            facade.disableGameInput();
        });
        _this.addListener("pointerout", function (e) {
            facade.disableGameInput(false);
        });
        _this.addListener("pointerdown", function (e) {
            var _point = facade.windowToLocal(e.data.originalEvent);
            _this.offsetY = _point.y - _this.y - _this.mover.y;
            _this.dragging = true;
        });
        window.addEventListener("pointerup", function (e) {
            _this.dragging = false;
        });
        JME.addEventListener(EventType.MOVE_EVENT, function (e) {
            if (_this.dragging) {
                var _y = e.mouse.y - _this.y - _this.offsetY;
                _y = Math.max(_y, _this.topY);
                _y = Math.min(_y, _this.bottomY);
                _this.mover.y = _y;
                if (_this.output != null)
                    _this.output(_this.getPosition());
            }
        });
        return _this;
    }
    return JMBUI_Scrollbar;
}(JMBUI_BasicElement));
var BuildingType;
(function (BuildingType) {
    BuildingType[BuildingType["BASIC"] = 0] = "BASIC";
    BuildingType[BuildingType["NOVA"] = 1] = "NOVA";
    BuildingType[BuildingType["ICE"] = 2] = "ICE";
    BuildingType[BuildingType["POISON"] = 3] = "POISON";
    BuildingType[BuildingType["WALL"] = 4] = "WALL";
})(BuildingType || (BuildingType = {}));
var PriorityType;
(function (PriorityType) {
    PriorityType[PriorityType["FIRST"] = 0] = "FIRST";
    PriorityType[PriorityType["LAST"] = 1] = "LAST";
    PriorityType[PriorityType["CLOSEST"] = 2] = "CLOSEST";
    PriorityType[PriorityType["STRONGEST"] = 3] = "STRONGEST";
    PriorityType[PriorityType["WEAKEST"] = 4] = "WEAKEST";
    PriorityType[PriorityType["ANY"] = 5] = "ANY";
    PriorityType[PriorityType["NONE"] = 6] = "NONE";
})(PriorityType || (PriorityType = {}));
var WalkingType;
(function (WalkingType) {
    WalkingType[WalkingType["RUNNER"] = 0] = "RUNNER";
    WalkingType[WalkingType["FLYER"] = 1] = "FLYER";
})(WalkingType || (WalkingType = {}));
var BuildingData = (function () {
    function BuildingData() {
        this.BASIC = { name: "Basic", texture: TextureData.mediumCircle, tint: 0x0000cc, speed: 4, cooldown: 50, range: 100, damage: 5, effects: [], goa: TwoOptions.Both };
    }
    return BuildingData;
}());
var InteractionMode;
(function (InteractionMode) {
    InteractionMode[InteractionMode["SELECT"] = 0] = "SELECT";
    InteractionMode[InteractionMode["SELL"] = 1] = "SELL";
    InteractionMode[InteractionMode["WALL"] = 2] = "WALL";
    InteractionMode[InteractionMode["TURRET"] = 3] = "TURRET";
    InteractionMode[InteractionMode["NOVA"] = 4] = "NOVA";
    InteractionMode[InteractionMode["ICE"] = 5] = "ICE";
    InteractionMode[InteractionMode["POISON"] = 6] = "POISON";
})(InteractionMode || (InteractionMode = {}));
var GameManager = (function () {
    function GameManager(_app) {
        var _this = this;
        this.gameStage = new PIXI.Container();
        this.objectView = new PIXI.Container();
        this.interactionMode = 0;
        this.running = true;
        this.spawnMax = 60;
        this.spawnTick = -1;
        this.numTicks = 0;
        this.keyStates = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.onTick = function () {
            if (_this.running) {
                _this.objects.updateAll();
                var self_1 = _this;
                _this.objects.forEach(function () {
                    if (this.type == ObjectType.WALKING) {
                        var _object = this;
                        if (_object.currentTile != null && _object.currentTile.rating == 0) {
                            _object.toRemove = true;
                        }
                        if (_object.currentTile == null) {
                            _object.currentTile = self_1.tilemap.getTileAt(_object.goal);
                        }
                    }
                    else if (this.type == ObjectType.BUILDING) {
                        this.activate(self_1.objects);
                    }
                    else if (this.type == ObjectType.PROJECTILE) {
                    }
                });
                _this.spawnTick -= 1;
                if (_this.spawnTick < 0) {
                    _this.spawnTick = _this.spawnMax;
                    _this.onSpawn();
                }
                var _children = _this.objectView.children;
                _children.sort(function (a, b) {
                    if (a.type == ObjectType.BUILDING) {
                        if (b.type == ObjectType.BUILDING) {
                            if (a.selected)
                                return 1;
                            if (b.selected)
                                return -1;
                            if (a.y < b.y)
                                return -1;
                            if (b.y < a.y)
                                return 1;
                            return 0;
                        }
                        return -1;
                    }
                    else if (b.type == ObjectType.BUILDING)
                        return 1;
                    if (a.type == ObjectType.PROJECTILE) {
                        if (b.type == ObjectType.PROJECTILE)
                            return 0;
                        return -1;
                    }
                    else if (b.type == ObjectType.PROJECTILE) {
                        return 1;
                    }
                    if (a.y < b.y)
                        return -1;
                    if (b.y < a.y)
                        return 1;
                    return 0;
                });
            }
            _this.navigation();
        };
        this.canSpawn = true;
        this.onKeyDown = function (e) {
            if (e.isNumber()) {
                _this.gameUI.selectButtonAt(Number(e.key) - 1);
            }
            else {
                switch (e.key) {
                    case " ":
                        _this.running = !_this.running;
                        break;
                    case "ArrowLeft":
                    case "a":
                        _this.keyStates.left = true;
                        break;
                    case "ArrowRight":
                    case "d":
                        _this.keyStates.right = true;
                        break;
                    case "ArrowUp":
                    case "w":
                        _this.keyStates.up = true;
                        break;
                    case "ArrowDown":
                    case "s":
                        _this.keyStates.down = true;
                        break;
                    case "b":
                        _this.running = true;
                        _this.onTick();
                        _this.running = false;
                        break;
                    case "v":
                        _this.canSpawn = !_this.canSpawn;
                        break;
                }
            }
        };
        this.onKeyUp = function (e) {
            switch (e.key) {
                case "ArrowLeft":
                case "a":
                    _this.keyStates.left = false;
                    break;
                case "ArrowRight":
                case "d":
                    _this.keyStates.right = false;
                    break;
                case "ArrowUp":
                case "w":
                    _this.keyStates.up = false;
                    break;
                case "ArrowDown":
                case "s":
                    _this.keyStates.down = false;
                    break;
            }
        };
        this.onClick = function (e) {
            var _point = new PIXI.Point(e.mouse.x - _this.gameStage.x, e.mouse.y - _this.gameStage.y);
            if (_this.tilemap.bounds.contains(_point.x, _point.y)) {
                var _building = void 0;
                var _tile = _this.tilemap.getTileAt(_point);
                switch (_this.interactionMode) {
                    case InteractionMode.SELECT:
                        _building = _this.tilemap.getBuildingAt(_tile.index);
                        if (_building != null) {
                            _this.selectObject(_building);
                        }
                        else {
                            var _walking = _this.objects.getClosestObject(_point, 30, { has: { type: ObjectType.WALKING } });
                            _this.selectObject(_walking);
                        }
                        break;
                    case InteractionMode.SELL:
                        _this.selectObject();
                        _building = _this.tilemap.removeBuildingAt(_tile.index);
                        if (_building != null) {
                            _this.objects.removeObject(_building);
                            _this.refreshAllWalkers();
                        }
                        break;
                    case InteractionMode.WALL:
                        _building = _this.tilemap.getBuildingAt(_tile.index);
                        if (_building == null) {
                            _this.tryBuildObject(new WallBuilding(_tile), _tile);
                        }
                        break;
                    case InteractionMode.TURRET:
                        _building = _this.tilemap.getBuildingAt(_tile.index);
                        if (_building == null) {
                            _this.tryBuildObject(new BuildingObject(_tile), _tile);
                        }
                        break;
                    case InteractionMode.NOVA:
                        _building = _this.tilemap.getBuildingAt(_tile.index);
                        if (_building == null) {
                            _this.tryBuildObject(new NovaBuilding(_tile), _tile);
                        }
                        break;
                    case InteractionMode.ICE:
                        _building = _this.tilemap.getBuildingAt(_tile.index);
                        if (_building == null) {
                            _this.tryBuildObject(new IceBuilding(_tile), _tile);
                        }
                        break;
                    case InteractionMode.POISON:
                        _building = _this.tilemap.getBuildingAt(_tile.index);
                        if (_building == null) {
                            _this.tryBuildObject(new PoisonBuilding(_tile), _tile);
                        }
                        break;
                }
            }
            else {
                if (e.mouse.drag != null) {
                }
                else {
                }
            }
        };
        this.scroller = {
            mouse: null,
            x: 0,
            y: 0,
            vX: 0,
            vY: 0
        };
        this.navigation = function () {
            if (_this.scroller.mouse != null) {
                if (!_this.scroller.mouse.down) {
                    _this.scroller.mouse = null;
                }
                else {
                    _this.scroller.vX = (_this.scroller.mouse.x - _this.scroller.x - _this.gameStage.x) / 15;
                    _this.scroller.vY = (_this.scroller.mouse.y - _this.scroller.y - _this.gameStage.y) / 15;
                }
            }
            else {
                if (_this.keyStates.left)
                    _this.scroller.vX += 1;
                if (_this.keyStates.right)
                    _this.scroller.vX -= 1;
                if (_this.keyStates.up)
                    _this.scroller.vY += 1;
                if (_this.keyStates.down)
                    _this.scroller.vY -= 1;
            }
            if (_this.scroller.vX != 0 || _this.scroller.vY != 0) {
                _this.gameStage.x += _this.scroller.vX;
                _this.gameStage.y += _this.scroller.vY;
                _this.scroller.vX *= 0.95;
                _this.scroller.vY *= 0.95;
                if (Math.abs(_this.scroller.vY) < 0.001 && Math.abs(_this.scroller.vX) < 0.001) {
                    _this.scroller.vX = 0;
                    _this.scroller.vY = 0;
                }
            }
            if (_this.gameStage.x < _this.playRect.right - _this.tilemap.bounds.width)
                _this.gameStage.x = _this.playRect.right - _this.tilemap.bounds.width;
            if (_this.gameStage.x > _this.playRect.x)
                _this.gameStage.x = _this.playRect.x;
            if (_this.gameStage.y < _this.playRect.bottom - _this.tilemap.bounds.height)
                _this.gameStage.y = _this.playRect.bottom - _this.tilemap.bounds.height;
            if (_this.gameStage.y > _this.playRect.y)
                _this.gameStage.y = _this.playRect.y;
        };
        this.app = _app;
        this.app.stage.addChild(this.gameStage);
        this.gameStage.addChild(this.objectView);
        this.objects = new ObjectManager(this.objectView);
        JME.addToTicker(this.onTick);
        JME.addEventListener(EventType.MOVE_EVENT, this.onMouseMove);
        JME.addEventListener(EventType.CLICK_EVENT, this.onClick);
        JME.addEventListener(EventType.DRAG_EVENT, this.onDrag);
        this.tilemap = new JMTileMap({ tilesAcross: 20, tilesDown: 14, tileSize: 30 });
        this.tilemap.loadWalkMap("00000000000000000000" +
            "suuuuuuuuuuuuuu00000" +
            "000p000000000pup0000" +
            "0000000p00000pup0000" +
            "000000uuuuuuuuu00000" +
            "00000pup00p000000000" +
            "000000uuuuuu00000uue" +
            "0000000000pup0000up0" +
            "00000000p0pu00000u00" +
            "00000000000u00000u00" +
            "00000000000u00p00up0" +
            "00000000000uuuuuuu00" +
            "00000000000000p0p000" +
            "00000000000000000000");
        this.gameStage.addChildAt(this.tilemap, 0);
        this.gameUI = new GameUI;
        this.gameUI.addSelections([["Select", InteractionMode.SELECT], ["Sell", InteractionMode.SELL], ["Wall", InteractionMode.WALL], ["Turret", InteractionMode.TURRET], ["Nova", InteractionMode.NOVA], ["Ice", InteractionMode.ICE], ["Poison", InteractionMode.POISON]], function (i) { _this.interactionMode = i; });
        this.gameUI.selectButtonAt(0);
        this.app.stage.addChild(this.gameUI);
        JME.addEventListener(EventType.KEY_DOWN, this.onKeyDown);
        JME.addEventListener(EventType.KEY_UP, this.onKeyUp);
        this.playRect = this.gameUI.getPlayArea();
        this.gameStage.y = this.playRect.y;
    }
    GameManager.prototype.clearGame = function () {
    };
    GameManager.prototype.loadGame = function (_levelData) {
    };
    GameManager.prototype.onSpawn = function () {
        if (!this.canSpawn)
            return;
        var i = Math.floor(Math.random() * this.tilemap.spawns.length);
        var _sprite;
        if (Math.random() < 0.7)
            _sprite = new WalkingObject(this.tilemap.spawns[i]);
        else
            _sprite = new FlyingObject(this.tilemap.spawns[i]);
        _sprite.goto((this.tilemap.spawns[i].loc.x + 0.5) * this.tilemap.tileSize, (this.tilemap.spawns[i].loc.y + 0.5) * this.tilemap.tileSize);
        this.objects.addObject(_sprite);
    };
    GameManager.prototype.onMouseMove = function (e) {
        var _drag = e.mouse.drag;
        if (_drag != null && !e.mouse.timerRunning) {
            _drag.tweenTo(e.mouse.x, e.mouse.y);
        }
    };
    GameManager.prototype.selectObject = function (v) {
        if (v === void 0) { v = null; }
        if (this.selected != null)
            this.selected.clearSelect();
        this.selected = null;
        if (v != null) {
            this.selected = v;
            this.selected.onSelect();
            this.gameUI.showProperties(v);
        }
        else {
            this.gameUI.hideProperties();
        }
    };
    GameManager.prototype.refreshAllWalkers = function () {
        this.objects.forEach(function () {
            if (this.type == ObjectType.WALKING) {
                this.nextTile = null;
            }
        });
    };
    GameManager.prototype.tryBuildObject = function (_building, _tile) {
        if (this.tilemap.addBuildingAt(_building, _tile.index)) {
            this.objects.addObject(_building);
            this.objects.forEach(function () {
                if (this.type == ObjectType.WALKING) {
                    this.nextTile = null;
                }
            });
            this.selectObject(_building);
        }
        else {
            this.selectObject();
        }
    };
    GameManager.prototype.onDrag = function (e) {
        facade.game.onMouseMove(e);
    };
    GameManager.prototype.startDrag = function () {
    };
    GameManager.prototype.endDrag = function () {
    };
    GameManager.prototype.clearSelection = function () {
    };
    return GameManager;
}());
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["SECOND"] = 1] = "SECOND";
    ObjectType[ObjectType["BUILDING"] = 2] = "BUILDING";
    ObjectType[ObjectType["WALKING"] = 3] = "WALKING";
    ObjectType[ObjectType["PROJECTILE"] = 4] = "PROJECTILE";
})(ObjectType || (ObjectType = {}));
var GameUI = (function (_super) {
    __extends(GameUI, _super);
    function GameUI() {
        var _this = _super.call(this) || this;
        _this.selectButtons = [];
        _this.bottomBar = new JMBUI_BasicElement({ x: 0, y: facade.stageBorders.height - 60, width: facade.stageBorders.width - 150, height: 60, bgColor: 0xcccccc });
        _this.topBar = new JMBUI_BasicElement({ x: 0, y: 0, width: facade.stageBorders.width - 150, height: 15, bgColor: 0xcccccc, alpha: 0.5 });
        _this.rightPanel = new JMBUI_BasicElement({ x: facade.stageBorders.width - 150, y: 0, width: 150, height: facade.stageBorders.height, bgColor: 0xaaaaaa });
        _this.addChild(_this.bottomBar);
        _this.addChild(_this.topBar);
        _this.addChild(_this.rightPanel);
        return _this;
    }
    GameUI.prototype.getPlayArea = function () {
        return new JMBL_Rect(0, this.topBar.graphics.height, this.rightPanel.x, this.bottomBar.y - this.topBar.graphics.height);
    };
    GameUI.prototype.addSelections = function (indexes, output) {
        this.clearSelections();
        this.selectionOutput = output;
        for (var i = 0; i < indexes.length; i += 1) {
            var _button = new JMBUI_SelectButton(indexes[i][1], this.selectButtons, this.selectionOutput, { x: 20 + i * 60, y: 10, width: 50, height: 40, label: indexes[i][0] });
            this.bottomBar.addChild(_button);
            this.selectButtons.push(_button);
        }
    };
    GameUI.prototype.addSelection = function (name, index) {
        var _button = new JMBUI_SelectButton(index, this.selectButtons, this.selectionOutput, { x: 20 + this.selectButtons.length * 60, y: 10, width: 50, height: 40, label: name });
        this.bottomBar.addChild(_button);
        this.selectButtons.push(_button);
    };
    GameUI.prototype.clearSelections = function () {
        this.selectionOutput = null;
        while (this.selectButtons.length > 0) {
            if (this.selectButtons[0].parent != null)
                this.selectButtons[0].parent.removeChild(this.selectButtons[0]);
            this.selectButtons.shift().destroy();
        }
    };
    GameUI.prototype.selectButtonAt = function (i) {
        if (i >= this.selectButtons.length)
            return;
        if (this.selectButtons[i] == null)
            return;
        this.selectButtons[i].selectThis();
    };
    GameUI.prototype.showProperties = function (v) {
        this.hideProperties();
        this.properties = new PropertiesPanel(v);
        this.rightPanel.addChild(this.properties);
    };
    GameUI.prototype.hideProperties = function () {
        if (this.properties != null) {
            this.properties.parent.removeChild(this.properties);
            this.properties = null;
        }
    };
    return GameUI;
}(PIXI.Sprite));
var PropertiesPanel = (function (_super) {
    __extends(PropertiesPanel, _super);
    function PropertiesPanel(v) {
        var _this = _super.call(this, { x: 5, y: 100, width: 140, height: 300, bgColor: 0x666666, rounding: 10 }) || this;
        _this.priorityButtons = [];
        _this.target = v;
        if (v.type == ObjectType.BUILDING) {
            _this.showBuildingProperties(v);
        }
        else if (v.type == ObjectType.WALKING) {
            _this.showWalkingProperties(v);
        }
        return _this;
    }
    PropertiesPanel.prototype.showBuildingProperties = function (_building) {
        var _title = new PIXI.Text(BuildingObject.nameFromType(_building.subtype), PropertiesPanel.TitleStyle);
        _title.x = this.graphics.width / 2 - _title.width / 2;
        _title.y = 5;
        this.addChild(_title);
        var _propertiesText = "";
        if (_building.priority != PriorityType.NONE) {
            _propertiesText += "Range: " + facade.pixelToTile(_building.range) + "\n";
            _propertiesText += "APS: " + facade.toPS(_building.maxCooldown) + "\n";
            if (_building.damage > 0) {
                _propertiesText += "Damage " + _building.damage + "\n";
            }
            if (_building.effects.length > 0) {
                for (var i = 0; i < _building.effects.length; i += 1) {
                    _propertiesText += _building.effects[i].getDescription() + "\n";
                }
            }
            if (_building.goa == TwoOptions.One)
                _propertiesText += "GROUND ONLY\n";
            else if (_building.goa == TwoOptions.Two)
                _propertiesText += "AIR ONLY\n";
        }
        var _properties = new PIXI.Text(_propertiesText, PropertiesPanel.ListStyle);
        _properties.x = 5;
        _properties.y = 55;
        this.addChild(_properties);
        if (_building.priority == PriorityType.ANY) {
            var _button = new JMBUI_SelectButton(PriorityType.ANY, this.priorityButtons, _building.setPriority, { x: 5, y: 30, width: 25, height: 15, label: "Any" });
            this.priorityButtons.push(_button);
            this.addChild(_button);
            _button.selectThis();
        }
        else if (_building.priority != PriorityType.NONE) {
            var _button = new JMBUI_SelectButton(PriorityType.STRONGEST, this.priorityButtons, _building.setPriority, { x: 5, y: 30, width: 25, height: 15, label: "Strong" });
            this.priorityButtons.push(_button);
            this.addChild(_button);
            _button = new JMBUI_SelectButton(PriorityType.WEAKEST, this.priorityButtons, _building.setPriority, { x: 31, y: 30, width: 25, height: 15, label: "Weak" });
            this.priorityButtons.push(_button);
            this.addChild(_button);
            _button = new JMBUI_SelectButton(PriorityType.FIRST, this.priorityButtons, _building.setPriority, { x: 57, y: 30, width: 25, height: 15, label: "First" });
            this.priorityButtons.push(_button);
            this.addChild(_button);
            _button = new JMBUI_SelectButton(PriorityType.LAST, this.priorityButtons, _building.setPriority, { x: 83, y: 30, width: 25, height: 15, label: "Last" });
            this.priorityButtons.push(_button);
            this.addChild(_button);
            _button = new JMBUI_SelectButton(PriorityType.CLOSEST, this.priorityButtons, _building.setPriority, { x: 109, y: 30, width: 25, height: 15, label: "Closest" });
            this.priorityButtons.push(_button);
            this.addChild(_button);
            for (var i = 0; i < this.priorityButtons.length; i += 1) {
                if (this.priorityButtons[i].index == _building.priority) {
                    this.priorityButtons[i].selectThis();
                    break;
                }
            }
        }
    };
    PropertiesPanel.prototype.showWalkingProperties = function (_walking) {
        var _title = new PIXI.Text(WalkingObject.nameFromType(_walking.subtype), PropertiesPanel.TitleStyle);
        _title.x = this.graphics.width / 2 - _title.width / 2;
        _title.y = 5;
        this.addChild(_title);
        var _propertiesText = "";
        _propertiesText += "Max Health: " + _walking.maxHealth + "\n";
        _propertiesText += "Move Speed: " + facade.toTPS(_walking.speed) + "\n";
        var _properties = new PIXI.Text(_propertiesText, PropertiesPanel.ListStyle);
        _properties.x = 5;
        _properties.y = 55;
        this.addChild(_properties);
    };
    PropertiesPanel.TitleStyle = { fontSize: 20, fontWeight: "bold" };
    PropertiesPanel.ListStyle = { fontSize: 12 };
    return PropertiesPanel;
}(JMBUI_BasicElement));
var TextureData = (function () {
    function TextureData() {
    }
    TextureData.init = function (_renderer) {
        var _graphic = new PIXI.Graphics;
        _graphic.beginFill(0xffffff);
        _graphic.drawCircle(-25, -25, 25);
        this.circle = _renderer.generateTexture(_graphic);
        _graphic = new PIXI.Graphics;
        _graphic.beginFill(0xffffff);
        _graphic.drawCircle(-5, -5, 5);
        this.smallCircle = _renderer.generateTexture(_graphic);
        _graphic = new PIXI.Graphics;
        _graphic.beginFill(0, 0.3);
        _graphic.drawEllipse(0, 0, 5, 2);
        this.genericShadow = _renderer.generateTexture(_graphic);
        _graphic = new PIXI.Graphics;
        _graphic.beginFill(0xffffff, 0.5);
        _graphic.lineStyle(2, 0xffffff, 0.7);
        _graphic.drawCircle(0, 0, 25);
        this.clearCircle = _renderer.generateTexture(_graphic);
        _graphic = new PIXI.Graphics;
        _graphic.beginFill(0xffffff);
        _graphic.drawRect(0, 0, 28, 28);
        _graphic.beginFill(0x333333);
        _graphic.drawCircle(14, 14, 14);
        _graphic.beginFill(0xffffff);
        _graphic.drawCircle(14, 14, 7);
        this.mediumCircle = _renderer.generateTexture(_graphic);
        _graphic = new PIXI.Graphics;
        _graphic.beginFill(0xffffff);
        _graphic.drawRect(0, 0, 28, 28);
        _graphic.endFill();
        _graphic.lineStyle(5, 0x333333);
        _graphic.moveTo(2, 2);
        _graphic.lineTo(26, 26);
        _graphic.moveTo(26, 2);
        _graphic.lineTo(2, 26);
        this.wall = _renderer.generateTexture(_graphic);
        _graphic = new PIXI.Graphics;
        _graphic.beginFill(0xffffff);
        _graphic.drawRect(0, 0, 28, 28);
        _graphic.endFill();
        _graphic.lineStyle(5, 0x333333);
        _graphic.moveTo(13, 2);
        _graphic.lineTo(26, 13);
        _graphic.lineTo(13, 26);
        _graphic.lineTo(2, 13);
        _graphic.lineTo(13, 2);
        this.nova = _renderer.generateTexture(_graphic);
        _graphic.clear();
        _graphic.beginFill(0xffffff);
        _graphic.drawRect(0, 0, 30, 30);
        this.square = _renderer.generateTexture(_graphic);
        _graphic.clear();
        _graphic.beginFill(0xffffff);
        _graphic.drawCircle(0, 0, 2);
        this.bullet = _renderer.generateTexture(_graphic);
        _graphic.clear();
        _graphic.beginFill(0xffffff);
        _graphic.drawCircle(0, 0, 5);
        this.firework = _renderer.generateTexture(_graphic);
    };
    return TextureData;
}());
var CONFIG = (function () {
    function CONFIG() {
    }
    CONFIG.INIT = {
        STAGE_WIDTH: 800,
        STAGE_HEIGHT: 500,
        RESOLUTION: 2,
        BACKGROUND_COLOR: 0,
        MOUSE_HOLD: 200,
    };
    return CONFIG;
}());
var Facade = (function () {
    function Facade() {
        var _this = this;
        this.interactionMode = "desktop";
        this._Resolution = CONFIG.INIT.RESOLUTION;
        this.windowToLocal = function (e) {
            return new PIXI.Point((e.x + _this.stageBorders.x) * _this._Resolution, (e.y + _this.stageBorders.y) * _this._Resolution);
        };
        if (Facade.exists)
            throw "Cannot instatiate more than one Facade Singleton.";
        Facade.exists = true;
        try {
            document.createEvent("TouchEvent");
            this.interactionMode = "mobile";
        }
        catch (e) {
        }
        this.stageBorders = new JMBL_Rect(0, 0, CONFIG.INIT.STAGE_WIDTH / this._Resolution, CONFIG.INIT.STAGE_HEIGHT / this._Resolution);
        this.app = new PIXI.Application(this.stageBorders.width, this.stageBorders.height, {
            backgroundColor: 0xff0000,
            antialias: true,
            resolution: this._Resolution,
            roundPixels: true,
        });
        document.getElementById("game-canvas").append(this.app.view);
        this.stageBorders.width *= this._Resolution;
        this.stageBorders.height *= this._Resolution;
        this.app.stage.scale.x = 1 / this._Resolution;
        this.app.stage.scale.y = 1 / this._Resolution;
        this.stageBorders.x = this.app.view.offsetLeft;
        this.stageBorders.y = this.app.view.offsetTop;
        this.app.stage.interactive = true;
        var _background = new PIXI.Graphics();
        _background.beginFill(CONFIG.INIT.BACKGROUND_COLOR);
        _background.drawRect(0, 0, this.stageBorders.width, this.stageBorders.height);
        this.app.stage.addChild(_background);
        var self = this;
        TextureData.init(this.app.renderer);
        window.setTimeout(function () { self.init(); }, 10);
    }
    Facade.prototype.disableGameInput = function (b) {
        if (b === void 0) { b = true; }
        if (b) {
            this.inputM.mouseEnabled = false;
        }
        else {
            this.inputM.mouseEnabled = true;
        }
    };
    Facade.prototype.init = function () {
        JME.init(this.app.ticker);
        this.game = new GameManager(this.app);
        this.inputM = new InputManager(this.app, this.game.objects);
    };
    Facade.prototype.toPS = function (n) {
        return Math.floor(600 / n) / 10;
    };
    Facade.prototype.toDur = function (n) {
        return Math.floor(n / 6) / 10;
    };
    Facade.prototype.pixelToTile = function (n, minusHalf) {
        if (minusHalf === void 0) { minusHalf = true; }
        return Math.floor(n / 3 - (minusHalf ? 5 : 0)) / 10;
    };
    Facade.prototype.toTPS = function (n) {
        console.log(n);
        return Math.floor(n * 60 * 30 * 10) / 10;
    };
    Facade.exists = false;
    return Facade;
}());
var facade;
function initialize_game() {
    facade = new Facade();
}
var InputManager = (function () {
    function InputManager(app, objects) {
        this.mouseEnabled = true;
        var self = this;
        this.mouse = new MouseObject();
        this.app = app;
        this.objects = objects;
        window.addEventListener("keydown", function (e) { self.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { self.onKeyUp(e); });
        app.stage.on("pointerdown", function (e) { self.onMouseDown(e); });
        app.stage.on("pointermove", function (e) { self.onMouseMove(e); });
        window.addEventListener("wheel", function (e) { self.onWheel(e); });
        if (facade.interactionMode == "desktop") {
            window.addEventListener("pointerup", function (e) { self.onMouseUp(e); });
        }
        else {
            window.addEventListener("touchend", function (e) { self.onMouseUp(e); });
        }
    }
    InputManager.prototype.onWheel = function (e) {
        var _object = this.objects.getClosestObject(this.mouse, 0);
        if (_object != null && _object.onWheel != null) {
            _object.onWheel(e.deltaY);
        }
    };
    InputManager.prototype.onMouseDown = function (e) {
        var _mouse = this.mouse;
        _mouse.set(e.data.global.x / this.app.stage.scale.x, e.data.global.y / this.app.stage.scale.y);
        _mouse.down = true;
        if (!this.mouseEnabled)
            return;
        if (_mouse.timerRunning)
            return;
        _mouse.drag = this.objects.getClosestObject(_mouse, 0, { has: { draggable: true } });
        if (_mouse.drag != null) {
            _mouse.timerRunning = true;
            if (_mouse.drag.clickable) {
                setTimeout(function () {
                    _mouse.timerRunning = false;
                    if (_mouse.drag != null) {
                        _mouse.drag.dragging = true;
                        if (_mouse.drag.draggable)
                            JME.publishEvent(EventType.DRAG_EVENT, new JME_DragEvent(_mouse.clone(), true));
                    }
                }, CONFIG.INIT.MOUSE_HOLD);
            }
            else if (_mouse.drag.draggable) {
                _mouse.drag.dragging = true;
                JME.publishEvent(EventType.DRAG_EVENT, new JME_DragEvent(_mouse.clone(), true));
            }
        }
        else {
            _mouse.timerRunning = true;
            setTimeout(function () {
                _mouse.timerRunning = false;
            }, CONFIG.INIT.MOUSE_HOLD);
        }
    };
    InputManager.prototype.onMouseUp = function (e) {
        var _mouse = this.mouse;
        _mouse.down = false;
        if (_mouse.drag != null) {
            if (!_mouse.timerRunning) {
                _mouse.dragTarget = this.objects.getClosestObject(_mouse, 0, { notThis: _mouse.drag });
                _mouse.drag.dragging = false;
                if (_mouse.drag.draggable)
                    JME.publishEvent(EventType.DRAG_EVENT, new JME_DragEvent(_mouse.clone(), false));
            }
            else {
                if (_mouse.drag.clickable)
                    JME.publishEvent(EventType.CLICK_EVENT, new JME_ClickEvent(_mouse.clone()));
            }
        }
        else {
            if (_mouse.timerRunning) {
                JME.publishEvent(EventType.CLICK_EVENT, new JME_ClickEvent(_mouse.clone()));
            }
        }
        _mouse.drag = null;
        _mouse.dragTarget = null;
    };
    InputManager.prototype.onMouseMove = function (e) {
        this.mouse.set(e.data.global.x / this.app.stage.scale.x, e.data.global.y / this.app.stage.scale.y);
        JME.publishEvent(EventType.MOVE_EVENT, new JME_MoveEvent(this.mouse));
    };
    InputManager.prototype.onKeyDown = function (e) {
        switch (e.key) {
            case "a":
            case "A": break;
            case "Control":
                this.mouse.ctrlKey = true;
                break;
        }
        JME.publishEvent(EventType.KEY_DOWN, new JME_KeyEvent(e.key));
    };
    InputManager.prototype.onKeyUp = function (e) {
        switch (e.key) {
            case "Control":
                this.mouse.ctrlKey = false;
                break;
        }
        JME.publishEvent(EventType.KEY_UP, new JME_KeyEvent(e.key));
    };
    return InputManager;
}());
var MouseObject = (function (_super) {
    __extends(MouseObject, _super);
    function MouseObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.down = false;
        _this.ctrlKey = false;
        _this.timerRunning = false;
        return _this;
    }
    MouseObject.prototype.clone = function () {
        var m = new MouseObject();
        m.down = this.down;
        m.drag = this.drag;
        m.dragTarget = this.dragTarget;
        m.timerRunning = this.timerRunning;
        m.x = this.x;
        m.y = this.y;
        m.ctrlKey = this.ctrlKey;
        return m;
    };
    return MouseObject;
}(PIXI.Point));
var TwoOptions;
(function (TwoOptions) {
    TwoOptions[TwoOptions["One"] = 0] = "One";
    TwoOptions[TwoOptions["Two"] = 1] = "Two";
    TwoOptions[TwoOptions["Both"] = 2] = "Both";
})(TwoOptions || (TwoOptions = {}));
var JMBL = (function () {
    function JMBL() {
    }
    JMBL.shallowClone = function (obj) {
        var m = {};
        for (var v in obj) {
            m[v] = obj[v];
        }
        return m;
    };
    JMBL.deepClone = function (obj) {
        if (Array.isArray(obj)) {
            var m = [];
            for (var i = 0; i < obj.length; i += 1) {
                m.push(this.deepClone(obj[i]));
            }
            return m;
        }
        else if (obj === Object(obj)) {
            var m = {};
            for (var v in obj) {
                m[v] = this.deepClone(obj[v]);
            }
            return m;
        }
        return obj;
    };
    JMBL.applyDefaultOptions = function (supplied, defaultOptions) {
        supplied = supplied || {};
        for (var v in defaultOptions) {
            supplied[v] = supplied[v] || defaultOptions[v];
        }
        return supplied;
    };
    JMBL.removeFromArray = function (_element, _array) {
        for (var i = 0; i < _array.length; i += 1) {
            if (_array[i] === _element) {
                _array.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    JMBL.tweenWait = function (_obj, _maxTicks, _function) {
        if (_function === void 0) { _function = null; }
        var ticks = 0;
        function _tickThis() {
            ticks += 1;
            if (ticks > _maxTicks) {
                JME.removeFromTicker(_tickThis);
                if (_function != null)
                    _function.call(_obj);
            }
        }
        JME.addToTicker(_tickThis);
    };
    JMBL.tweenTo = function (_obj, maxTicks, par, _function) {
        if (_function === void 0) { _function = null; }
        if (par == null)
            return;
        var properties = {};
        var ticks = 0;
        for (var v in par) {
            if (v == "delay") {
                ticks = -par[v];
            }
            else {
                properties[v] = { start: _obj[v], end: par[v] };
            }
        }
        function _tickThis() {
            ticks += 1;
            if (ticks > maxTicks) {
                JME.removeFromTicker(_tickThis);
                if (_function != null)
                    _function.call(_obj);
            }
            else if (ticks >= 0) {
                for (var v in properties) {
                    _obj[v] = properties[v].start + (properties[v].end - properties[v].start) / maxTicks * ticks;
                }
            }
        }
        JME.addToTicker(_tickThis);
    };
    JMBL.tweenFrom = function (_obj, maxTicks, par, _function) {
        if (_function === void 0) { _function = null; }
        if (par == null)
            return;
        var newPar = {};
        for (var v in par) {
            if (v == "delay") {
                newPar[v] = par[v];
            }
            else {
                newPar[v] = _obj[v];
                _obj[v] = par[v];
            }
        }
        JMBL.tweenTo(_obj, maxTicks, newPar, _function);
    };
    JMBL.tweenColor = function (_obj, maxTicks, par, _function) {
        if (_function === void 0) { _function = null; }
        if (par == null)
            return;
        var properties = {};
        var ticks = 0;
        for (var v in par) {
            if (v == "delay") {
                ticks = -par[v];
            }
            else {
                properties[v] = { start: _obj[v], end: par[v],
                    incR: Math.floor(par[v] / 0x010000) - Math.floor(_obj[v] / 0x010000),
                    incG: Math.floor((par[v] % 0x010000) / 0x000100) - Math.floor((_obj[v] % 0x010000) / 0x000100),
                    incB: Math.floor(par[v] % 0x000100) - Math.floor(_obj[v] % 0x000100),
                };
            }
        }
        function _tickThis() {
            ticks += 1;
            if (ticks > maxTicks) {
                JME.removeFromTicker(_tickThis);
                if (_function != null)
                    _function.call(_obj);
            }
            else if (ticks >= 0) {
                for (var v in properties) {
                    _obj[v] = properties[v].start + Math.floor(properties[v].incR / maxTicks * ticks) * 0x010000 + Math.floor(properties[v].incG / maxTicks * ticks) * 0x000100 + Math.floor(properties[v].incB / maxTicks * ticks);
                }
            }
        }
        JME.addToTicker(_tickThis);
    };
    return JMBL;
}());
var JMBL_Rect = (function (_super) {
    __extends(JMBL_Rect, _super);
    function JMBL_Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JMBL_Rect.prototype.setLeft = function (n) {
        this.width += this.x - n;
        this.x = n;
    };
    JMBL_Rect.prototype.setRight = function (n) {
        this.width += n - this.right;
    };
    JMBL_Rect.prototype.setTop = function (n) {
        this.height -= n - this.y;
        this.y = n;
    };
    JMBL_Rect.prototype.setBot = function (n) {
        this.height += n - this.top;
    };
    return JMBL_Rect;
}(PIXI.Rectangle));
var JMFirework = (function () {
    function JMFirework(options) {
        if (options === void 0) { options = null; }
        if (!JMFirework.initialized)
            JMFirework.initialize();
        options = options || {};
        options.x = options.x || 0;
        options.y = options.y || 0;
        options.color = options.color || 0xffffff;
        options.gravity = options.gravity || JMFirework.GRAVITY;
        options.fade = options.fade || JMFirework.FADE;
        options.startVX = options.startVX || JMFirework.START_V_X;
        options.startVY = options.startVY || JMFirework.START_V_Y;
        options.numParts = options.numParts || JMFirework.NUM_PARTS;
        options.size = options.size || JMFirework.SIZE;
        options.addTo = options.addTo || facade.app.stage;
        for (var i = 0; i < options.numParts; i += 1) {
            new JMFireworkParticle(options);
        }
    }
    JMFirework.initialize = function () {
        if (!this.initialized) {
            JME.addToTicker(this.onTick.bind(this));
            this.initialized = true;
        }
    };
    JMFirework.onTick = function () {
        for (var i = 0; i < this.particles.length; i += 1) {
            this.particles[i].update();
            if (this.particles[i].alpha < 0.1) {
                this.particles[i].destroy();
                this.particles.splice(i, 1);
                i -= 1;
            }
        }
    };
    JMFirework.GRAVITY = 0.01;
    JMFirework.FADE = 0.01;
    JMFirework.START_V_Y = 1;
    JMFirework.START_V_X = 1;
    JMFirework.NUM_PARTS = 50;
    JMFirework.SIZE = 3;
    JMFirework.particles = [];
    JMFirework.initialized = false;
    return JMFirework;
}());
var JMFireworkParticle = (function (_super) {
    __extends(JMFireworkParticle, _super);
    function JMFireworkParticle(options) {
        var _this = _super.call(this, TextureData.firework) || this;
        _this.update = function () {
            _this.x += _this.vX;
            _this.y += _this.vY;
            _this.vY += _this.gravity;
            _this.alpha -= _this.fade;
        };
        _this.x = options.x;
        _this.y = options.y;
        _this.gravity = options.gravity;
        _this.fade = options.fade;
        _this.vX = Math.random() * options.startVX - options.startVX / 2;
        _this.vY = Math.random() * options.startVY - options.startVY / 2;
        _this.alpha = 1;
        _this.width = options.size;
        _this.height = options.size;
        _this.tint = options.color;
        JMFirework.particles.push(_this);
        options.addTo.addChild(_this);
        return _this;
    }
    return JMFireworkParticle;
}(PIXI.Sprite));
var EventType;
(function (EventType) {
    EventType[EventType["UI_SELECT_MODE"] = 0] = "UI_SELECT_MODE";
    EventType[EventType["DRAG_EVENT"] = 1] = "DRAG_EVENT";
    EventType[EventType["MOVE_EVENT"] = 2] = "MOVE_EVENT";
    EventType[EventType["MOUSE_DOWN"] = 3] = "MOUSE_DOWN";
    EventType[EventType["MOUSE_UP"] = 4] = "MOUSE_UP";
    EventType[EventType["KEY_DOWN"] = 5] = "KEY_DOWN";
    EventType[EventType["KEY_UP"] = 6] = "KEY_UP";
    EventType[EventType["CLICK_EVENT"] = 7] = "CLICK_EVENT";
    EventType[EventType["UI_CLICK_SKILL"] = 8] = "UI_CLICK_SKILL";
    EventType[EventType["UI_BUTTON_PRESS"] = 9] = "UI_BUTTON_PRESS";
})(EventType || (EventType = {}));
var ObjectEvent;
(function (ObjectEvent) {
    ObjectEvent[ObjectEvent["END_TWEEN"] = 0] = "END_TWEEN";
})(ObjectEvent || (ObjectEvent = {}));
var JME = (function () {
    function JME() {
    }
    JME.init = function (_ticker) {
        _ticker.add(this.onTick.bind(this));
    };
    JME.addToTicker = function (_output) {
        this.tickEvents.push(_output);
    };
    JME.removeFromTicker = function (_output) {
        for (var i = 0; i < this.tickEvents.length; i += 1) {
            if (this.tickEvents[i] == _output) {
                this.tickEvents.splice(i, 1);
                return;
            }
        }
    };
    JME.createRegister = function (_type, _log) {
        if (_log === void 0) { _log = false; }
        this.registers[_type] = new JMERegister(_type);
        if (_log)
            this.addEventListener(_type, JME.logEvent);
    };
    JME.addEventListener = function (_type, _function, _once) {
        if (_once === void 0) { _once = false; }
        if (this.registers[_type] == null)
            this.createRegister(_type);
        if (_once) {
            this.registers[_type].once.push(_function);
        }
        else {
            this.registers[_type].listeners.push(_function);
        }
    };
    JME.removeEventListener = function (_type, _function) {
        JMBL.removeFromArray(_function, this.registers[_type].listeners);
    };
    JME.publishEvent = function (_type, _par) {
        if (this.registers[_type] == null)
            this.createRegister(_type);
        this.registers[_type].events.push(_par);
        if (!this.registers[_type].active) {
            this.registers[_type].active = true;
            this.activeRegisters.push(this.registers[_type]);
        }
    };
    JME.publishSelfEvent = function (_register, _par) {
        _register.events.push(_par);
        if (!_register.active) {
            _register.active = true;
            this.activeRegisters.push(_register);
        }
    };
    JME.logEvent = function (e) {
        this.eventLog.push(e);
    };
    JME.traceEventLog = function () {
        console.log(this.eventLog);
    };
    JME.onTick = function () {
        while (this.activeRegisters.length > 0) {
            var _register = this.activeRegisters[0];
            while (_register.events.length > 0) {
                var _cEvent = _register.events[0];
                for (var i = 0; i < _register.listeners.length; i += 1) {
                    _register.listeners[i](_cEvent);
                }
                while (_register.once.length > 0) {
                    _register.once[0](_cEvent);
                    _register.once.shift();
                }
                _register.events.shift();
            }
            _register.active = false;
            this.activeRegisters.shift();
        }
        for (var i = 0; i < this.tickEvents.length; i += 1) {
            this.tickEvents[i]();
        }
    };
    JME.registers = [];
    JME.activeRegisters = [];
    JME.eventLog = [];
    JME.tickEvents = [];
    return JME;
}());
var JMERegister = (function () {
    function JMERegister(_type) {
        this.listeners = [];
        this.once = [];
        this.events = [];
        this.active = false;
        this.type = _type;
    }
    return JMERegister;
}());
var JMEvent = (function () {
    function JMEvent() {
    }
    return JMEvent;
}());
var JME_UISelectModeEvent = (function (_super) {
    __extends(JME_UISelectModeEvent, _super);
    function JME_UISelectModeEvent(_mode) {
        var _this = _super.call(this) || this;
        _this.eventType = EventType.UI_SELECT_MODE;
        _this.mode = _mode;
        return _this;
    }
    return JME_UISelectModeEvent;
}(JMEvent));
var JME_MoveEvent = (function (_super) {
    __extends(JME_MoveEvent, _super);
    function JME_MoveEvent(_mouse) {
        var _this = _super.call(this) || this;
        _this.eventType = EventType.MOVE_EVENT;
        _this.mouse = _mouse;
        return _this;
    }
    return JME_MoveEvent;
}(JMEvent));
var JME_ClickEvent = (function (_super) {
    __extends(JME_ClickEvent, _super);
    function JME_ClickEvent(_mouse) {
        var _this = _super.call(this) || this;
        _this.eventType = EventType.CLICK_EVENT;
        _this.mouse = _mouse;
        return _this;
    }
    return JME_ClickEvent;
}(JMEvent));
var JME_DragEvent = (function (_super) {
    __extends(JME_DragEvent, _super);
    function JME_DragEvent(_mouse, _startDrag) {
        var _this = _super.call(this) || this;
        _this.eventType = EventType.DRAG_EVENT;
        _this.mouse = _mouse;
        _this.startDrag = _startDrag;
        return _this;
    }
    return JME_DragEvent;
}(JMEvent));
var JME_TweenEnd = (function (_super) {
    __extends(JME_TweenEnd, _super);
    function JME_TweenEnd(_target) {
        var _this = _super.call(this) || this;
        _this.eventType = ObjectEvent.END_TWEEN;
        _this.target = _target;
        return _this;
    }
    return JME_TweenEnd;
}(JMEvent));
var JME_KeyEvent = (function (_super) {
    __extends(JME_KeyEvent, _super);
    function JME_KeyEvent(_key) {
        var _this = _super.call(this) || this;
        _this.key = _key;
        return _this;
    }
    JME_KeyEvent.prototype.isNumber = function () {
        switch (this.key) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":
                return true;
        }
        return false;
    };
    return JME_KeyEvent;
}(JMEvent));
var JMTileMap = (function (_super) {
    __extends(JMTileMap, _super);
    function JMTileMap(options) {
        var _this = _super.call(this) || this;
        _this.diagonal = Math.sqrt(2);
        _this.tiles = [];
        _this.spawns = [];
        _this.tileSize = options.tileSize || 20;
        _this.tilesAcross = options.tilesAcross;
        for (var i = 0; i < options.tilesAcross * options.tilesDown; i += 1) {
            var _tile = new JMTile(i, new PIXI.Point(i % options.tilesAcross, Math.floor(i / options.tilesAcross)), options.tileSize);
            _this.tiles.push(_tile);
            if (i % options.tilesAcross != 0) {
                _tile.addOutlet(_this.tiles[i - 1]);
            }
            if (i >= options.tilesAcross) {
                _tile.addOutlet(_this.tiles[i - options.tilesAcross]);
            }
            _tile.view.x = _tile.loc.x * _this.tileSize;
            _tile.view.y = _tile.loc.y * _this.tileSize;
            _this.addChild(_tile.view);
        }
        _this.interactive = true;
        _this.bounds = new JMBL_Rect(0, 0, _this.tileSize * _this.tilesAcross, _this.tileSize * options.tilesDown);
        return _this;
    }
    JMTileMap.prototype.loadWalkMap = function (map) {
        this.goal = -1;
        for (var i = 0; i < map.length; i += 1) {
            switch (map.charAt(i)) {
                case "0":
                    this.tiles[i].walkable = false;
                    this.tiles[i].buildable = false;
                    break;
                case "x":
                    this.tiles[i].speed = 0.75;
                    break;
                case "y":
                    this.tiles[i].speed = 0.5;
                    break;
                case "s":
                    this.spawns.push(this.tiles[i]);
                    this.tiles[i].buildable = false;
                    this.tiles[i].isSpawn = true;
                    break;
                case "e":
                    this.goal = i;
                    this.tiles[i].buildable = false;
                    break;
                case "u":
                    this.tiles[i].buildable = false;
                    break;
                case "p":
                    this.tiles[i].walkable = false;
                    break;
            }
        }
        if (this.goal >= 0) {
            this.makeRouteMap(this.goal);
            this.makeAirMap(this.goal);
        }
    };
    JMTileMap.prototype.addBlockAt = function (i) {
        if (this.tiles[i].rating == -1)
            return false;
        this.tiles[i].walkable = false;
        this.makeRouteMap();
        for (var j = 0; j < this.spawns.length; j += 1) {
            if (this.spawns[j].rating == -1) {
                this.tiles[i].walkable = true;
                this.makeRouteMap();
                return false;
            }
        }
        return true;
    };
    JMTileMap.prototype.removeBlockAt = function (i) {
        if (this.tiles[i].rating != -1)
            return false;
        this.tiles[i].walkable = true;
        this.makeRouteMap();
        return true;
    };
    JMTileMap.prototype.addBuildingAt = function (building, i) {
        if (this.tiles[i].building != null || !this.tiles[i].buildable)
            return false;
        this.tiles[i].building = building;
        this.makeRouteMap();
        for (var j = 0; j < this.spawns.length; j += 1) {
            if (this.spawns[j].rating == -1) {
                this.tiles[i].building = null;
                this.makeRouteMap();
                return false;
            }
        }
        building.goto((this.tiles[i].loc.x + 0.5) * this.tileSize, (this.tiles[i].loc.y + 0.5) * this.tileSize);
        return true;
    };
    JMTileMap.prototype.getBuildingAt = function (i) {
        return this.tiles[i].building;
    };
    JMTileMap.prototype.removeBuildingAt = function (i) {
        if (this.tiles[i].building == null)
            return null;
        var m = this.tiles[i].building;
        this.tiles[i].building = null;
        if (m.parent != null)
            m.parent.removeChild(m);
        this.makeRouteMap();
        return m;
    };
    JMTileMap.prototype.makeAirMap = function (_goalIndex) {
        if (_goalIndex === void 0) { _goalIndex = -1; }
        if (_goalIndex >= 0)
            this.goal = _goalIndex;
        var _goal = this.tiles[this.goal];
        _goal.airRating = 0;
        var open = [_goal];
        var closed = [];
        while (open.length > 0) {
            var _current = open.shift();
            closed.push(_current);
            for (var i = 0; i < _current.outlets.length; i += 1) {
                var _current2 = _current.outlets[i];
                if (open.indexOf(_current2) == -1 && closed.indexOf(_current2) == -1 && (_current2.getWalkable() || _current2.buildable)) {
                    if (_current.loc.x != _current2.loc.x && _current.loc.y != _current2.loc.y) {
                        _current2.airRating = _current.airRating + this.diagonal;
                    }
                    else {
                        _current2.airRating = _current.airRating + 1;
                    }
                    open.push(_current2);
                }
            }
            open.sort(function (a, b) {
                if (a.airRating < b.airRating)
                    return -1;
                if (b.airRating < a.airRating)
                    return 1;
                return 0;
            });
        }
        var hasBlocked = false;
        main: for (var i = 0; i < this.tiles.length; i += 1) {
            for (var j = 0; j < closed.length; j += 1) {
                if (this.tiles[i] == closed[j]) {
                    continue main;
                }
            }
            this.tiles[i].airRating = -1;
            hasBlocked = true;
        }
    };
    JMTileMap.prototype.makeRouteMap = function (_goalIndex) {
        if (_goalIndex === void 0) { _goalIndex = -1; }
        if (_goalIndex >= 0)
            this.goal = _goalIndex;
        var _goal = this.tiles[this.goal];
        _goal.rating = 0;
        _goal.best = null;
        var open = [_goal];
        var closed = [];
        while (open.length > 0) {
            var _current = open.shift();
            closed.push(_current);
            for (var i = 0; i < _current.outlets.length; i += 1) {
                var _current2 = _current.outlets[i];
                if (open.indexOf(_current2) == -1 && closed.indexOf(_current2) == -1 && _current2.getWalkable()) {
                    if (_current.loc.x != _current2.loc.x && _current.loc.y != _current2.loc.y) {
                        _current2.rating = _current.rating + this.diagonal / (_current.getSpeed() + _current2.getSpeed()) * 2;
                    }
                    else {
                        _current2.rating = _current.rating + 2 / (_current.getSpeed() + _current2.getSpeed());
                    }
                    _current2.best = _current;
                    open.push(_current2);
                }
            }
            open.sort(function (a, b) {
                if (a.rating < b.rating)
                    return -1;
                if (b.rating < a.rating)
                    return 1;
                return 0;
            });
        }
        var hasBlocked = false;
        main: for (var i = 0; i < this.tiles.length; i += 1) {
            for (var j = 0; j < closed.length; j += 1) {
                if (this.tiles[i] == closed[j]) {
                    this.tiles[i].temporaryRecolor();
                    continue main;
                }
            }
            this.tiles[i].rating = -1;
            this.tiles[i].best = null;
            hasBlocked = true;
            this.tiles[i].temporaryRecolor();
        }
    };
    JMTileMap.prototype.getTileAt = function (point) {
        var x = Math.max(0, Math.min(Math.floor(point.x / this.tileSize), this.tilesAcross - 1));
        var y = Math.max(0, Math.min(Math.floor(point.y / this.tileSize), this.tiles.length / this.tilesAcross - 1));
        var i = x + y * this.tilesAcross;
        return this.tiles[i];
    };
    return JMTileMap;
}(PIXI.Container));
var JMTile = (function () {
    function JMTile(i, loc, width) {
        this.speed = 1;
        this.walkable = true;
        this.outlets = [];
        this.best = null;
        this.rating = -1;
        this.airRating = -1;
        this.buildable = true;
        this.building = null;
        this.isSpawn = false;
        this.index = i;
        this.loc = loc;
        this.width = width;
        this.view = new PIXI.Sprite(TextureData.square);
        this.view.tint = 0x00ff00;
        this.view.text = new PIXI.Text(String(i), { fontSize: 12 });
        this.view.addChild(this.view.text);
    }
    JMTile.prototype.getSpeed = function () {
        var m = this.speed;
        if (this.building != null)
            m = Math.min(this.speed, this.building.speed);
        return m;
    };
    JMTile.prototype.getWalkable = function () {
        if (this.building != null && this.building.speed == 0)
            return false;
        else
            return this.walkable;
    };
    JMTile.prototype.temporaryRecolor = function (type) {
        if (type === void 0) { type = 1; }
        var _tint = 0;
        switch (type) {
            case 0:
                this.view.text.text = Math.floor(this.rating * 10) / 10;
                if (this.rating < 0)
                    _tint = 0x770000;
                else if (this.rating < 2)
                    _tint = 0x00ffff;
                else if (this.rating < 10)
                    _tint = 0x00ff00;
                else if (this.rating < 20)
                    _tint = 0xffff00;
                else if (this.rating < 30)
                    _tint = 0xffcc00;
                else
                    _tint = 0xcc0000;
                break;
            case 1:
                this.view.text.text = "";
                if (this.rating == 0) {
                    _tint = 0x00ffff;
                    this.view.text.text = "Goal";
                }
                else if (this.isSpawn) {
                    _tint = 0xaa0000;
                    this.view.text.text = "Spwn";
                }
                else if (!this.walkable) {
                    if (!this.buildable) {
                        _tint = 0x000000;
                    }
                    else {
                        _tint = 0x777777;
                    }
                }
                else if (!this.buildable) {
                    _tint = 0x770000;
                }
                else if (this.speed < 0.7)
                    _tint = 0xaaaa00;
                else if (this.speed < 1)
                    _tint = 0xffcc00;
                else
                    _tint = 0x00ff00;
                break;
        }
        this.view.tint = _tint;
        this.view.text.x = (this.width - this.view.text.width) / 2;
        this.view.text.y = (this.width - this.view.text.height) / 2;
    };
    JMTile.prototype.addOutlet = function (_tile, _addTo) {
        if (_addTo === void 0) { _addTo = true; }
        for (var i = 0; i < this.outlets.length; i += 1) {
            if (this.outlets[i] == _tile) {
                return;
            }
        }
        this.outlets.push(_tile);
        if (_addTo)
            _tile.addOutlet(this, false);
    };
    JMTile.prototype.removeOutlet = function (_tile) {
        for (var i = 0; i < this.outlets.length; i += 1) {
            if (this.outlets[i] == _tile) {
                this.outlets.splice(i, 1);
                return;
            }
        }
    };
    JMTile.prototype.pointInTile = function (_point) {
        if (_point.x > this.loc.x * this.width && _point.x < (this.loc.x + 1) * this.width && _point.y > this.loc.y * this.width && _point.y < (this.loc.y + 1) * this.width) {
            return true;
        }
        else {
            return false;
        }
    };
    return JMTile;
}());
var BuffType;
(function (BuffType) {
    BuffType[BuffType["BASIC"] = 0] = "BASIC";
    BuffType[BuffType["SLOW"] = 1] = "SLOW";
    BuffType[BuffType["POISON"] = 2] = "POISON";
})(BuffType || (BuffType = {}));
var EffectModel = (function () {
    function EffectModel() {
    }
    EffectModel.prototype.applyTo = function (_target) {
    };
    EffectModel.prototype.getDescription = function () {
    };
    return EffectModel;
}());
var EffectBuff = (function (_super) {
    __extends(EffectBuff, _super);
    function EffectBuff(_buff) {
        var _this = _super.call(this) || this;
        _this.buff = _buff;
        return _this;
    }
    EffectBuff.prototype.applyTo = function (_target) {
        _target.addBuff(this.buff.clone());
    };
    EffectBuff.prototype.getDescription = function () {
        return BuffModel.nameFromType(this.buff.type) + ":\n  " + BuffModel.descOfThis(this.buff);
    };
    return EffectBuff;
}(EffectModel));
var BuffModel = (function () {
    function BuffModel() {
        var _this = this;
        this.update = function () {
            _this.ticks -= 1;
            _this.onUpdate();
        };
        this.type = BuffType.BASIC;
    }
    BuffModel.nameFromType = function (_type) {
        switch (_type) {
            case BuffType.BASIC: return "Basic";
            case BuffType.POISON: return "Poison";
            case BuffType.SLOW: return "Slow";
        }
    };
    BuffModel.descOfThis = function (_buff) {
        switch (_buff.type) {
            case BuffType.BASIC: return "";
            case BuffType.POISON: return String(_buff.getDPS()) + " dps for " + facade.toDur(_buff.ticks) + "s";
            case BuffType.SLOW: return "Move reduced by " + String(Math.floor((1 - _buff.slow) * 100)) + "%\n  for " + facade.toDur(_buff.ticks) + "s";
        }
    };
    BuffModel.prototype.addTo = function (_target) {
        this.target = _target;
        this.onAdd();
    };
    BuffModel.prototype.onAdd = function () {
    };
    BuffModel.prototype.onRemove = function () {
    };
    BuffModel.prototype.onUpdate = function () {
    };
    BuffModel.prototype.mergeWith = function (buff) {
        this.ticks += buff.ticks;
    };
    BuffModel.prototype.clone = function () {
        var m = new BuffModel;
        m.ticks = this.ticks;
        m.target = this.target;
        return m;
    };
    BuffModel.prototype.startVisual = function () {
    };
    BuffModel.prototype.endVisual = function () {
    };
    return BuffModel;
}());
var SlowBuff = (function (_super) {
    __extends(SlowBuff, _super);
    function SlowBuff(slow, duration) {
        var _this = _super.call(this) || this;
        _this.slow = slow;
        _this.ticks = duration;
        _this.type = BuffType.SLOW;
        return _this;
    }
    SlowBuff.prototype.onAdd = function () {
        this.target.speed *= this.slow;
    };
    SlowBuff.prototype.onRemove = function () {
        this.target.speed /= this.slow;
    };
    SlowBuff.prototype.mergeWith = function (buff) {
        this.onRemove();
        this.slow = (this.slow * this.ticks + buff.slow * buff.ticks) / (this.ticks + buff.ticks);
        this.ticks += buff.ticks;
        this.onAdd();
    };
    SlowBuff.prototype.clone = function () {
        var m = new SlowBuff(this.slow, this.ticks);
        m.target = this.target;
        return m;
    };
    SlowBuff.prototype.startVisual = function () {
        this.target.setTint(0x00aaff);
    };
    SlowBuff.prototype.endVisual = function () {
        this.target.setTint(this.target.originalTint);
    };
    return SlowBuff;
}(BuffModel));
var PoisonBuff = (function (_super) {
    __extends(PoisonBuff, _super);
    function PoisonBuff(damage, frequency, duration) {
        var _this = _super.call(this) || this;
        _this.damage = damage;
        _this.frequency = frequency;
        _this.cFrequency = _this.frequency;
        _this.ticks = duration;
        _this.type = BuffType.POISON;
        return _this;
    }
    PoisonBuff.prototype.onUpdate = function () {
        this.cFrequency -= 1;
        if (this.cFrequency <= 0) {
            this.cFrequency = this.frequency;
            this.target.takeDamage(this.damage);
        }
    };
    PoisonBuff.prototype.mergeWith = function (buff) {
        this.onRemove();
        this.damage = (this.damage * this.ticks + buff.damage * buff.ticks * this.frequency / buff.frequency) / (this.ticks + buff.ticks);
        this.ticks += buff.ticks;
        this.onAdd();
    };
    PoisonBuff.prototype.clone = function () {
        var m = new PoisonBuff(this.damage, this.frequency, this.ticks);
        m.target = this.target;
        return m;
    };
    PoisonBuff.prototype.startVisual = function () {
        this.target.setTint(0x00aa00);
    };
    PoisonBuff.prototype.endVisual = function () {
        this.target.setTint(this.target.originalTint);
    };
    PoisonBuff.prototype.getDPS = function () {
        return this.damage * facade.toPS(this.frequency);
    };
    return PoisonBuff;
}(BuffModel));
var BuildingObject = (function (_super) {
    __extends(BuildingObject, _super);
    function BuildingObject(_tile, _texture, _tint) {
        if (_texture === void 0) { _texture = null; }
        if (_tint === void 0) { _tint = 0; }
        var _this = _super.call(this, _texture || TextureData.mediumCircle) || this;
        _this.speed = 4;
        _this.cooldown = 50;
        _this.maxCooldown = 50;
        _this.range = 100;
        _this.damage = 5;
        _this.effects = [];
        _this.goa = TwoOptions.Both;
        _this.checkPriorities = _this.getClosest;
        _this.priority = PriorityType.CLOSEST;
        _this.activate = function (manager) {
            if (_this.cooldown < 0) {
                var _target = _this.checkPriorities(manager);
                if (_target != null) {
                    _this.cooldown = _this.maxCooldown;
                    _this.activeFunction(_target, manager);
                }
            }
            else {
                _this.cooldown -= 1;
            }
        };
        _this.setPriority = function (i) {
            _this.priority = i;
            switch (i) {
                case PriorityType.FIRST:
                    _this.checkPriorities = _this.getFirst;
                    break;
                case PriorityType.LAST:
                    _this.checkPriorities = _this.getLast;
                    break;
                case PriorityType.CLOSEST:
                    _this.checkPriorities = _this.getClosest;
                    break;
                case PriorityType.STRONGEST:
                    _this.checkPriorities = _this.getStrongest;
                    break;
                case PriorityType.WEAKEST:
                    _this.checkPriorities = _this.getWeakest;
                    break;
                case PriorityType.ANY:
                    _this.checkPriorities = _this.getAny;
                    break;
                case PriorityType.NONE:
                    _this.checkPriorities = null;
                    break;
            }
        };
        _this.type = ObjectType.BUILDING;
        _this.tile = _tile;
        _this.setTint(_tint || 0x0000cc);
        _this.pivot.set(_this.width / 2, _this.height / 2);
        _this.draggable = false;
        _this.subtype = BuildingType.BASIC;
        _this.activeFunction = _this.shootProjectile;
        _this.setPriority(PriorityType.FIRST);
        return _this;
    }
    BuildingObject.nameFromType = function (_type) {
        switch (_type) {
            case BuildingType.BASIC: return "Basic";
            case BuildingType.NOVA: return "Nova";
            case BuildingType.ICE: return "Ice";
            case BuildingType.POISON: return "Poison";
            case BuildingType.WALL: return "Wall";
        }
        return "NOT BUILDING";
    };
    BuildingObject.buildingFromType = function (_type, _tile) {
        switch (_type) {
            case BuildingType.BASIC: return new BuildingObject(_tile);
            case BuildingType.NOVA: return new NovaBuilding(_tile);
            case BuildingType.ICE: return new IceBuilding(_tile);
            case BuildingType.POISON: return new PoisonBuilding(_tile);
            case BuildingType.WALL: return new WallBuilding(_tile);
        }
        return null;
    };
    BuildingObject.prototype.getAny = function (manager) {
        var options = { has: { type: ObjectType.WALKING }, greater: { reserveHealth: 0 } };
        if (this.goa == TwoOptions.One) {
            options.has.airborne = false;
        }
        else if (this.goa == TwoOptions.Two) {
            options.has.airborne = true;
        }
        return manager.getFirstObject(this.asPoint, this.range, options);
    };
    BuildingObject.prototype.getClosest = function (manager) {
        var options = { has: { type: ObjectType.WALKING }, greater: { reserveHealth: 0 } };
        if (this.goa == TwoOptions.One) {
            options.has.airborne = false;
        }
        else if (this.goa == TwoOptions.Two) {
            options.has.airborne = true;
        }
        return manager.getClosestObject(this.asPoint, this.range, options);
    };
    BuildingObject.prototype.getFirst = function (manager) {
        var options = { has: { type: ObjectType.WALKING }, greater: { reserveHealth: 0 } };
        if (this.goa == TwoOptions.One) {
            options.has.airborne = false;
        }
        else if (this.goa == TwoOptions.Two) {
            options.has.airborne = true;
        }
        var _objects = manager.getAllInRange(this.asPoint, this.range, options);
        if (_objects.length == 0)
            return null;
        var m = _objects[0];
        var j = _objects[0].airborne ? _objects[0].currentTile.airRating : _objects[0].currentTile.rating;
        for (var i = 0; i < _objects.length; i += 1) {
            var cJ = _objects[i].airborne ? _objects[i].currentTile.airRating : _objects[i].currentTile.rating;
            if (cJ < j)
                m = _objects[i];
        }
        return m;
    };
    BuildingObject.prototype.getLast = function (manager) {
        var options = { has: { type: ObjectType.WALKING }, greater: { reserveHealth: 0 } };
        if (this.goa == TwoOptions.One) {
            options.has.airborne = false;
        }
        else if (this.goa == TwoOptions.Two) {
            options.has.airborne = true;
        }
        var _objects = manager.getAllInRange(this.asPoint, this.range, options);
        if (_objects.length == 0)
            return null;
        var m = _objects[0];
        var j = _objects[0].airborne ? _objects[0].currentTile.airRating : _objects[0].currentTile.rating;
        for (var i = 0; i < _objects.length; i += 1) {
            var cJ = _objects[i].airborne ? _objects[i].currentTile.airRating : _objects[i].currentTile.rating;
            if (cJ > j)
                m = _objects[i];
        }
        return m;
    };
    BuildingObject.prototype.getStrongest = function (manager) {
        var options = { has: { type: ObjectType.WALKING }, greater: { reserveHealth: 0 } };
        if (this.goa == TwoOptions.One) {
            options.has.airborne = false;
        }
        else if (this.goa == TwoOptions.Two) {
            options.has.airborne = true;
        }
        var _objects = manager.getAllInRange(this.asPoint, this.range, options);
        if (_objects.length == 0)
            return null;
        var m = _objects[0];
        var j = _objects[0].reserveHealth;
        for (var i = 0; i < _objects.length; i += 1) {
            var cJ = _objects[i].reserveHealth;
            if (cJ > j)
                m = _objects[i];
        }
        return m;
    };
    BuildingObject.prototype.getWeakest = function (manager) {
        var options = { has: { type: ObjectType.WALKING }, greater: { reserveHealth: 0 } };
        if (this.goa == TwoOptions.One) {
            options.has.airborne = false;
        }
        else if (this.goa == TwoOptions.Two) {
            options.has.airborne = true;
        }
        var _objects = manager.getAllInRange(this.asPoint, this.range, options);
        if (_objects.length == 0)
            return null;
        var m = _objects[0];
        var j = _objects[0].reserveHealth;
        for (var i = 0; i < _objects.length; i += 1) {
            var cJ = _objects[i].reserveHealth;
            if (cJ < j)
                m = _objects[i];
        }
        return m;
    };
    BuildingObject.prototype.shootProjectile = function (_target, manager) {
        var _bullet = new ProjectileObject(_target, { damage: this.damage, range: this.range, speed: this.speed, effects: this.effects, goa: this.goa });
        _bullet.goto(this.x, this.y);
        manager.addObject(_bullet);
    };
    BuildingObject.prototype.shootNova = function (_target, manager) {
        var _bullet = new ExpandingNova(_target, { damage: this.damage, range: this.range, speed: this.speed, effects: this.effects, goa: this.goa });
        _bullet.goto(this.x, this.y);
        manager.addObject(_bullet);
    };
    BuildingObject.prototype.onSelect = function () {
        this.selected = true;
        if (this.selectionCircle == null) {
            this.selectionCircle = new PIXI.Graphics;
            this.selectionCircle.lineStyle(4, 0x00cccc);
            this.selectionCircle.drawRect(-this.width / 2 - 2, -this.height / 2 - 2, this.width + 4, this.height + 4);
            if (this.range > 0) {
                this.selectionCircle.beginFill(0x00ffff, 0.3);
                this.selectionCircle.lineStyle(2, 0x00ffff, 0.7);
                this.selectionCircle.drawCircle(0, 0, this.range);
            }
            this.parent.addChild(this);
            this.addChild(this.selectionCircle);
            this.selectionCircle.x = this.pivot.x;
            this.selectionCircle.y = this.pivot.y;
        }
    };
    BuildingObject.prototype.clearSelect = function () {
        this.selected = false;
        if (this.selectionCircle != null) {
            this.selectionCircle.parent.removeChild(this.selectionCircle);
            this.selectionCircle.destroy();
            this.selectionCircle = null;
        }
    };
    return BuildingObject;
}(GameObject));
var NovaBuilding = (function (_super) {
    __extends(NovaBuilding, _super);
    function NovaBuilding(_tile) {
        var _this = _super.call(this, _tile, TextureData.nova, 0xcccc00) || this;
        _this.range = 50;
        _this.damage = 2;
        _this.maxCooldown = 20;
        _this.subtype = BuildingType.NOVA;
        _this.activeFunction = _this.shootNova;
        _this.goa = TwoOptions.One;
        _this.setPriority(PriorityType.ANY);
        return _this;
    }
    return NovaBuilding;
}(BuildingObject));
var WallBuilding = (function (_super) {
    __extends(WallBuilding, _super);
    function WallBuilding(_tile) {
        var _this = _super.call(this, _tile, TextureData.wall, 0x0000cc) || this;
        _this.activate = function (manager) {
        };
        _this.range = 0;
        _this.damage = 0;
        _this.maxCooldown = 0;
        _this.subtype = BuildingType.WALL;
        _this.activeFunction = null;
        _this.setPriority(PriorityType.NONE);
        return _this;
    }
    return WallBuilding;
}(BuildingObject));
var IceBuilding = (function (_super) {
    __extends(IceBuilding, _super);
    function IceBuilding(_tile) {
        var _this = _super.call(this, _tile, TextureData.mediumCircle, 0x00dddd) || this;
        _this.damage = 4;
        _this.range = 70;
        _this.maxCooldown = 70;
        _this.subtype = BuildingType.ICE;
        _this.effects.push(new EffectBuff(new SlowBuff(0.5, 100)));
        _this.setPriority(PriorityType.FIRST);
        return _this;
    }
    return IceBuilding;
}(BuildingObject));
var PoisonBuilding = (function (_super) {
    __extends(PoisonBuilding, _super);
    function PoisonBuilding(_tile) {
        var _this = _super.call(this, _tile, TextureData.mediumCircle, 0x007700) || this;
        _this.damage = 2;
        _this.range = 90;
        _this.maxCooldown = 50;
        _this.subtype = BuildingType.POISON;
        _this.effects.push(new EffectBuff(new PoisonBuff(1, 20, 100)));
        _this.setPriority(PriorityType.LAST);
        return _this;
    }
    return PoisonBuilding;
}(BuildingObject));
var DamagingObject = (function (_super) {
    __extends(DamagingObject, _super);
    function DamagingObject(_texture, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, _texture) || this;
        _this.speed = 4;
        _this.damage = 5;
        _this.range = 30;
        _this.goa = TwoOptions.Both;
        _this.hitTarget = function () {
        };
        _this.finishHit = function (_target) {
            _target.takeDamage(_this.damage);
            if (_this.effects.length > 0) {
                for (var i = 0; i < _this.effects.length; i += 1) {
                    _this.effects[i].applyTo(_target);
                }
            }
        };
        _this.makeUseless = function () {
        };
        _this.update = function () {
            _this.makeUseless();
            _this.toRemove = true;
        };
        _this.type = ObjectType.PROJECTILE;
        _this.speed = options.speed || _this.speed;
        _this.damage = options.damage || _this.damage;
        _this.range = options.range || _this.range;
        _this.goa = options.goa != null ? options.goa : _this.goa;
        _this.pivot.set(_this.width / 2, _this.height / 2);
        _this.effects = options.effects || [];
        return _this;
    }
    return DamagingObject;
}(GameObject));
var ExpandingNova = (function (_super) {
    __extends(ExpandingNova, _super);
    function ExpandingNova(_target, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, TextureData.clearCircle, JMBL.applyDefaultOptions(options, { damage: 2, range: 50, speed: 3 })) || this;
        _this.alreadyHit = [];
        _this.update = function () {
            if (_this.cRange >= _this.range) {
                _this.makeUseless();
                _this.toRemove = true;
            }
            else {
                _this.cRange += _this.speed;
                _this.width = _this.height = _this.cRange * 2;
                var options = { has: { type: ObjectType.WALKING } };
                if (_this.goa == TwoOptions.One) {
                    options.has.airborne = false;
                }
                else if (_this.goa == TwoOptions.Two) {
                    options.has.airborne = true;
                }
                var _inRange = facade.game.objects.getAllInRange(_this.asPoint, _this.cRange, options);
                main: for (var i = 0; i < _inRange.length; i += 1) {
                    for (var j = 0; j < _this.alreadyHit.length; j += 1) {
                        if (_inRange[i] == _this.alreadyHit[j]) {
                            continue main;
                        }
                    }
                    _this.finishHit(_inRange[i]);
                    new JMFirework({ gravity: 0.001, numParts: 2, addTo: _this.parent, x: _inRange[i].x, y: _inRange[i].y, size: 2, color: 0xcccc00, startVX: 0.5, startVY: 0.5 });
                    _this.alreadyHit.push(_inRange[i]);
                }
            }
        };
        _this.cRange = 5;
        _this.width = _this.height = _this.cRange * 2;
        return _this;
    }
    return ExpandingNova;
}(DamagingObject));
var ProjectileObject = (function (_super) {
    __extends(ProjectileObject, _super);
    function ProjectileObject(_target, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, TextureData.bullet, JMBL.applyDefaultOptions(options, { speed: 4, damage: 5 })) || this;
        _this.cAngle = 0;
        _this.hitTarget = function () {
            _this.finishHit(_this.target);
            _this.toRemove = true;
            new JMFirework({ gravity: 0.001, numParts: 3, addTo: _this.parent, x: _this.target.x, y: _this.target.y, size: 2, color: 0x0000cc, startVX: 0.5, startVY: 0.5 });
        };
        _this.makeUseless = function () {
            _this.target = null;
        };
        _this.update = function () {
            if (_this.target == null) {
                _this.alpha -= 0.02;
                if (_this.alpha <= 0)
                    _this.toRemove = true;
                _this.x += Math.cos(_this.cAngle) * _this.speed;
                _this.y += Math.sin(_this.cAngle) * _this.speed;
                return;
            }
            if (_this.target.toRemove) {
                _this.makeUseless();
                return;
            }
            var distance = _this.getNowDistance(_this.target.asPoint);
            if (distance <= _this.speed) {
                _this.moving = false;
                _this.publishEvent(ObjectEvent.END_TWEEN, new JME_TweenEnd(_this));
            }
            else {
                _this.cAngle = Math.atan2(_this.target.y - _this.y, _this.target.x - _this.x);
                _this.x += Math.cos(_this.cAngle) * _this.speed;
                _this.y += Math.sin(_this.cAngle) * _this.speed;
            }
        };
        _this.target = _target;
        _target.reserveDamage(_this.damage);
        _this.addEventListener(ObjectEvent.END_TWEEN, _this.hitTarget, true);
        _this.setTint(0x003333);
        return _this;
    }
    return ProjectileObject;
}(DamagingObject));
var WalkingObject = (function (_super) {
    __extends(WalkingObject, _super);
    function WalkingObject(_tile, _texture, _tint) {
        if (_texture === void 0) { _texture = null; }
        if (_tint === void 0) { _tint = 0; }
        var _this = _super.call(this, _texture || TextureData.smallCircle) || this;
        _this.maxHealth = 100;
        _this.health = 100;
        _this.reserveHealth = 100;
        _this.buffs = [];
        _this.cBuffVisual = -1;
        _this.cBuffCounter = 0;
        _this.speed = 0.05;
        _this.airborne = false;
        _this.subtype = WalkingType.RUNNER;
        _this.killMe = function () {
            new JMFirework({ gravity: 0.001, numParts: 7, addTo: _this.parent, x: _this.x, y: _this.y, size: 3, color: 0xcc0000, startVX: 0.5, startVY: 0.5 });
            _this.toRemove = true;
        };
        _this.updateNextTile = function () {
            if (_this.currentTile != null) {
                _this.nextTile = null;
                if (_this.currentTile.outlets.length > 0) {
                    var _best = Infinity;
                    for (var i = 0; i < _this.currentTile.outlets.length; i += 1) {
                        if (_this.currentTile.outlets[i].rating >= 0 && (_this.currentTile.outlets[i].rating < _best || (_this.currentTile.outlets[i].rating == _best && Math.random() < 0.5))) {
                            _best = _this.currentTile.outlets[i].rating;
                            _this.nextTile = _this.currentTile.outlets[i];
                        }
                    }
                    if (_this.nextTile == null) {
                        _this.nextTile = _this.currentTile.outlets[Math.floor(Math.random() * _this.currentTile.outlets.length)];
                    }
                }
            }
        };
        _this.update = function () {
            if (_this.dragging) {
                _this.currentTile = null;
            }
            else if (_this.currentTile == null) {
            }
            else {
                if (_this.nextTile == null) {
                    _this.updateNextTile();
                }
                else {
                    _this.goal.x = (_this.nextTile.loc.x + 0.5) * _this.nextTile.width;
                    _this.goal.y = (_this.nextTile.loc.y + 0.5) * _this.nextTile.width;
                    if (_this.nextTile.pointInTile(_this.asPoint)) {
                        _this.currentTile = _this.nextTile;
                        _this.updateNextTile();
                    }
                }
            }
            var _static = true;
            if (_this.x != _this.goal.x) {
                var diff = _this.goal.x + -_this.x;
                if (Math.abs(diff) < 1)
                    _this.x = _this.goal.x;
                else {
                    _this.x += diff * _this.speed * (_this.currentTile ? _this.currentTile.speed : 1);
                    _static = false;
                    _this.moving = true;
                }
            }
            if (_this.y != _this.goal.y) {
                var diff = _this.goal.y - _this.y;
                if (Math.abs(diff) < 1)
                    _this.y = _this.goal.y;
                else {
                    _this.y += diff * _this.speed * (_this.currentTile ? _this.currentTile.speed : 1);
                    _static = false;
                    _this.moving = true;
                }
            }
            if (_static && _this.moving) {
                _this.moving = false;
                _this.publishEvent(ObjectEvent.END_TWEEN, new JME_TweenEnd(_this));
            }
            if (_this.buffs.length > 0) {
                for (var i = 0; i < _this.buffs.length; i += 1) {
                    _this.buffs[i].update();
                    if (_this.buffs[i].ticks <= 0) {
                        _this.removeBuffAt(i);
                        i -= 1;
                    }
                }
            }
            _this.incrementVisualBuff();
        };
        _this.type = ObjectType.WALKING;
        _this.currentTile = _tile;
        _this.setTint(_tint || 0xff0000);
        _this.originalTint = _this.baseTint;
        _this.pivot.set(_this.width / 2, _this.height / 2);
        _this.subtype = WalkingType.RUNNER;
        return _this;
    }
    WalkingObject.nameFromType = function (_type) {
        switch (_type) {
            case WalkingType.RUNNER: return "Runner";
            case WalkingType.FLYER: return "Flyer";
        }
        return "NOT WALKER";
    };
    WalkingObject.buildingFromType = function (_type, _tile) {
        switch (_type) {
            case WalkingType.RUNNER: return new WalkingObject(_tile);
            case WalkingType.FLYER: return new FlyingObject(_tile);
        }
        return null;
    };
    WalkingObject.prototype.reserveDamage = function (n) {
        this.reserveHealth -= n;
    };
    WalkingObject.prototype.takeDamage = function (n) {
        var _this = this;
        this.health -= n;
        this.reserveHealth = Math.min(this.reserveHealth, this.health);
        if (this.health < this.maxHealth) {
            if (this.gauge == null) {
                this.gauge = new JMBUI_Gauge(0x00cc00, { width: 15, height: 2 });
                this.gauge.x = this.pivot.x - this.gauge.graphics.width / 2;
                this.gauge.y = -this.gauge.graphics.height - 2;
                this.addChild(this.gauge);
                this.gauge.setMax(this.maxHealth);
            }
        }
        if (this.gauge != null)
            this.gauge.setValue(this.health);
        if (this.health <= 0) {
            this.killMe();
            return;
        }
        ;
        JMBL.tweenColor(this, 5, { tint: 0 }, function () { JMBL.tweenTo(_this, 5, { tint: _this.baseTint }); });
    };
    WalkingObject.prototype.addBuff = function (_buff) {
        for (var i = 0; i < this.buffs.length; i += 1) {
            if (this.buffs[i].type == _buff.type) {
                this.buffs[i].mergeWith(_buff);
                return;
            }
        }
        this.buffs.push(_buff);
        _buff.addTo(this);
        if (this.cBuffVisual >= 0)
            this.buffs[this.cBuffVisual].endVisual();
        this.setVisualBuff(this.buffs.length - 1);
    };
    WalkingObject.prototype.removeBuff = function (_buff) {
        for (var i = 0; i < this.buffs.length; i += 1) {
            if (this.buffs[i] == _buff) {
                return this.removeBuffAt(i);
            }
        }
        return null;
    };
    WalkingObject.prototype.removeBuffAt = function (i) {
        var _buff = this.buffs[i];
        this.buffs.splice(i, 1);
        if (i == this.cBuffVisual) {
            _buff.endVisual();
            if (this.buffs.length >= 1)
                this.setVisualBuff(0);
            else {
                this.cBuffVisual = -1;
            }
        }
        else if (this.cBuffVisual > i)
            this.cBuffVisual -= 1;
        _buff.onRemove();
        return _buff;
    };
    WalkingObject.prototype.setVisualBuff = function (i) {
        if (this.cBuffVisual >= 0 && this.cBuffVisual < this.buffs.length)
            this.buffs[this.cBuffVisual].endVisual();
        this.cBuffVisual = i;
        this.cBuffCounter = 1000;
        this.buffs[this.cBuffVisual].startVisual();
    };
    WalkingObject.prototype.incrementVisualBuff = function (i) {
        if (i === void 0) { i = 1; }
        if (this.cBuffCounter < 0) {
            if (this.buffs.length > 1) {
                if (this.cBuffVisual >= 0)
                    this.buffs[this.cBuffVisual].endVisual();
                this.cBuffVisual += i;
                this.cBuffCounter = 1000;
                if (this.cBuffVisual >= this.buffs.length)
                    this.cBuffVisual = 0;
                this.buffs[this.cBuffVisual].startVisual();
            }
        }
        else {
            this.cBuffCounter -= 1;
        }
    };
    WalkingObject.prototype.onSelect = function () {
        this.selected = true;
        if (this.selectionGraphics == null) {
            this.selectionGraphics = new PIXI.Graphics;
            this.selectionGraphics.lineStyle(2, 0x00cccc);
            this.selectionGraphics.drawRect(-this.width / 2 - 2, -this.height / 2 - 2, this.width + 4, this.height + 4);
            this.addChild(this.selectionGraphics);
            this.selectionGraphics.x = this.pivot.x;
            this.selectionGraphics.y = this.pivot.y;
        }
    };
    WalkingObject.prototype.clearSelect = function () {
        this.selected = false;
        if (this.selectionGraphics != null) {
            this.selectionGraphics.parent.removeChild(this.selectionGraphics);
            this.selectionGraphics.destroy();
            this.selectionGraphics = null;
        }
    };
    return WalkingObject;
}(GameObject));
var FlyingObject = (function (_super) {
    __extends(FlyingObject, _super);
    function FlyingObject(_tile) {
        var _this = _super.call(this, _tile) || this;
        _this.shadow = new PIXI.Sprite(TextureData.genericShadow);
        _this.hoverCount = 0;
        _this.updateNextTile = function () {
            if (_this.currentTile != null) {
                _this.nextTile = null;
                if (_this.currentTile.outlets.length > 0) {
                    var _best = Infinity;
                    for (var i = 0; i < _this.currentTile.outlets.length; i += 1) {
                        if (_this.currentTile.outlets[i].airRating >= 0 && (_this.currentTile.outlets[i].airRating < _best || (_this.currentTile.outlets[i].airRating == _best && Math.random() < 0.5))) {
                            _best = _this.currentTile.outlets[i].airRating;
                            _this.nextTile = _this.currentTile.outlets[i];
                        }
                    }
                    if (_this.nextTile == null) {
                        _this.nextTile = _this.currentTile.outlets[Math.floor(Math.random() * _this.currentTile.outlets.length)];
                    }
                }
            }
        };
        _this.update = function () {
            if (_this.currentTile != null) {
                if (_this.nextTile == null) {
                    _this.updateNextTile();
                }
                else {
                    _this.goal.x = (_this.nextTile.loc.x + 0.5) * _this.nextTile.width;
                    _this.goal.y = (_this.nextTile.loc.y + 0.5) * _this.nextTile.width;
                    if (_this.nextTile.pointInTile(_this.asPoint)) {
                        _this.currentTile = _this.nextTile;
                        _this.updateNextTile();
                    }
                }
            }
            var _static = true;
            if (_this.x != _this.goal.x) {
                var diff = _this.goal.x + -_this.x;
                if (Math.abs(diff) < 1)
                    _this.x = _this.goal.x;
                else {
                    _this.x += diff * _this.speed;
                    _static = false;
                    _this.moving = true;
                }
            }
            if (_this.y != _this.goal.y) {
                var diff = _this.goal.y - _this.y;
                if (Math.abs(diff) < 1)
                    _this.y = _this.goal.y;
                else {
                    _this.y += diff * _this.speed;
                    _static = false;
                    _this.moving = true;
                }
            }
            if (_static && _this.moving) {
                _this.moving = false;
                _this.publishEvent(ObjectEvent.END_TWEEN, new JME_TweenEnd(_this));
            }
            if (_this.buffs.length > 0) {
                for (var i = 0; i < _this.buffs.length; i += 1) {
                    _this.buffs[i].update();
                    if (_this.buffs[i].ticks <= 0) {
                        _this.removeBuffAt(i);
                        i -= 1;
                    }
                }
            }
            _this.incrementVisualBuff();
            _this.hoverMove();
        };
        _this.addChild(_this.shadow);
        _this.pivot.y = 20;
        _this.airborne = true;
        _this.shadow.x = _this.pivot.x - _this.shadow.width / 2;
        _this.shadow.y = _this.pivot.y - _this.shadow.height / 2;
        _this.subtype = WalkingType.FLYER;
        return _this;
    }
    FlyingObject.prototype.hoverMove = function () {
        this.hoverCount -= 0.5 + Math.random();
        if (this.hoverCount < -30) {
            this.hoverCount = 30;
        }
        this.pivot.y = 20 - Math.abs(this.hoverCount) / 5;
        this.shadow.scale.x = this.shadow.scale.y = 1 + this.pivot.y / 100;
        this.shadow.y = this.pivot.y + this.shadow.height / 2;
        this.shadow.x = this.pivot.x - this.shadow.width / 2;
    };
    return FlyingObject;
}(WalkingObject));
