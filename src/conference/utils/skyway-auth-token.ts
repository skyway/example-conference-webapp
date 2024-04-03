const RETRY_NUM = 5;

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const getToken = async (
  channelName: string,
  memberName: string,
): Promise<string> => {
  if (process.env.AUTH_TOKEN_SERVER === "")
    throw new Error("AuthTokenServer is not setting.");

  for (let i = 0; i < RETRY_NUM; i++) {
    const response = await fetch(`${process.env.AUTH_TOKEN_SERVER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelName: channelName,
        memberName: memberName,
        // SkyWay Auth Tokenを払い出すサーバに
        // https://github.com/skyway/authentication-samples をそのまま使った時に付与するセキュリティ情報
        // セキュリティを高める処理は適宜変更してください
        sessionToken: "4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID",
      }),
    }).catch((err: Error) => {
      return err;
    });

    if (response instanceof Response) {
      const { authToken } = await response.json();
      return authToken;
    } else if (i === RETRY_NUM - 1) {
      // to avoid last sleep
      throw response;
    }

    // exponential backoff
    const sleepMs = 2 ** i * 1000;
    await sleep(sleepMs);
  }

  // unreachable, but to satisfy TypeScript, ts(2366)
  throw new Error("Unexpected error in getToken.");
};
