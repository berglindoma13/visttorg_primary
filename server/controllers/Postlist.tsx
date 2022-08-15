import { validateEmail } from '../utils/emailValidation'
import { prismaInstance } from '../lib/prisma'

export const Postlist = async (req: any, res: any): Promise<void> => {

  const {
    postlistEmail = '',
  } = req.body

  console.log('req.body', req.body)

  if (!postlistEmail) {
    console.log('no email')
    return res.status(400).send('Vantar tölvupóst')
  }

  if (!validateEmail(postlistEmail)) {
    console.log('invalid email')
    return res.status(400).send('Netfang ekki gilt')
  }

  prismaInstance.postlist.create({
    data: {
      email: postlistEmail
    }
  })

  return res.status(200).send('success')
}
