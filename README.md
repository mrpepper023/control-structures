# control-structures

a tiny library aids for using asynchronous functions with various control structures.
[[GitHub Repository](https://github.com/mrpepper023/control-structures)] [[npm registry](https://www.npmjs.com/package/control-structures)]

# Installation

```
> npm install control-structures
```

# how to use
you can use this library with browser contexts or with Node.

## With browser contexts

only you should do is to include a minified script.

```html
<script src="http://your.domain/path-to-script/control-structures.min.js"></script>
```

like this.

```html+coffeescript
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>Async test</title>
</head>
<body>
<h1>test</h1>
<div id="test"></div>

<!--scripts-->
<script src="http://mrpepper023.github.io/lib/control-structures.min.js"></script>
<script type="text/coffeescript">
###
   BEGIN test code
###
(->

  cs._ []
  ,(next)->
  
    console.log 'test1'
    next()
  
  ,(next)->
  
    console.log 'test2'
    next()
  
)()
###
   END test code
###
</script>
<script type="text/javascript" src="http://mrpepper023.github.io/lib/coffee-script.js"></script>
</body>
</html>
```

## With node

you can use this library with a 'require' statement.

```js
var cs = require('control-structures');
```

# functions

this tiny library supports basic 6 types of control structure for asynchronous functions.

## simple continuation

simple continuation ('cs.\_') realize sequential execution of comma separated blocks, and pass arguments from a 'next' function to the next function.

```coffeescript
PRINT = (str,next) -> console.log str; setTimeout(next, 200)

cs._ ['arg1','arg2']
,(next,str1,str2) ->

  PRINT '[1st block]',->
    PRINT 'str1:'+str1,->
      PRINT 'str2:'+str2,->
        next 'err'

,(next,errstr) ->

  PRINT '[2nd block]',->
    PRINT 'errstr:'+errstr,->
      next()

,(next) ->

  PRINT '[last block]',->
    next()
```

## join after if, if-else or switch

simple continuation ('cs.\_') also realize joining after if, if-else or switch.

```coffeescript
PRINT = (str,next) -> console.log str; setTimeout(next, 200)

cs._ ['arg1','arg2']
,(next,str1,str2) ->

  PRINT '[1st block]',->
    if str1 == str2
      PRINT 'str1 and str2:'+str1,->
        next()
    else
      PRINT 'str1:'+str1,->
        PRINT 'str2:'+str2,->
          next()

,(next) ->

  PRINT '[2nd block]',->
    next()
```

## simultaneous each (alike 'each')

you can apply same function to each member of 'Array' or 'Object'.

```coffeescript
PRINT = (str,next) -> console.log str; setTimeout(next, 200)

cs._each [2,3,5,7,11]
,['arg1']
,(val,i,next,str1) ->

  PRINT 'apply',->
    next(val,i)

,(array_of_args_from_next1,array_of_args_from_next2) ->
  
  for num in array_of_args_from_next1
    console.log 'value: '+num.toString()
  for num in array_of_args_from_next2
    console.log 'counter: '+num.toString()
  next()
```

## loop with counter (alike 'for')

loop with counter ('cs.\_for') realize loop 

```coffeescript
PRINT = (str,next) -> console.log str; setTimeout(next, 200)

cs._for 0,((n)-> n<10),((n)-> n+1)
,[]
,(n,_break,_next) ->

  PRINT 'counter: '+n.toString(),->
    _next()

,(n) ->
  
  PRINT 'last counter: '+n.toString(),->
    return
```

## loop around an array or an object (alike 'for {in,of}')

```coffeescript
PRINT = (str,next) -> console.log str; setTimeout(next, 200)

cs._for_in {bro:'ani',sis:'imo',dad:'tousan',mom:'kaasan'}
,[] #first args
,(key,val,_break,_next) ->

  PRINT key+': '+val,->
    _next()

,->
  
  PRINT 'end',->
    return
```

## simple loop (alike 'while')

```coffeescript
PRINT = (str,next) -> console.log str; setTimeout(next, 200)

cs._while [25*25, 25*88]
,(_break,_next,arg1,arg2) ->

  PRINT arg1.toString(),->
    PRINT arg2.toString(),->
      if (arg2 % arg1) == 0
        _break(arg1)
      else
        _next(arg2 % arg1,arg1)

,(arg) ->
  
  PRINT 'result: '+arg.toString(),->
    return
```

## exception handling (alike 'try, throw, catch, finally')

```coffeescript
PRINT = (str,next) -> console.log str; setTimeout(next, 200)

myexc = new cs.exc
myexc._try([]
,->
  #block
  PRINT 'NEST1-1',-> 
    PRINT 'NEST1-2',->
      myexc._try([]
      ,->
        #block
        PRINT 'NEST2-1',->
          PRINT 'NEST2-2',->
            if true
              myexc._throw 'err1'
            else
              PRINT 'NEST2-3',->
                myexc._finally()
      ,['err2','err3']
      ,(_e)->
        #catch
        console.log _e
        PRINT 'NEST2-CATCH',->
          myexc._finally()
      ,(fnext)->
        #finally
        PRINT 'NEST2-FINALLY',->
          fnext()
      ,->
        PRINT 'NEST1-3',->
          myexc._finally()
      )
,['err1']
,(_e)->
  #catch
  console.log _e
  PRINT 'NEST1-CATCH',->
    myexc._finally()
,(fnext)->
  #finally
  PRINT 'NEST1-FINALLY',
    fnext()
,next)
```

## y combinator

you can make an recursive function from anonymous one.

```coffeescript
dummy = null
index = 10
(cs.y (func) ->
  return (dummy)->
    index -= 1
    A ->
      PRINT index.toString(),->
        if index == 0
          return next()
        else
          func(dummy)
)(dummy)
```
