import express from "express"
import userController from "./user.controller"
const router = express.Router()

router.post("/", userController.createUser)
router.patch("/", userController.updateUser)
router.get("/", userController.getUser)
router.delete("/", userController.deleteUser)

export default router