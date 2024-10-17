const db = require('../db');

class VacancyDefaultStatusController {
    async getVacancyDefaultStatus(req, res) {
        try {
            const statuses = await db.query(`SELECT * FROM default_vacancy_status`);
            res.json(statuses.rows);
        } catch(error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new VacancyDefaultStatusController();