**SOLID 原則の各要素について**

- S(Single Responsibility Principle): 単一責任の原則

「クラスが担う責任は、たったひとつに限定すべき」という設計原則
-> 一つのクラスが責務として対応すべきアクターは 1 つであるべきという考え
例: 商品クラスがあった場合、管理者と購入者によって必要な要件が変わるので、商品クラスとして定義するのではなく、管理者の商品クラスと購入者の商品クラスを別々で作る(商品という大きな枠で考えずに細分化させる？)

参考:
https://qiita.com/MinoDriven/items/76307b1b066467cbfd6a  
https://www.ogis-ri.co.jp/otc/hiroba/others/OOcolumn/single-responsibility-principle.html

- O(Open/Closed principle): 開放閉鎖の原則

「クラス・モジュール・関数は拡張に対して開かれて、修正に対して閉じられていなければならない」という原則
-> 変更が発生した場合に既存のコードには修正を加えずに、新しくコードを追加するだけで対応すること

参考:
https://medium.com/eureka-engineering/go-open-closed-principle-977f1b5d3db0  
https://qiita.com/ryo2132/items/01f0fcb8ff27353f8ecb

- L(Liskov substitution principle): リスコフの置換原則

「派生クラスはその元となったベースクラスと置換が可能でなければならない」という原則
-> サブクラスをスーパークラスのように扱える状態のこと(メリットがあまり分からない...) is_a の関係

- I(Interface segregation principle): インターフェース分離の原則

「クライアントは自身が使用しないメソッドへの依存を強制してはいけない」という原則
-> 不必要な依存関係を無くすということ

参考:
https://zenn.dev/k_sato/articles/98f4b15747e191#i%3A-%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E5%88%86%E9%9B%A2%E3%81%AE%E5%8E%9F%E5%89%87

- D(Dependency inversion principle): 依存性逆転の原則

「上位モジュールは下位モジュールに依存してはならず、両方とも抽象に依存すべきである」という原則
-> 下位モジュールの変更に上位モジュールが影響を受けないようにするということ(抽象が具体に依存するのではなく、具体は抽象に依存する)

参考:
https://medium.com/eureka-engineering/go-dependency-inversion-principle-8ffaf7854a55

**単一責任の原則と、ただのファイル分解の違い**

- ファイルを目的もなく分解してしまうと情報が散らばってしまうため、情報が整理出来なくなり、意図しない変更などが起こってしまうことで、バグの発生に繋がる。単一責任の原則に従うことよって、意味のあるファイル名・クラス名に整理することで、意図しない変更を防ぐことが出来、柔軟にソフトウェアを変更することが出来るようになる。

**Open-Closed-Principle の実例**

※ 後で TypeScript に書き直します...。

```rb
# Badパターン(order_typeが増える度に新しい処理の追加が必要になる)
def order(order_types)
  order_types.each do |order_type|
    case order_type
    when "take_out"
      # テイクアウト専門処理
    when "delivery"
      # 配達専門処理
    else
      #それ以外の処理
    end
  end
end

order_types = ["take_out", "delivery", "store_order"]
order(order_types)


# Goodパターン(新しいorder_typeが増えてもクラスを追加するだけで良くなった)
class Order
  def execution_order(order_types)
    order_types.each do |order_type|
      order_type.execution_order(self)
    end
  end
end

class TakeOut
  def execution_order(order)
    #テイクアウト用の処理
    puts order
  end
end

class Delivery
  def execution_order(order)
    #配達用の処理
    puts order
  end
end

class StoreOrder
  def execution_order(order)
    #店舗用の処理
    puts order
  end
end

order_types = [TakeOut.new, Delivery.new]
Order.new.execution_order(order_types)
```

**リスコフの置換原則に違反した場合の不都合**

- 基底クラスへの参照を使い、派生クラスに関する知識を持たなければならなくなるため、新たな派生クラスを追加する度に全体のコードを修正しなければいけなくなる。

参考:
https://ja.wikipedia.org/wiki/%E3%83%AA%E3%82%B9%E3%82%B3%E3%83%95%E3%81%AE%E7%BD%AE%E6%8F%9B%E5%8E%9F%E5%89%87  
https://qiita.com/yuki153/items/142d0d7a556cab787fad

**インターフェースを用いる事で、設計上どのようなメリットがあるでしょうか？**

- インターフェイスを細かく分けることで、各クラスは実際に自分自身が利用するメソッドだけに依存するようになるため、他のクラスの変更の影響を最小限に抑えることが出来ます。

参考:
https://zenn.dev/chida/articles/882aad07effa5c

**依存性逆転の原則をいつ使うか？**

- オニオンアーキテクチャの設計を例に出すと、ドメインオブジェクトがインフラ層の特定の技術領域(RDB or NoSQL or ORM など)に依存してしまうことを防ぐために依存性逆転の原則を用いて、インターフェイスに依存させることでドメインオブジェクトを独立性を高めています。

参考:
https://qiita.com/little_hand_s/items/2040fba15d90b93fc124
