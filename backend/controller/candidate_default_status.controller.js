const db = require('../db');

class CandidateDefaultStatusController {
    async getCandidateDefaultStatus(req, res) {
        try {
            const statuses = await db.query(`SELECT * FROM default_candedate_status`);
            res.json(statuses.rows);
        } catch(error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new CandidateDefaultStatusController();