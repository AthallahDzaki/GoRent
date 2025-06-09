import * as UserService from '../models/user.models.js'

export const getAllUsers = async (req, res) => {
  const users = await UserService.findAll()
  res.json(users);
}

export const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user
  const user = await UserService.findById(userId);
  
  if (!user) {
    return res.status(404).json({ status : "failed", errors: ['User not found'] });
  }
  
  res.json(user);
}