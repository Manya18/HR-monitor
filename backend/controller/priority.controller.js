const db = require('../db');

class PriorityController {
    async getPriorities(req, res) {
        try {
            const priorities = await db.query(`SELECT * FROM Priority`);
            res.json(priorities.rows);
        } catch(error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new PriorityController();