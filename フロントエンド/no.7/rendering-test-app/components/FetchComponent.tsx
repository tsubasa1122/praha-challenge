import { VFC } from 'react'

type Props = {
  data: {
    subscribers: number
    stars: number
  }
}

const FetchComponent: VFC<Props> = ({ data }) => { 

  // ここでuseEffectを使ってstar数を取得してみましょう!
  // useEffect(() => {
  //   const abortController = new AbortController();
  //   fetchReactRepositoryData(abortController);
  //   return () => {
  //     abortController.abort();
  //   };
  // }, []);

  return (
    <div>
      <p>ここにReactのGitHubレポジトリに付いたスターの数を表示してみよう</p>
      <p>{data.stars} stars</p>
    </div>
  );
};

export default FetchComponent
