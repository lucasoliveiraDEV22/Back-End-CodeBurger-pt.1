import * as Yup from "yup"
import authConfig from "../../config/auth"
import User from "../models/User"
import jwt from "jsonwebtoken"

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailorPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ error: "Make sure your password or email is correct" })
    }
    if (!(await schema.isValid(request.body))) {
      return userEmailorPasswordIncorrect()
    }

    const { email, password } = request.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      return userEmailorPasswordIncorrect()
    }
    if (!(await user.checkPassword(password))) {
      return userEmailorPasswordIncorrect()
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
