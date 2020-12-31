## 課題２

### application/x-www-form-urlencoded

- 一般的に HTML の Form の送信に持ちいられる。
- body の部分に key=value&key=value の形式で URL エンコードされたデータを格納する。

### application/json

- JavaScript を用いた XMLHttpRequest で利用することが出来る。
- データをネストさせることが出来るため、柔軟なデータ表現が可能になる。

### x-www-form-urlencoded と json の剪定基準

form データ形式とは異なり、データをネストさせることが出来るため、柔軟なデータ表現が可能になる。複雑なデータ構造を扱う場合、json を扱うとよい。
逆に、application/x-www-form-urlencoded は form リクエストのデフォルトの MIME タイプで、（[w3.org/TR/html401/interact/forms.html#h-17.13.4](http://w3.org/TR/html401/interact/forms.html#h-17.13.4)) フレームワークによってデフォルトで application/json のデータを対応していない場合があったり、HTML は json データを生成出来ないので JavaScript を用いて XMLHttpRequest を実装する必要があるので、HTML を用いたシンプルな form の場合、application/x-www-form-urlencoded を用いた方が実装がシンプルになって良い。
