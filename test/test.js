// Generated by CoffeeScript 1.9.2
(function() {
  var PRINT, cs;

  cs = require('../lib/control-structures');

  PRINT = function(str, func) {
    console.log('PRINT: ' + str);
    return setTimeout(func, 500);
  };

  cs._([], function(next) {


    console.log('#each test');

    PRINT = function(str, next) {
      console.log(str);
      return setTimeout(next, 200);
    };
    
    cs._each([2, 3, 5, 7, 11], ['arg1'], function(val, i, next, str1) {
      PRINT('apply', function() {
        next(val, i);
      });
    }, function(array_of_args_from_next1, array_of_args_from_next2) {
      var j, k, len, len1, num;
      for (j = 0, len = array_of_args_from_next1.length; j < len; j++) {
        num = array_of_args_from_next1[j];
        console.log('value: ' + num.toString());
      }
      for (k = 0, len1 = array_of_args_from_next2.length; k < len1; k++) {
        num = array_of_args_from_next2[k];
        console.log('counter: ' + num.toString());
      }
      return;
    });


  }, function(next) {


    console.log('#for test');

    PRINT = function(str, next) {
      console.log(str);
      return setTimeout(next, 200);
    };

    cs._for(0, (function(n) {return n < 10;}), (function(n) {return n + 1;})
    , []
    , function(n, _break, _next) {
      PRINT('counter: ' + n.toString(), function() {
        _next();
      });
    }, function(n) {
      PRINT('last counter: ' + n.toString(), function() {
        return;
      });
    });


  }, function(next) {


    console.log('#for-in test');

    PRINT = function(str, next) {
      console.log(str);
      return setTimeout(next, 200);
    };

    cs._for_in({
      bro: 'ani',
      sis: 'imo',
      dad: 'tousan',
      mom: 'kaasan'
    }
    , ['first']
    , function(key, val, _break, _next, arg) {
      PRINT(key + ': ' + val, function() {
        PRINT(arg, function() {
          _next('notfirst');
        });
      });
    }, function() {});

  }, function(next) {


    console.log('#exc test');
    
    PRINT = function(str, next) {
      console.log(str);
      return setTimeout(next, 200);
    };
    
    var myexc;
    myexc = new cs.exc;
    myexc._try([], function() {
      PRINT('NEST1-1', function() {
        PRINT('NEST1-2', function() {
          myexc._try([], function() {
            PRINT('NEST2-1', function() {
              PRINT('NEST2-2', function() {
                if (true) {
                  myexc._throw('err1');
                } else {
                  PRINT('NEST2-3', function() {
                    myexc._finally();
                  });
                }
              });
            });
          }, ['err2', 'err3']
          , function(_e) {
            console.log(_e);
            PRINT('NEST2-CATCH', function() {
              myexc._finally();
            });
          }, function(fnext) {
            PRINT('NEST2-FINALLY', function() {
              fnext();
            });
          }, function() {
            PRINT('NEST1-3', function() {
              myexc._finally();
            });
          });
        });
      });
    }, ['err1']
    , function(_e) {
      console.log(_e);
      PRINT('NEST1-CATCH', function() {
        myexc._finally();
      });
    }, function(fnext) {
      PRINT('NEST1-FINALLY', fnext());
    }, function() {});


  }, function(next) {


    console.log('#while test');

    PRINT = function(str, next) {
      console.log(str);
      return setTimeout(next, 200);
    };

    cs._while([25 * 25, 25 * 88], function(_break, _next, arg1, arg2) {
      PRINT(arg1, function() {
        PRINT(arg2, function() {
          if ((arg2 % arg1) === 0) {
            _break(arg1);
          } else {
            _next(arg2 % arg1, arg1);
          }
        });
      });
    }, function(arg) {
      PRINT('result: ' + arg.toString(), function() {});
    });


  }, function(next) {


    console.log('#if,switch test');

    PRINT = function(str, next) {
      console.log(str);
      return setTimeout(next, 200);
    };

    cs._(['arg1', 'arg2'], function(next, str1, str2) {
      PRINT('[1st block]', function() {
        if (str1 === str2) {
          PRINT('str1 and str2:' + str1, function() {
            next();
          });
        } else {
          PRINT('str1:' + str1, function() {
            PRINT('str2:' + str2, function() {
              next();
            });
          });
        }
      });
    }, function(next) {
      PRINT('[2nd block]', function() {
        next('arg', 'arg');
      });
    }, function(next, str1, str2) {
      PRINT('[3rd block]', function() {
        if (str1 === str2) {
          PRINT('str1 and str2:' + str1, function() {
            next();
          });
        } else {
          PRINT('str1:' + str1, function() {
            PRINT('str2:' + str2, function() {
              next();
            });
          });
        }
      });
    }, function(next) {
      PRINT('[last block]', function() {
        next();
      });
    });


  }, function(next) {


    console.log('#simple test');

    PRINT = function(str, next) {
      console.log(str);
      return setTimeout(next, 200);
    };

    cs._(['arg1', 'arg2'], function(next, str1, str2) {
      PRINT('[1st block]', function() {
        PRINT('str1:' + str1, function() {
          PRINT('str2:' + str2, function() {
            next('err');
          });
        });
      });
    }, function(next, errstr) {
      PRINT('[2nd block]', function() {
        PRINT('errstr:' + errstr, function() {
          next();
        });
      });
    }, function(next) {
      PRINT('[last block]', function() {
        next();
      });
    });


  }, function(next) {
    return console.log('#exc test');
  }, function(next) {
    return console.log('#exc test');
  }, function(next) {
    return console.log('#exc test');
  });

}).call(this);
