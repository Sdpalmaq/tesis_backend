import jwt from 'jsonwebtoken';
import User  from '../models/user.model.js';

export const login = async (req, res) => {
  const { correo, contrasena } = req.body;
    try {
      const user = await User.findByEmail(correo);
      if (!user) {
        return res.status(401).json({ message: "Usuario incorrectos" });
      }
  
      const validPassword = await User.verifyPassword(user.contrasena, contrasena);
      if (!validPassword) {
        return res.status(401).json({ message: "Contraseña incorrectos" });
      }

      if (user.debe_cambiar_contrasena) {
        return res.status(200).json({ user, debeCambiarContrasena: true });
      }
  
      const token = jwt.sign(
        { 
          id: user.cedula,
          es_administrador: user.es_administrador 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });
  
      delete user.contrasena;
      res.json({ user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  export const getMe = async (req, res) => {
    try {
      const user = await User.findByCedula(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      delete user.contrasena;
      res.json(user);
    } catch (error) {
      console.error('GetMe error:', error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  export const logout = (req, res) => {
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ message: 'Logout successful' });
  };