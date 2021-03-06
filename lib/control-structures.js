
/*
   Copyright (c) 2015 Michio Yokomizo (mrpepper023) 
   control-structures.js is released under the MIT License, 
   see https://github.com/mrpepper023/control-structures
   
   you want to use this library in same namespace with node.js as with web-browser,
   include this library like 'var cs = require('control-structures');'
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(root, factory) {
  if (typeof FORCE_CLIENTSIDE !== "undefined" && FORCE_CLIENTSIDE !== null) {
    return root.cs = factory();
  } else if (typeof define === 'function' && define.amd) {
    return define([], factory);
  } else if (typeof exports === 'object') {
    return module.exports = factory();
  } else {
    return root.cs = factory();
  }
})(this, function() {
  var a, exc;
  a = function(g) {
    return [].slice.call(g);
  };
  return {

    /*
       y combinator
     */
    y: function(func) {
      return (function(p) {
        return function() {
          return func(p(p)).apply(this, arguments);
        };
      })(function(p) {
        return function() {
          return func(p(p)).apply(this, arguments);
        };
      });
    },

    /*
       simple continuation
       （継続のネストが深くなりすぎるのを防ぐため、
       　または、if,switchの後、容易に合流するために用います）
       
       _(firstargs,func1,func2,...)
          引数に取った非同期関数を順次実行します
          firstargs
             func1に渡す引数を配列に納めたものです
             [arg1,arg2]を渡すと、func1(func2,arg1,arg2)が呼ばれます
             この配列の要素数は可変です
          func1(next,...)
             最初に実行する関数です。次へ進むときはこの関数内でnextを呼びます。
             next(arg3,arg4) を実行すると、func2(func3,arg3,arg4)が呼ばれます
             この引数の要素数は可変です
          func2(next,...)
             以下、同様に好きな回数だけ続けられます。
     */
    _: function() {
      var args, firstargs;
      args = a(arguments);
      firstargs = args.shift();
      return (this.y(function(func) {
        return function() {
          var arg, passargs;
          arg = args.shift();
          if (arg != null) {
            passargs = a(arguments);
            passargs.unshift(func);
            return arg.apply(this, passargs);
          }
        };
      })).apply(this, firstargs);
    },

    /*
       Each (simultaneous)
       
       _each(obj, applyargs_array, applyfunc, endfunc)
          ArrayまたはObjectの各要素に、並行して同じ関数を適用します
          obj
             処理するArrayまたはObject
          applyargs_array
             applyfuncに渡すその他の引数を配列にして指定します。
             [arg1,arg2]を指定すると、applyfunc(val,i,next,arg1,arg2)が呼ばれます。
          applyfunc(val,i,next,...)
             各要素に適用する関数です。objがArrayの場合、valは要素、iは序数です。
             処理が終わったらnext(...)を呼び出します。nextの各引数は、配列に代入されて
             endfuncに渡されます。
          applyfunc(val,i,next,...)
             各要素に適用する関数です。objがObjectの場合、keyは要素のキー、valueは要素の値です。
             処理が終わったらnext(...)を呼び出します。nextの各引数は、配列に代入されて
             endfuncに渡されます。
          endfunc(...)
             結果を受け取る関数です。next('foo','bar')が2要素から呼ばれる場合、
             endfunc(['foo','foo'],['bar','bar'])となります。配列内の順序は、各処理の
             終了順です。弁別する必要のある場合、iやkeyをnextの引数に加えて下さい。
     */
    _each: function(obj, applyargs_array, applyfunc, endfunc) {
      return (function(nextc) {
        var i, isarr, j, key, len, next, num, results, results1, val;
        isarr = 'Array' === Object.prototype.toString.call(obj).slice(8, -1);
        num = 0;
        next = nextc();
        if (isarr) {
          results = [];
          for (i = j = 0, len = obj.length; j < len; i = ++j) {
            val = obj[i];
            num++;
            results.push(applyfunc.apply(this, [
              val, i, function() {
                return next.apply(this, [num, endfunc].concat(a(arguments)));
              }
            ].concat(applyargs_array)));
          }
          return results;
        } else {
          results1 = [];
          for (key in obj) {
            val = obj[key];
            num++;
            results1.push(applyfunc.apply(this, [
              key, val, function() {
                return next.apply(this, [num, endfunc].concat(a(arguments)));
              }
            ].concat(applyargs_array)));
          }
          return results1;
        }
      })(function() {
        var count, result;
        count = 0;
        result = [];
        return function(num, next) {
          var arg, args, i, j, len;
          count++;
          if (arguments.length > 0) {
            args = a(arguments);
            args.shift();
            args.shift();
            for (i = j = 0, len = args.length; j < len; i = ++j) {
              arg = args[i];
              if (result.length <= i) {
                result.push([]);
              }
              result[i].push(arg);
            }
          }
          if (count === num) {
            return next.apply(this, result);
          }
        };
      });
    },

    /*
       for Loop
       
       _for(i, f_judge, f_iter, firstarg_array, loopfunc, endfunc)
          初期値・条件・イテレータを用いて、loopfuncを繰り返します。
          i
             カウンタの初期値です。
          f_judge(n) 返値=true,false
             カウンタに対する条件です。falseが返るとループが終了します。
             ※この関数は同期関数でなければなりません。
          f_iter(n) 返値=カウンタ値
             カウンタのイテレータです。引数がカウンタの現在の値で、返値を返すと、
             カウンタに代入されます。
             ※この関数は同期関数でなければなりません。
          firstarg_array
             loopfuncへの初回の引数を、配列で示します。
             [arg1,arg2]を渡すと、loopfunc(n,break,next,arg1,arg2)が呼ばれます。
          loopfunc(n,_break,_next,...)
             繰り返し実行する内容です。nはカウンタの現在値です。
             続行する場合、_next(...)を呼び出します。_nextの引数は、次回のloopfuncの
             呼び出しの際、引き渡されます。たとえば、_next(arg3,arg4)を呼び出せば、
             loopfunc(n,next,arg3,arg4)が呼ばれます。
             繰り返しを中断する場合、_break(...)を呼び出します。すると、
             endfunc(n,...)が呼び出されます。
          endfunc(n,...)
             繰り返しの終了後に実行される関数です。nは終了時のカウンタの値です。
     */
    _for: function(i, f_judge, f_iter, firstarg_array, loopfunc, endfunc) {
      return (this.y(function(func) {
        return function() {
          if (f_judge(i)) {
            return loopfunc.apply(this, [
              i, function() {
                return endfunc.apply(this, [i].concat(a(arguments)));
              }, function() {
                i = f_iter(i);
                return func.apply(this, arguments);
              }
            ].concat(a(arguments)));
          } else {
            return endfunc.apply(this, [i].concat(a(arguments)));
          }
        };
      })).apply(this, firstarg_array);
    },

    /*
       for in Array or Object
       
       _for_in(obj, firstargs, loopfunc, endfunc)
          firstargs
             初回のloopfuncの引数を配列にして示します。
             [arg1,arg2]が渡されると、loopfunc(key,val,_break,_next,arg1,arg2)が呼ばれます。
          loopfunc(key,val,_break,_next,...)
             繰り返し実行する関数です。Objectの場合、key,valが得られます
             続行する場合_next(...)、中断する場合_break(...)を呼び出します。
             _nextの引数は、次回のloopfuncに渡されます。
             _breakの引数は、endfuncに渡されます。
          endfunc(...)
             繰り返しの終了時に呼ばれます。
     */
    _for_in: function(obj, firstargs, loopfunc, endfunc) {
      var i, indexlimit, isarr;
      i = -1;
      isarr = 'Array' === Object.prototype.toString.call(obj).slice(8, -1);
      if (isarr) {
        indexlimit = obj.length;
      } else {
        indexlimit = Object.keys(obj).length;
      }
      return (this.y(function(func) {
        return function() {
          var key, value;
          i += 1;
          if (i < indexlimit) {
            if (isarr) {
              return loopfunc.apply(this, [
                obj[i], i, function() {
                  return endfunc.apply(this, arguments);
                }, function() {
                  return func.apply(this, arguments);
                }
              ].concat(a(arguments)));
            } else {
              key = Object.keys(obj)[i];
              value = obj[key];
              return loopfunc.apply(this, [
                key, value, function() {
                  return endfunc.apply(this, arguments);
                }, function() {
                  return func.apply(this, arguments);
                }
              ].concat(a(arguments)));
            }
          } else {
            return endfunc.apply(this, arguments);
          }
        };
      })).apply(this, firstargs);
    },

    /*
       while Loop
       
       _while(firstarg_array, loopfunc, endfunc)
          終了条件のみを指定した繰り返しを行います。リトライループなどです。
          firstarg_array
             初回のf_judge, loopfuncの引数を配列にして示します。
             [arg1,arg2]が渡されると、loopfunc(_break,_next,arg1,arg2)が呼ばれます。
          loopfunc(_break,_next,...)
             繰り返し行う非同期処理です。
             繰り返しを中断するときは_break(...)を呼ぶと、endfunc(...)が呼ばれます。
             繰り返しを続行するときは_next(...)を呼ぶと、loopfunc(_break,_next,arg1,arg2)が呼ばれます。
          endfunc(...)
             次の処理です。上記の通り、引数を受け取ることができます。
     */
    _while: function(firstarg_array, loopfunc, endfunc) {
      return (this.y(function(func) {
        return function() {
          var passargs;
          passargs = a(arguments);
          passargs.unshift(function() {
            return func.apply(this, arguments);
          });
          passargs.unshift(function() {
            return endfunc.apply(this, arguments);
          });
          return loopfunc.apply(this, passargs);
        };
      })).apply(this, firstarg_array);
    },

    /*
       exception handling
       
       myexc = new exc
          例外管理オブジェクトを生成します。ここではmyexcとします。
       myexc._try(block_args_array,f_block,e_array,f_catch,f_finally,f_next)
          例外スコープを開始します。実処理はblock内、例外処理はf_catch内、
          終了処理はf_finally内で行い、f_nextへと進みます。
          f_finally内で_throwすると、当該終了処理は完了せずに例外送出します
          block_args_array
             blockに渡す引数を、配列にして指定します。
             [arg1,arg2]を渡すと、f_block(arg1,arg2)が呼ばれます。
          f_block(...)
             実処理を行うスコープです。このexc例外を発生しうる関数を
             呼び出すときはmyexcを渡して下さい。次へ進むときは
             myexc._finally(...)を呼べば、f_finally(next,...)が呼ばれます。
          e_array
             f_catchで処理する例外の種類を列挙した配列です。
             可読性のある文字列をお勧めします。
          f_catch(_e,...)
             _throwに渡された例外の種類と、その他の_throwに渡された引数が
             得られます。e_arrayで列挙した例外は全て処理して下さい。
             処理を終えたらmyexc._finally(...)を呼んで下さい。f_blockと同様です。
          f_finally(next,...)
             終了処理を簡潔に行います。処理を終えたら、next(...)を呼んで下さい。
             f_next(...)が呼ばれます。基本的にはmyexcを引数に指定して下さい。
          f_next(...)
             次の処理を行う関数です。
       myexc._throw(_e,...)
          例外を発生させます。引数はf_catchに渡されます。
       myexc._finally(...)
          例外スコープのスタックをpopして、ユーザ終了処理を呼び出します。
          引数はf_finallyに渡されます。
     */
    exc: exc = (function() {
      var _stack, _w, fa, y;

      _stack = [];

      function exc() {
        this._throw = bind(this._throw, this);
      }

      exc.prototype._try = function(block_args_array, block, e_array, arg_catch, arg_finally, arg_next) {
        _stack.push({
          e_array: e_array,
          _catch: arg_catch,
          _finally: arg_finally,
          next: arg_next
        });
        return block.apply(this, block_args_array);
      };

      fa = function() {
        var stackpop;
        if (_stack.length > 0) {
          stackpop = _stack.pop();
          return stackpop._finally.apply(this, arguments);
        } else {

        }
      };

      exc.prototype._finally = function() {
        var stackpop;
        if (_stack.length > 0) {
          stackpop = _stack.pop();
          if (stackpop.next != null) {
            stackpop._finally.apply(this, [stackpop.next].concat(a(arguments)));
          } else {
            stackpop._finally.apply(this, [function() {}].concat(a(arguments)));
          }
        } else {

        }
      };

      y = function(func) {
        return (function(p) {
          return function() {
            return func(p(p)).apply(this, arguments);
          };
        })(function(p) {
          return function() {
            return func(p(p)).apply(this, arguments);
          };
        });
      };

      _w = function(loopfunc, endfunc) {
        return (y(function(func) {
          return function() {
            return loopfunc(endfunc, func);
          };
        }))();
      };

      exc.prototype._throw = function(_e) {
        var catchset, uncaught;
        catchset = {};
        uncaught = false;
        return _w((function(_this) {
          return function(_break, _next) {
            var passargs, result;
            catchset = _stack.pop();
            if (catchset != null) {
              _stack.push(catchset);
              result = catchset.e_array.indexOf(_e);
              if (result !== -1) {
                catchset._catch.apply(_this, [_e].concat(a(arguments)));
              } else {
                if (arguments.length <= 2) {
                  return fa.call(_this, _next);
                } else {
                  passargs = a(arguments);
                  passargs.shift();
                  passargs.shift();
                  passargs.unshift(_next);
                  return fa.apply(_this, passargs);
                }
              }
            } else {
              uncaught = true;
              return _break();
            }
          };
        })(this), function() {
          if (uncaught) {
            console.log('uncaught exception: ' + _e.toString());
            process.exit(1);
          }
        });
      };

      return exc;

    })()
  };
});


/*
   todo:
      引数チェック
         firstarg_arrayが配列でないor(null)のときの処理など
         関数を取る場合のチェック＆nullチェック（devのみ？）
      返値チェック
         イテレータや終了条件など、同期関数の返値チェック
      ループ関数に同期関数を入れられたときのstack overflowを避けるか分かりやすく
 */
