
export async function exchangeCodeForToken(backendUrl, code, redirectUri, codeVerifier) {
  const res = await fetch(`${backendUrl}/google/exchange-code/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirectUri, codeVerifier }),
  });

  if (!res.ok) throw new Error("Error al intercambiar el código por token");

  const tokenData = await res.json();
  return tokenData.access_token;
}

export async function getUserInfo(accessToken) {
  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userInfoResponse.ok) throw new Error("Error al obtener información del usuario");

  return await userInfoResponse.json();
}

export async function getAuthorizedUsers(backendUrl) {
  const res = await fetch(`${backendUrl}/authorizedusers/`);
  if (!res.ok) throw new Error("Error al obtener usuarios autorizados");
  return await res.json();
}

export async function handleLoginFlow({ response, request, backendUrl, redirectUri, setUser, navigation, setInvalidUser }) {
  if (response?.type === "success" && request?.codeVerifier) {
    const { code } = response.params;
    const codeVerifier = request.codeVerifier;

    try {
      const accessToken = await exchangeCodeForToken(backendUrl, code, redirectUri, codeVerifier);
      if (!accessToken) throw new Error("No se recibió accessToken");

      const userInfo = await getUserInfo(accessToken);

      const authorizedUsers = await getAuthorizedUsers(backendUrl);

      const foundUser = authorizedUsers.find((u) => u.email === userInfo.email);
      if (foundUser) {
        setUser({
          access_token: accessToken,
          email: userInfo.email,
          movadmin: foundUser.movadmin,
        });
        navigation.replace("Tabs", { initialTab: "Contracts" });
      } else {
        setInvalidUser(true);
      }
    } catch (error) {
      console.log("Error en login:", error);
      throw error;
    }
  }
}
