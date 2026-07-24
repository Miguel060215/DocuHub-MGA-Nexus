const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/usuarioModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   // callbackURL: "/auth/google/callback"
    callbackURL: process.env.NODE_ENV === 'production'
        ? "https://docuhub-mga-nexus.onrender.com/auth/google/callback"
        : "/auth/google/callback",
    proxy: true
},

async (accessToken, refreshToken, profile, done) => {
    try{
        const correo = profile.emails[0].value;
        let usuario = await Usuario.getByCorreo(correo);
        if(!usuario){
            const nuevoUsuarioData = {
                nombre: profile.name.givenName || 'Usuario',
                apellido_paterno: profile.name.familyName || '',
                apellido_materno: '',
                correo: correo,
                nombre_usuario: correo.split('@')[0] + Math.floor(Math.random() * 1000),
                contrasena: null,
                id_carrera: 13 //agregue en mi basee la opcion de carrera desconocida con el id 13
            };
            await Usuario.create(nuevoUsuarioData);
            usuario = await Usuario.getByCorreo(correo);
        }
        return done(null, usuario);
    }catch(error){
        return done(error, null)
    }
}
));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id_usuario);
});

passport.deserializeUser(async (id, done) => {
    try{
        const usuario = await Usuario.getById(id);
        done(null, usuario);
    }catch(error){
        done(error, null);
    }
});