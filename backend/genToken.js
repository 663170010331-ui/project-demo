import 'dotenv/config'
import jwt from 'jsonwebtoken'

const token = jwt.sign({ id: 1, role: 'citizen' }, process.env.JWT_SECRET, { expiresIn: '7d' })
console.log(token)