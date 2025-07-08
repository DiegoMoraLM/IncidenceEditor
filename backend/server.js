const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3001;

// GET - Lista de incidencias (sin imágenes)
app.get('/incidencias', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        "Id", "ManagerName", "WorkerCode", "Facility", "Description",
        "IncidenceDate", "Priority", "Actions", "ActionOperator",
        "ResolutionDate", "StopInit", "StopEnd", "NotifiedTo", 
        "AssignedTo", "CreatedDate", "LastModifiedDate", "Archived"
      FROM "Incidence"
      ORDER BY "Id"
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener incidencias');
  }
});

// GET - Detalle completo de una incidencia (con imágenes)
app.get('/incidencias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM "Incidence" WHERE "Id" = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Incidencia no encontrada');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener incidencia');
  }
});

// GET - Solo las imágenes de una incidencia
app.get('/incidencias/:id/images', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT "Base64Pics" FROM "Incidence" WHERE "Id" = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Incidencia no encontrada');
    }

    res.json({ base64Pics: result.rows[0].Base64Pics });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener imágenes');
  }
});

// PUT - Actualizar una incidencia (sin modificar imágenes)
app.put('/incidencias/:id', async (req, res) => {
    const id = req.params.id;
    const {
      ManagerName, WorkerCode, Facility, Description,
      IncidenceDate, Priority,
      Actions, ActionOperator, ResolutionDate,
      StopInit, StopEnd, NotifiedTo, AssignedTo, Archived
    } = req.body;
  
    try {
      const query = `
        UPDATE "Incidence" SET
          "ManagerName" = $1,
          "WorkerCode" = $2,
          "Facility" = $3,
          "Description" = $4,
          "IncidenceDate" = $5,
          "Priority" = $6,
          "Actions" = $7,
          "ActionOperator" = $8,
          "ResolutionDate" = $9,
          "StopInit" = $10,
          "StopEnd" = $11,
          "NotifiedTo" = $12,
          "AssignedTo" = $13,
          "Archived" = $14,
          "LastModifiedDate" = CURRENT_TIMESTAMP
        WHERE "Id" = $15
        RETURNING *`;
  
      const values = [
        ManagerName, WorkerCode, Facility, Description,
        IncidenceDate, Priority,
        Actions, ActionOperator, ResolutionDate,
        StopInit, StopEnd, NotifiedTo, AssignedTo, Archived,
        id
      ];
  
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar incidencia');
    }
  });
  

  app.delete('/incidencias/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        'DELETE FROM "Incidence" WHERE "Id" = $1 RETURNING *',
        [id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).send('Incidencia no encontrada');
      }
  
      res.sendStatus(204); // No Content
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar incidencia');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
