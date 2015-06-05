cs = require('../lib/asynchronous-control-structures')

A = (func) -> console.log 'A'; setTimeout func, 500
B = (func) -> console.log 'B'; setTimeout func, 500
C = (func) -> console.log 'C'; setTimeout func, 500
D = (func) -> console.log 'D'; setTimeout func, 500
E = (func) -> console.log 'E'; setTimeout func, 500
F = (func) -> console.log 'F'; setTimeout func, 500
G = (func) -> console.log 'G'; setTimeout func, 500
H = (func) -> console.log 'H'; setTimeout func, 500
I = (func) -> console.log 'I'; setTimeout func, 500
PRINT = (str,func) -> console.log 'PRINT: '+str; setTimeout func, 500

a = -> console.log 'a'
b = -> console.log 'b'
c = -> console.log 'c'
d = -> console.log 'd'
e = -> console.log 'e'
f = -> console.log 'f'
g = -> console.log 'g'
h = -> console.log 'h'
i = -> console.log 'i'
j = -> console.log 'j'
print = (str) -> console.log 'print: '+str


cs._ ['firstarg1','arg2']
,(next,str1,str2) ->

  console.log 'test1'
  PRINT str1,->
    PRINT str2,->
      C ->
        D ->
          next 'err'

,(next,errstr) ->

  console.log 'test2'
  PRINT errstr,->
    F ->
      G ->
        next()

,(next) ->

  console.log 'test3'
  H ->
    I ->
      next()

