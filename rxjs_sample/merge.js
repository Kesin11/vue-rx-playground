const Rx = require('rxjs/Rx')
const Emitter = require('event-emitter')

const emitter = new Emitter()

const event1$ = Rx.Observable.fromEvent(emitter, 'event1')
const event2$ = Rx.Observable.fromEvent(emitter, 'event2')
const mergedEvent$ = Rx.Observable.merge(event1$, event2$)
  .debounceTime(500)

mergedEvent$.subscribe((x) => {
  console.log(x)
  // 実際は通知をGUIで出したり、ajaxでサーバーとデータの同期をしたりなど
  // notify()
  // axios.post('...')
})

emitter.emit('event1', 1)
emitter.emit('event2', 10)

// 実行結果
// (500ms待つ)
//
// 10
