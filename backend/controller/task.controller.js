const db = require('../db');

class TaskController {
    async getTasks(req, res) {
        const { priority_id, hr_id, done } = req.query;

        try {
            let query = `
                SELECT 
                    t.*,
                    json_build_object(
                        'id', p.id,
                        'title', p.title
                    ) AS priority,
                    json_build_object(
                        'id', dcs.id,
                        'title', dcs.title
                    ) AS status,
                    json_build_object(
                        'id', hr.id,
                        'fio', hr.fio,
                        'phone', hr.phone,
                        'email', hr.email,
                        'is_head', hr.is_head
                    ) AS responsible
                FROM 
                    Task t
                JOIN (
                    SELECT 
                        cs.candidate_id,
                        cs.vacancy_id,
                        cs.status_id,
                        ROW_NUMBER() OVER (PARTITION BY cs.candidate_id ORDER BY cs.updated_at DESC) AS rn
                    FROM 
                        Candidate_status cs
                ) latest_cs ON latest_cs.candidate_id = t.candidate_id AND latest_cs.rn = 1
                JOIN 
                    Vacancy v ON latest_cs.vacancy_id = v.id
                JOIN 
                    Priority p ON v.priority_id = p.id
                LEFT JOIN 
                    Default_candedate_status dcs ON latest_cs.status_id = dcs.id
                LEFT JOIN 
                    HR hr ON v.hr_id = hr.id
                WHERE 1=1`;

            const params = [];

            if (priority_id) {
                query += ' AND v.priority_id = $' + (params.length + 1);
                params.push(priority_id);
            }

            if (hr_id) {
                query += ' AND v.hr_id = $' + (params.length + 1);
                params.push(hr_id);
            }

            if (done !== undefined) {
                const doneValue = done === 'true';
                query += ' AND t.done = $' + (params.length + 1);
                params.push(doneValue);
            }

            query += `
                ORDER BY 
                    p.id ASC,          -- Sort by priority ID (from lowest to highest)
                    t.deadline ASC;    -- Sort by deadline date (from nearest to farthest)
            `;

            const tasks = await db.query(query, params);

            res.json(tasks.rows);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }

    async getTask(req, res) {
        const id = req.params.id;

        try {
            const task = await db.query(`SELECT 
            t.*,
            latest_cs.vacancy_id,  -- Add vacancy_id here
            json_build_object(
                'id', p.id,
                'title', p.title
            ) AS priority,
            json_build_object(
                'id', dcs.id,
                'title', dcs.title
            ) AS status,
            json_build_object(
                'id', hr.id,
                'fio', hr.fio,
                'phone', hr.phone,
                'email', hr.email,
                'is_head', hr.is_head
            ) AS responsible
        FROM 
            Task t
        JOIN (
            SELECT 
                cs.candidate_id,
                cs.vacancy_id,  -- Ensure vacancy_id is selected here
                cs.status_id,
                ROW_NUMBER() OVER (PARTITION BY cs.candidate_id ORDER BY cs.updated_at DESC) AS rn
            FROM 
                Candidate_status cs
        ) latest_cs ON latest_cs.candidate_id = t.candidate_id AND latest_cs.rn = 1
        JOIN 
            Vacancy v ON latest_cs.vacancy_id = v.id
        JOIN 
            Priority p ON v.priority_id = p.id
        LEFT JOIN 
            Default_candedate_status dcs ON latest_cs.status_id = dcs.id
        LEFT JOIN 
            HR hr ON v.hr_id = hr.id
        WHERE 
            t.id = $1;`, [id]);
            res.json(task.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new TaskController();