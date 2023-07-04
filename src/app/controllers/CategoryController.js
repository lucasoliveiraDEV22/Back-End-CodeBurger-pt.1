import * as Yup from "yup"

import Category from "../models/Category"
class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name } = request.body

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    })

    if (categoryExists) {
      return response.status(400).json({ error: "Category already exists" })
    }

    // console.log(categoryExists)
    const { id } = await Category.create({ name })
    return response.json({ id, name })
  }

  catch(err) {
    console.log(err)
  }

  async index(request, response) {
    const category = await Category.findAll()

    return response.json(category)
  }
}

export default new CategoryController()
