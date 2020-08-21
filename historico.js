const mariadb = require('mariadb');
const express = require('express');
const app = express();  
const bodyParser=require('body-parser');

const pool = mariadb.createPool({
     host: process.env.DB_HOST || 'localhost', 
     user: process.env.DB_USER || 'admin', 
     password: process.env.DB_PASS || 'admin123',
     database: process.env.DB_NAME || 'tipocambio',
     connectionLimit: 5});

     const port=process.env.SERVERPORT || '4171'
     const serverip=process.env.SERVERIP ||'0.0.0.0';
     
     app.use(bodyParser.urlencoded({extended: true}));
     app.use(bodyParser.json());
     
     app.post('/historico/tipocambio',async function asyncFunction(req, res) {
       let conn;
       let valores = req.body;
       try {
     console.log(req.body);
         conn = await pool.getConnection();
         const rows = await conn.query(`select id, date_Format(fecha, '%d-%m-%Y') as FECHA, valor from tipocambio.historico where fecha between '${valores.fecha_inicio}' and '${valores.fecha_fin}'`);
         res.json(rows);
         conn.release();
      
       } catch (err) {
         throw err;
         res.json(err);
         conn.release();
       } 
     });
     
     app.listen(port, serverip, function(req, res){
         console.log('El servidor escucha por el puerto:', port)
     })