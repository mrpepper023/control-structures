cs = require('../lib/control-structures')

PRINT = (str,func) -> console.log 'PRINT: '+str; setTimeout func, 500

cs._ []
,(next) ->

  console.log '#each test'

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

,(next) ->

  console.log '#for test'

  PRINT = (str,next) -> console.log str; setTimeout(next, 200)

  cs._for 0,((n)-> n<10),((n)-> n+1)
  ,[]
  ,(n,_break,_next) ->

    PRINT 'counter: '+n.toString(),->
      _next()

  ,(n) ->
  
    PRINT 'last counter: '+n.toString(),->
      next()

,(next) ->

  console.log '#for-in test'

  PRINT = (str,next) -> console.log str; setTimeout(next, 200)

  cs._for_in {bro:'ani',sis:'imo',dad:'tousan',mom:'kaasan'}
  ,['first']
  ,(key,val,_break,_next,arg) ->

    PRINT key+': '+val,->
      PRINT arg,->
        _next('notfirst')
  ,->
    PRINT 'end',->
      next()

,(next) ->

  console.log '#exc test'
  
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
                myexc._throw 'err2'
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
    PRINT 'NEST1-FINALLY',->
      fnext()
  ,next)

,(next) ->

  console.log '#while test'
  
  PRINT = (str,next) -> console.log str; setTimeout(next, 200)

  cs._while [25*25, 25*88]
  ,(_break,_next,arg1,arg2) ->

    PRINT arg1,->
      PRINT arg2,->
        if (arg2 % arg1) == 0
          _break(arg1)
        else
          _next(arg2 % arg1,arg1)

  ,(arg) ->
  
    PRINT 'result: '+arg.toString(),->
      return

,(next) ->

  console.log '#if,switch test'
  
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
      next('arg','arg')

  ,(next,str1,str2) ->

    PRINT '[3rd block]',->
      if str1 == str2
        PRINT 'str1 and str2:'+str1,->
          next()
      else
        PRINT 'str1:'+str1,->
          PRINT 'str2:'+str2,->
            next()

  ,(next) ->

    PRINT '[last block]',->
      next()

,(next) ->

  console.log '#simple test'
  
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

,(next) ->

  console.log '#exc test'
  

,(next) ->

  console.log '#exc test'
  

,(next) ->

  console.log '#exc test'
  

