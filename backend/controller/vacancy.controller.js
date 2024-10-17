const db = require('../db');

class VacancyController {
    async createVacancy(req, res) {
        const { title, vacancy_type_id, priority_id, division_id, min_expirience, description, hr_id } = req.body;
        try {
            await db.query('BEGIN');
            const newVacancy = await db.query(`INSERT INTO Vacancy(title, vacancy_type_id, priority_id, division_id, min_expirience, description, hr_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [title, vacancy_type_id, priority_id, division_id, min_expirience, description, hr_id]);
            const vacancyId = newVacancy.rows[0].id;
            await db.query(`INSERT INTO Vacancy_status(vacancy_id) VALUES ($1)`, [vacancyId]);
            await db.query('COMMIT');

            res.status(201).json(newVacancy.rows[0]);
        } catch (error) {
            await db.query('ROLLBACK');

            if (error.code === '23514') { // Код ошибки для проверки CHECK
                res.status(400).json({ error: 'Минимальный опыт должен быть неотрицательным' });
            } else {
                res.status(500).json({ error: 'Внутренняя ошибка сервера' });
            }
        }
    }

    async getVacancies(req, res) {
        const { division_id, hr_id, priority_id, status_id } = req.query;

        try {
            let query = `
        SELECT 
            v.*,
            json_build_object(
                'id', vs.status_id,
                'title', dvs.title 
            ) AS status,
            json_build_object(
                'id', p.id,
                'title', p.title
            ) AS priority,
            json_build_object (
                'id', d.id,
                'title', d.title
            ) AS division,
            json_build_object (
                'id', h.id,
                'fio', h.fio,
                'phone', h.phone,
                'email', h.email,
                'is_head', h.is_head
            ) AS responsible,
            COUNT(CASE WHEN last_cs.status_id = 1 THEN 1 END) AS value_responses,
            COUNT(CASE WHEN last_cs.status_id > 1 AND last_cs.status_id < 5 THEN 1 END) AS value_candidates 
        FROM 
            Vacancy v
        LEFT JOIN 
            Vacancy_status vs ON v.id = vs.vacancy_id 
        LEFT JOIN 
            Default_vacancy_status dvs ON vs.status_id = dvs.id
        LEFT JOIN 
            Priority p ON v.priority_id = p.id
        LEFT JOIN 
            Division d ON v.division_id = d.id
        LEFT JOIN 
            HR h ON v.hr_id = h.id
        LEFT JOIN (
            SELECT 
                cs.vacancy_id, 
                cs.status_id
            FROM 
                Candidate_status cs
            INNER JOIN (
                SELECT 
                    vacancy_id, 
                    candidate_id, 
                    MAX(updated_at) AS max_updated_at
                FROM 
                    Candidate_status
                GROUP BY 
                    vacancy_id, candidate_id
            ) latest ON cs.vacancy_id = latest.vacancy_id AND cs.candidate_id = latest.candidate_id AND cs.updated_at = latest.max_updated_at
        ) last_cs ON v.id = last_cs.vacancy_id  
        WHERE 
            vs.updated_at = (
                SELECT MAX(updated_at) FROM Vacancy_status WHERE vacancy_id = v.id)
    `;

            const params = [];

            if (division_id) {
                query += ' AND v.division_id = $' + (params.length + 1);
                params.push(division_id);
            }

            if (hr_id) {
                query += ' AND v.hr_id = $' + (params.length + 1);
                params.push(hr_id);
            }

            if (priority_id) {
                query += ' AND v.priority_id = $' + (params.length + 1);
                params.push(priority_id);
            }

            // New filter for status ID
            if (status_id) {
                query += ' AND vs.status_id = $' + (params.length + 1);
                params.push(status_id);
            }

            query += `
        GROUP BY 
            v.id, vs.status_id, dvs.title, p.id, p.title, d.id, d.title, h.id, h.fio, h.phone, h.email, h.is_head;
    `;

            const vacancies = await db.query(query, params);

            res.json(vacancies.rows);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }

    async getVacancy(req, res) {
        const id = req.params.id;

        try {
            const vacancy = await db.query(`SELECT 
            v.*,
            json_build_object(
                'id', vs.status_id,
                'title', dvs.title 
            ) AS status,
            json_build_object(
                'id', p.id,
                'title', p.title
            ) AS priority,
            json_build_object (
                'id', d.id,
                'title', d.title
            ) AS division,
            json_build_object (
                'id', h.id,
                'fio', h.fio,
                'phone', h.phone,
                'email', h.email,
                'is_head', h.is_head
            ) AS responsible,
            COUNT(CASE WHEN last_cs.status_id = 1 THEN 1 END) AS value_responses,
            COUNT(CASE WHEN last_cs.status_id > 1 AND last_cs.status_id < 5 THEN 1 END) AS value_candidates 
        FROM 
            Vacancy v
        LEFT JOIN 
            Vacancy_status vs ON v.id = vs.vacancy_id 
        LEFT JOIN 
            Default_vacancy_status dvs ON vs.status_id = dvs.id
        LEFT JOIN 
            Priority p ON v.priority_id = p.id
        LEFT JOIN 
            Division d ON v.division_id = d.id
        LEFT JOIN 
            HR h ON v.hr_id = h.id
        LEFT JOIN (
            SELECT 
                cs.vacancy_id, 
                cs.status_id
            FROM 
                Candidate_status cs
            INNER JOIN (
                SELECT 
                    vacancy_id, 
                    candidate_id, 
                    MAX(updated_at) AS max_updated_at
                FROM 
                    Candidate_status
                GROUP BY 
                    vacancy_id, candidate_id
            ) latest ON cs.vacancy_id = latest.vacancy_id AND cs.candidate_id = latest.candidate_id AND cs.updated_at = latest.max_updated_at
        ) last_cs ON v.id = last_cs.vacancy_id  
        WHERE 
            v.id = $1
        AND 
            vs.updated_at = (
                SELECT MAX(updated_at) 
                FROM Vacancy_status 
                WHERE vacancy_id = v.id
            )
        GROUP BY 
            v.id, vs.status_id, dvs.title, p.id, p.title, d.id, d.title, h.id, h.fio, h.phone, h.email, h.is_head;`, [id]);
            res.json(vacancy.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new VacancyController();