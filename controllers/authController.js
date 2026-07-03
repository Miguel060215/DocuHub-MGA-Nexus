const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModel');

const authController = {
    register: async (req, res) => {
        try {
            const { 
                nombre, 
                apellido_paterno, 
                apellido_materno, 
                correo, 
                nombre_usuario, 
                contrasena, 
                id_carrera 
            } = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);
            console.log("Datos recibidos:", { nombre, apellido_paterno, apellido_materno, correo, nombre_usuario, contrasena, id_carrera });
            await Usuario.create({ 
                nombre, 
                apellido_paterno, 
                apellido_materno, 
                correo, 
                nombre_usuario, 
                contrasena: hashedPassword, 
                id_carrera 
            });

            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { correo, contrasena } = req.body;
            
            const usuario = await Usuario.getByCorreo(correo);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }

            res.status(200).json({ message: 'Login exitoso' });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    }
};

module.exports = authController;