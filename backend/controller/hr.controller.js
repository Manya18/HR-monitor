const db = require('../db');

class HRController {
    async getHRs(req, res) {
        try {
            const hrs = await db.query(`SELECT * FROM HR`);
            res.json(hrs.rows);
        } catch(error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new HRController();