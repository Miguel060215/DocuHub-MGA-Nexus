const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const axios = require('axios');

const authController = {
    register: async (req, res) => {
        const { recaptchaToken } = req.body;
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

        try {
            const response = await axios.post(verifyUrl);
            if (!response.data.success) {
                return res.status(400).json({ message: 'Fallaste el captcha' });
            }

            const { nombre, apellido_paterno, apellido_materno, correo, nombre_usuario, contrasena, id_carrera } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            await Usuario.create({ 
                nombre, apellido_paterno, apellido_materno, correo, nombre_usuario, contrasena: hashedPassword, id_carrera 
            });

            console.log("Usuario registrado correctamente: " + nombre_usuario);
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error interno al validar reCaptcha', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { correo, contrasena, recaptchaToken } = req.body;
            
            // Validación de reCAPTCHA para Login
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
            const response = await axios.post(verifyUrl);

            if (!response.data.success) {
                return res.status(400).json({ message: 'Error en la verificación del reCAPTCHA' });
            }

            const usuario = await Usuario.getByCorreo(correo);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                { id_usuario: usuario.id_usuario, nombre_usuario: usuario.nombre_usuario, rol: usuario.rol},
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            console.log(`Login exitoso para: ${usuario.nombre_usuario} (Email: ${usuario.correo})`);
            res.status(200).json({ 
                message: 'Login exitoso', 
                token, 
                rol: usuario.rol, 
                nombre_usuario: usuario.nombre_usuario,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre: usuario.nombre,
                    apellido_paterno: usuario.apellido_paterno,
                    apellido_materno: usuario.apellido_materno,
                    nombre_usuario: usuario.nombre_usuario,
                    correo: usuario.correo,
                    id_carrera: usuario.id_carrera,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    }
};

module.exports = authController;