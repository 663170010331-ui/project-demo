import liff from '@line/liff'

const LIFF_ID = import.meta.env.VITE_LIFF_ID

let initPromise = null

// liff.init() must only run once per page load — cache the promise so
// multiple components mounting at once don't call it twice.
function initLiff() {
  if (!initPromise) {
    if (!LIFF_ID) {
      return Promise.reject(new Error('VITE_LIFF_ID is not set — check your .env / Vercel env vars'))
    }
    initPromise = liff.init({ liffId: LIFF_ID })
  }
  return initPromise
}

// Called by LiffRoute on mount. Returns { accessToken, profile } once the
// user is confirmed logged in with LINE. If the user isn't logged in yet,
// this triggers liff.login() which redirects the page to LINE's login
// screen — in that case the function never resolves (page navigates away),
// which is expected.
export async function getLiffAuth() {
  await initLiff()

  if (!liff.isLoggedIn()) {
    liff.login() // redirects; execution stops here
    return null
  }

  const accessToken = liff.getAccessToken()
  const lineProfile = await liff.getProfile()

  return {
    accessToken,
    profile: {
      userId: lineProfile.userId,
      displayName: lineProfile.displayName,
      pictureUrl: lineProfile.pictureUrl,
    },
  }
}

export { liff }
