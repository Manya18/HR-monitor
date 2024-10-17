const db = require('../db');

class VacancyTypeController {
    async getVacancyTypes(req, res) {
        try {
            const vacancyTypes = await db.query(`SELECT * FROM Vacancy_type`);
            res.json(vacancyTypes.rows);
        } catch(error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new VacancyTypeController();