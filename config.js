const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const SCOPE = "user";
const client_id = "b46bd86728ad4ba92e49";

module.exports = {
  github: {
    request_token_url: "https://github.com/login/oauth/access_token",
    client_id,
    client_secret: "22e88a0ebb9c1d5b36f21f8a0074fd10989f40cf"
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
};

//token 2b0efffa3594a0949d74fc6ec1972f471e01276c&scope
