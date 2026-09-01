import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

// Pushes a plain-text message into a specific LINE user's chat with the OA.
// Docs: https://developers.line.biz/en/reference/messaging-api/#send-push-message
export async function pushLineMessage(lineUserId, text) {
  if (!lineUserId || !process.env.LINE_CHANNEL_ACCESS_TOKEN) return null
  return axios.post(
    'https://api.line.me/v2/bot/message/push',
    { to: lineUserId, messages: [{ type: 'text', text }] },
    { headers: { Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }
  )
}