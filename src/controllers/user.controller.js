import * as UserService from '../services/user.service.js'

export const getAllUsers = async (req, res) => {
  const users = await UserService.findAll()
  res.json(users);
}

export const createUser = async (req, res) => {
  const user = await UserService.create(req.body)
  res.status(201).json(user);
}
