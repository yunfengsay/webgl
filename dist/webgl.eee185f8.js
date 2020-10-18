// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/globalMap.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataChanger = exports.GlobalMap = void 0;
exports.GlobalMap = new Proxy({}, {
  get: function get(target, funcName) {
    if (funcName.startsWith('set')) {
      var keyname_1 = funcName.split('set')[1];
      return function () {
        return exports.GlobalMap[keyname_1] = arguments[0];
      };
    }

    if (funcName.startsWith('get')) {
      var keyname = funcName.split('get')[1];
      return exports.GlobalMap[keyname];
    }

    return null;
  }
});
window.GlobalMap = exports.GlobalMap;

exports.GlobalMap.set = function (key, value) {
  return exports.GlobalMap[key] = value;
};

exports.GlobalMap.get = function (key) {
  return exports.GlobalMap[key];
};

exports.DataChanger = {
  setCanvasInstace: function setCanvasInstace(data) {
    return exports.GlobalMap.set('canvasInstance', data);
  },
  setCanvasCtx: function setCanvasCtx(data) {
    return exports.GlobalMap.set('canvasCtx', data);
  }
};
},{}],"../src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Render = void 0;

var globalMap_1 = require("./globalMap");

exports.Render = function (dom, props) {
  var canvas = document.createElement("canvas");
  canvas.style = props.style;
  globalMap_1.GlobalMap.setCanvasInstace(canvas);
  var gl = canvas.getContext("webgl"); // 确认WebGL支持性

  if (!gl) {
    alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
    return;
  }

  globalMap_1.GlobalMap.setCanvasInstace(gl); // 使用完全不透明的黑色清除所有图像

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // 用上面指定的颜色清除缓冲区

  gl.clear(gl.COLOR_BUFFER_BIT);
  var vertexShader = createShader(gl, VSHADER_SOURCE_CODE, gl.VERTEX_SHADER);
  var fragmentShader = createShader(gl, FSHADER_SOURCE_CODE, gl.FRAGMENT_SHADER);
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.program = program; // 获取顶点的数量

  var n = initVertexBuffers(gl); // 指定设置清空颜色缓冲区时的颜色值。

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // 绘制

  function draw() {
    // 清空上一次的绘制，因为是逐帧绘制，所以每一次绘制都要清除上次绘制的内容。
    gl.clear(gl.COLOR_BUFFER_BIT); // 绘制传入的图元
    // 第一个参数就是图元的类型，上面有说到
    // 第二个参数是指定从哪个顶点开始
    // 第三个参数则是顶点的数量

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  draw();
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof dom === 'bject') {
      dom.appendChild(canvas);
      return;
    }

    document.querySelector(dom).appendChild(canvas);
  });
};

function createShader(gl, sourceCode, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);
  return shader;
}

var VSHADER_SOURCE_CODE = "\n\tattribute vec4 a_Position;\n\tvoid main() {\n\t\tgl_Position = a_Position;\n\t}\n";
var FSHADER_SOURCE_CODE = "\n\tvoid main() {\n\t\tgl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\t}\n";

function initVertexBuffers(gl) {
  // 定义顶点坐标，格式是Float32Array 类型数组
  var vertices = new Float32Array([-1, 1, -1, -1, 1, -1]); // 创建缓冲区，缓冲区我的理解是js将数据存在里面，着色器才可以拿的到数据

  var vertexBuffer = gl.createBuffer(); // 绑定缓存区到当前webgl渲染上下文

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 将坐标值传入缓冲区

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 获取a_Position在缓冲区的地址，目的是确定传入的坐标应用到顶点着色器中的哪一个变量

  var a_position = gl.getAttribLocation(gl.program, 'a_Position'); // 给a_position传递坐标值
  // vertexAttribPointer第一个参数就是接收坐标值的变量位置。
  // 第二个参数告诉每次取几个坐标
  // 第三个参数是用于确定数据的格式
  // 第四个参数 指定当被访问时，固定点数据值是否应该被归一化（GL_TRUE）或者直接转换为固定点值（GL_FALSE）；
  // 第五个参数说明数据存储的方式，单位是字节。0表示一个属性的数据是连续存放的，非0则表示同一个属性在数据中的间隔大小。也就是一个顶点的数据占用了多少字节。
  // 第六个参数属性在缓冲区的偏移值，单位是字节。0表示从头开始读取。
  // 第四，五，六个参数，我暂时还不能理解是干嘛的。。。

  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0); // 让顶点着色器的a_position可以从缓冲区中拿数据

  gl.enableVertexAttribArray(a_position); // 这里返回的3是为了指定有多少个顶点

  return 3;
}
},{"./globalMap":"../src/globalMap.ts"}],"../index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index_1 = require("./src/index");

index_1.Render('#root', {
  style: "width: 100vw;height: 100vh"
});
},{"./src/index":"../src/index.ts"}],"../node_modules/_parcel@1.12.4@parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33189" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/_parcel@1.12.4@parcel/src/builtins/hmr-runtime.js","../index.ts"], null)
//# sourceMappingURL=/webgl.eee185f8.js.map