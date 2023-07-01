import { Router } from "express"
import multer from "multer"
import multerConfig from "./config/multer"
import authMiddleware from "./app/middlewares/auth"
import ProductController from "./app/controllers/ProductController"
import UserController from "./app/controllers/UserController"
import SessionController from "./app/controllers/SessionController"

const upload = multer(multerConfig)

const routes = new Router()

routes.post("/users", UserController.store)
routes.use(authMiddleware) // será chamado por todas as rotas ABAIXO

routes.post("/sessions", SessionController.store)

routes.post("/products", upload.single("file"), ProductController.store)

routes.get("/products", ProductController.index)

export default routes
