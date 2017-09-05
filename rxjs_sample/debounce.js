const Rx = require('rxjs/Rx')
const _ = require('underscore')
const Emitter = require('event-emitter')

const emitter = new Emitter()

// Rxjs
const debounce$ = Rx.Observable.fromEvent(emitter, 'click')
  .debounceTime(200)
debounce$.subscribe(() => {
  console.log('observable click')
})

// Promise + underscorejs
new Promise(resolve => {
  emitter.on('click', _.debounce(resolve, 200))
}).then(() => {
  console.log('promise click')
})

setTimeout(() => emitter.emit('click'),  50)
setTimeout(() => emitter.emit('click'), 100)

// 実行結果
//
// promise click
// observable click
