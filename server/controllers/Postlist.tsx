import type { NextApiRequest, NextApiResponse } from 'next'
import { validateEmail } from '../../utils/emailValidation'
import { prismaInstance } from '../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {

  const {
    email = '',
  } = req.body

  console.log('here', email)

  if (!email) {
    return res.status(400).send('missing email')
  }

  if (!validateEmail(email)) {
    return res.status(400).send('invalid email')
  }

  prismaInstance.postlist.create({
    data: {
      email: email
    }
  })

  console.log('and now here')

  return res.status(200).send('success')
}
