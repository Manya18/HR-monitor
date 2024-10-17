const db = require('../db');

class DivisionController {
    async getDivisions(req, res) {
        try {
            const divisions = await db.query(`SELECT * FROM Division`);
            res.json(divisions.rows);
        } catch(error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new DivisionController();