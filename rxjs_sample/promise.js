const Rx = require('rxjs/Rx')

// resolved promise
const promise = Rx.Observable.of(1)
  .delay(300)
  .toPromise()

// rejected promise
const rejectedPromise = Rx.Observable
  .throw(new Error('rejected promise'))
  .toPromise()

promise.then(() => { console.log('promise then') })

rejectedPromise
  .then(() => { console.log('this message will be never show') })
  .catch((error) => { console.log(error) })

// 実行結果
//
// Error: rejected promise
//     at Object.<anonymous> (/***************/promise.js:14:10)
//     at Module._compile (module.js:569:30)
//     at Object.Module._extensions..js (module.js:580:10)
//     at Module.load (module.js:503:32)
//     at tryModuleLoad (module.js:466:12)
//     at Function.Module._load (module.js:458:3)
//     at Function.Module.runMain (module.js:605:10)
//     at startup (bootstrap_node.js:158:16)
//     at bootstrap_node.js:575:3
//
// promise then
