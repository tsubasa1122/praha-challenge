import { useEffect, useState } from "react";
const REACT_REPOSITORY_API_URL = "https://api.github.com/repos/facebook/react";

export const FetchComponent = () => {
  const [data, setData] = useState({
    subscribers: 0,
    stars: 0,
  });

  const fetchReactRepositoryData = async (abortController: AbortController) => {
    const response = await fetch(REACT_REPOSITORY_API_URL, {
      signal: abortController.signal,
    });
    const newData = await response.json();
    setData({
      subscribers: newData.subscribers_count,
      stars: newData.stargazers_count,
    });
  };

  // ここでuseEffectを使ってstar数を取得してみましょう!
  useEffect(() => {
    const abortController = new AbortController();
    fetchReactRepositoryData(abortController);
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <p>ここにReactのGitHubレポジトリに付いたスターの数を表示してみよう</p>
      <p>{data.stars} stars</p>
    </div>
  );
};
