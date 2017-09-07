const Rx = require('rxjs/Rx')
const axios = require('axios')

// 元々はPromiseを返す
// axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010')
//   .then((response) => {console.log(response.data)})
//   .catch((error) => console.log(error))

const ajax$ = Rx.Observable.fromPromise(
    // 東京の天気
    axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010')
  )
  .map((response) => response.data)

ajax$.subscribe((data) => {
  console.log(data.title)
  console.log(data.description.text)
}, (error) => {
  console.log(error)
})

// 実行結果
//
// 東京都 東京 の天気
// ...（その日の天気のテキストが表示される）
