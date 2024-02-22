export const getToken = async (
  channelName: string,
  memberName: string,
): Promise<string> => {
  if (process.env.AUTH_TOKEN_SERVER === "")
    throw new Error("AuthTokenServer is not setting.");

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
  });

  const { authToken } = await response.json();

  return authToken;
};
