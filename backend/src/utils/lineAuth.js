import axios from 'axios'

// Verifies a LIFF access token directly with LINE's servers.
// Docs: https://developers.line.biz/en/reference/line-login/#verify-access-token
export async function verifyLineAccessToken(accessToken) {
  const { data } = await axios.get('https://api.line.me/oauth2/v2.1/verify', {
    params: { access_token: accessToken },
  })
  // data.client_id must match your LIFF channel id — check this in production
  return data // { scope, client_id, expires_in }
}

export async function getLineProfile(accessToken) {
  const { data } = await axios.get('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return data // { userId, displayName, pictureUrl }
}
