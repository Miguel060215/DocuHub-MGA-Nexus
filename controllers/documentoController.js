const Documento = require('../models/documentoModel');
const Etiqueta = require('../models/etiquetasModel');
const DocumentoEtiqueta = require('../models/documentoEtiquetasModel');
const db = require('../config/db');

const documentoController = {

    registrarAccesoGeo: async (req, res) => {
        try {
            const { id_documento, lat, lon } = req.body;

            let ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
            if (ipCliente.includes(',')) ipCliente = ipCliente.split(',')[0].trim();
            if (ipCliente === '::1') ipCliente = '127.0.0.1';

            let pais = 'Local / GPS';
            let ciudad = 'Ubicación Exacta';
            let latitudFinal = lat || null;
            let longitudFinal = lon || null;


            if (!latitudFinal || !longitudFinal) {
                const fetch = (await import('node-fetch')).default;
                const ipParaConsulta = (ipCliente === '127.0.0.1') ? '8.8.8.8' : ipCliente;
                const geoResponse = await fetch(`http://ip-api.com/json/${ipParaConsulta}`);
                const geoData = await geoResponse.json();

                if (geoData.status === 'success') {
                    pais = geoData.country;
                    ciudad = geoData.city;
                    latitudFinal = geoData.lat;
                    longitudFinal = geoData.lon;
                }
            }

            await db.query(
                `INSERT INTO registro_accesos_geo (id_documento, ip, pais, ciudad, lat, lon) VALUES (?, ?, ?, ?, ?, ?)`,
                [id_documento, ipCliente, pais, ciudad, latitudFinal, longitudFinal]
            );

            res.json({ message: 'Acceso registrado correctamente' });

        } catch (error) {
            console.error('Error al registrar geolocalización:', error.message);
            res.status(500).json({ message: 'Error interno al registrar acceso' });
        }
    },

    obtenerAccesosGeoAdmin: async (req, res) => {
        try {
            const [rows] = await db.query(`SELECT * FROM registro_accesos_geo ORDER BY fecha_consulta DESC LIMIT 100`);
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener registros geográficos:', error.message);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    },

    obtenerDocumentosAdmin: async (req, res) => {
        try{
            const documentos = await Documento.getAllForAdmin();
            res.json(documentos);
        }catch(error){
            console.error('Error al obtenr documentos para administrar: ', error.message);
            res.status(500).json({ message: 'Error interno en el servidor', detalle: error.message });
        }
    },

    cambiarEstadoDocumento: async (req, res) => {
        try {
            const { id } = req.params;
            const { id_estado } = req.body;

            if (!id_estado || (id_estado !== 2 && id_estado !== 3 && id_estado !== 1)) {
                return res.status(400).json({ message: 'Estado no válido' });
            }

            const filasAfectadas = await Documento.updateStatus(id, id_estado);

            if (filasAfectadas === 0) {
                return res.status(404).json({ message: 'Documento no encontrado' });
            }

            res.json({ message: 'Estado del documento actualizado con éxito' });
        } catch (error) {
            console.error('Error al cambiar el estado del documento: ', error.message);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    },

    subirDocumento: async (req, res) => {
        try {
            const { titulo, resumen, id_usuario, id_carrera, palabras } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'No se ha adjuntado ningún archivo PDF' });
            }

            const nuevoDoc = {
                titulo,
                resumen,
                archivo_url: `/uploads/${req.file.filename}`,
                nombre_original: req.file.originalname,
                id_usuario,
                id_carrera
            };

            const idDocumento = await Documento.create(nuevoDoc);

            if (palabras && palabras.trim() !== '') {
                const listaPalabras = palabras.split(',').map(p => p.trim()).filter(p => p !== '');
                for (const palabra of listaPalabras) {
                    const idEtiqueta = await Etiqueta.findOrCreate(palabra);
                    await DocumentoEtiqueta.create(idDocumento, idEtiqueta);
                }
            }

            await db.query(
                "UPDATE usuarios SET rol = 'autor' WHERE id_usuario = ? AND rol = 'lector'",
                [id_usuario]
            );

            res.status(201).json({ 
                message: 'Documento subido, etiquetas registradas y rol actualizado a autor con éxito',
                id_documento: idDocumento 
            });
        } catch (error) {
            console.error('Error detallado al subir documento:', error.message);
            res.status(500).json({ message: 'Error interno en el servidor', detalle: error.message });
        }
    },

    obtenerDocumentoPorId: async (req, res) => {
        try {
            const { id } = req.params;

            if (typeof id === 'string' && id.startsWith('core_')) {
                return res.status(400).json({ message: 'Este documento proviene de una fuente externa (CORE) y no tiene vista local' });
            }

            const documento = await Documento.getById(id);

            if (!documento) {
                return res.status(404).json({ message: 'Documento no encontrado' });
            }

            res.json(documento);
        } catch (error) {
            console.error('Error al obtener documento por ID:', error.message);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    },

    buscarDocumentos: async (req, res) => {
        try {
            const { q, carreras } = req.query;
            const termino = q ? q.trim() : '';
            const carrerasIds = carreras ? carreras.split(',').map(Number).filter(n => !isNaN(n)) : [];

            let nombresCarreras = [];
            if (carrerasIds.length > 0) {
                const [carrerasRows] = await db.query(
                    'SELECT nombre_carrera FROM carreras WHERE id_carrera IN (?)',
                    [carrerasIds]
                );
                nombresCarreras = carrerasRows.map(c => c.nombre_carrera);
            }

            const resultadosLocales = await Documento.searchLocal(termino, carrerasIds);

            let resultadosCore = [];
            if (process.env.CORE_API_KEY) {
                try {
                    let queryCore = termino;
                    if (nombresCarreras.length > 0) {
                        const filtroCarrerasStr = nombresCarreras.join(' OR ');
                        queryCore = termino ? `(${termino}) AND (${filtroCarrerasStr})` : filtroCarrerasStr;
                    }

                    if (queryCore.trim() !== '') {
                        const fetch = (await import('node-fetch')).default;
                        const coreResponse = await fetch(`https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(queryCore)}&limit=15`, {
                            headers: { 'Authorization': `Bearer ${process.env.CORE_API_KEY}` }
                        });
                        
                        if (coreResponse.ok) {
                            const data = await coreResponse.json();
                            resultadosCore = (data.results || []).map(work => {
                                const urlDescarga =
                                    work.downloadUrl ||
                                    (Array.isArray(work.sourceFulltextUrls) && work.sourceFulltextUrls.length > 0
                                        ? work.sourceFulltextUrls[0]
                                        : null) ||
                                    (work.doi ? `https://doi.org/${work.doi}` : null);

                                return {
                                    id_documento: `core_${work.id}`,
                                    titulo: work.title || 'Sin título',
                                    autor_nombre: (work.authors || []).map(a => a.name || 'Desconocido').join(', ') || 'Desconocido',
                                    nombre_carrera: 'Investigación Global (CORE)',
                                    resumen: work.abstract || 'Sin abstract disponible.',
                                    archivo_url: urlDescarga,
                                    es_local: false,
                                    etiquetas: []
                                };
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error al conectar con la API de CORE:', error.message);
                }
            }

            return res.json([...resultadosLocales, ...resultadosCore]);

        } catch (error) {
            console.error('Error en busqueda combinada: ', error.message);
            return res.status(500).json({ message: 'Error interno en el servidor', detalle: error.message });
        }
    }
};

module.exports = documentoController;