const Rx = require('rxjs/Rx')
const Emitter = require('event-emitter')

const emitter = new Emitter()

// 本来はDOMのクリックイベントなどを監視するが、CLIで動かすためにevent-emitterを使う
const click$ = Rx.Observable.fromEvent(emitter, 'click')
const doubleClick$ = click$
  .bufferTime(100) // 100ms以内のイベントを配列にまとめる
  .filter(arr => arr.length > 1) // 配列長が1より大きい = ダブルクリック
  .map(arr => arr.shift() ) // 最初のイベントだけ使いたいので先頭だけ取り出す

click$.subscribe(() => {
  console.log('single click')
})
doubleClick$.subscribe(() => {
  console.log('double click')
})

setTimeout(() => emitter.emit('click'),  50)
setTimeout(() => emitter.emit('click'), 100)
setTimeout(() => emitter.emit('click'), 150)
setTimeout(() => emitter.emit('click'), 300)

// 実行結果
// single click
// single click
// single click
// double click
// single click
