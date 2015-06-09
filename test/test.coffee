cs = require('../lib/control-structures')

PRINT = (str,func) -> console.log 'PRINT: '+str; setTimeout func, 500

cs._ []
,(next) ->

  console.log '#each test'

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

  cs._for 0,((n)-> n<10),((n)-> n+1)
  ,[]
  ,(n,_break,_next) ->

    PRINT 'counter: '+n.toString(),->
      _next()

  ,(n) ->
  
    PRINT 'last counter: '+n.toString(),->
      next()

,(next) ->

  console.log '#for in test'

  cs._for_in {bro:'ani',sis:'imo',dad:'tousan',mom:'kaasan'}
  ,['first']
  ,(key,val,_break,_next,arg) ->

    PRINT key+': '+val,->
      PRINT arg,->
        _next('notfirst')

,(next) ->

    console.log '#exc test'
    
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

,(next) ->


,(next) ->


,(next) ->


