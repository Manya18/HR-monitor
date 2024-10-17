const db = require('../db');

class CandidateController {
    async getCandidates(req, res) {
        const { vacancy_ids, status_ids, hr_ids } = req.query;

        try {
            const db = require('../db');
            let query = `
                SELECT 
                    c.*,
                    ARRAY_AGG(
                        JSON_BUILD_OBJECT(
                            'id', v.id,
                            'title', v.title,
                            'description', v.description,
                            'created_at', v.created_at,
                            'vacancy_type', JSON_BUILD_OBJECT(
                                'id', vt.id,
                                'title', vt.title
                            ),
                            'status', JSON_BUILD_OBJECT(
                                'id', dcs.id,          
                                'title', dcs.title      
                            ),
                            'priority', JSON_BUILD_OBJECT( 
                                'id', p.id,
                                'title', p.title
                            ),
                            'division', JSON_BUILD_OBJECT(
                                'id', div.id,
                                'title', div.title
                            ),
                            'responsible', JSON_BUILD_OBJECT(
                                'id', hr.id,
                                'fio', hr.fio,
                                'phone', hr.phone,
                                'email', hr.email,
                                'is_head', hr.is_head
                            )
                        )
                    ) AS vacancies
                FROM Candidate c
                LEFT JOIN Vacancy_candidate vc ON vc.candidate_id = c.id
                LEFT JOIN Vacancy v ON vc.vacancy_id = v.id
                LEFT JOIN Vacancy_type vt ON v.vacancy_type_id = vt.id
                LEFT JOIN (
                    SELECT 
                        cs.candidate_id, 
                        cs.vacancy_id, 
                        cs.status_id,
                        ROW_NUMBER() OVER (PARTITION BY cs.candidate_id, cs.vacancy_id ORDER BY cs.updated_at DESC) AS rn
                    FROM Candidate_status cs
                ) last_status ON last_status.candidate_id = c.id AND last_status.vacancy_id = v.id AND last_status.rn = 1
                LEFT JOIN Default_candedate_status dcs ON last_status.status_id = dcs.id
                LEFT JOIN Priority p ON v.priority_id = p.id  
                LEFT JOIN Division div ON v.division_id = div.id
                LEFT JOIN HR hr ON v.hr_id = hr.id
            `;

            const params = [];

            if (vacancy_ids) {
                const idsArray = Array.isArray(vacancy_ids) ? vacancy_ids : [vacancy_ids];
                query += (params.length === 0 ? ' WHERE' : ' AND') + ` v.id IN (` + idsArray.map((_, index) => `$${params.length + index + 1}`).join(', ') + `)`;
                params.push(...idsArray);
            }

            if (status_ids) {
                const idsArray = Array.isArray(status_ids) ? status_ids : [status_ids];
                query += (params.length === 0 ? ' WHERE' : ' AND') + ` dcs.id IN (` + idsArray.map((_, index) => `$${params.length + index + 1}`).join(', ') + `)`;
                params.push(...idsArray);
            }

            if (hr_ids) {
                const idsArray = Array.isArray(hr_ids) ? hr_ids : [hr_ids];
                query += (params.length === 0 ? ' WHERE' : ' AND') + ` hr.id IN (` + idsArray.map((_, index) => `$${params.length + index + 1}`).join(', ') + `)`;
                params.push(...idsArray);
            }

            query += `
                GROUP BY c.id;
            `;

            const candidates = await db.query(query, params);

            res.json(candidates.rows);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }

    async updateCandidateStatus(req, res) {
        const id = req.params.id;
        const { vacancy_id, status_id, plan_date } = req.body;

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const priorityResult = await client.query(`
                SELECT priority_id FROM Vacancy WHERE id = $1;
            `, [vacancy_id]);

            if (priorityResult.rows.length === 0) {
                return res.status(404).json({ error: 'Вакансия не найдена' });
            }

            const priorityId = priorityResult.rows[0].priority_id;
            let days;

            switch (priorityId) {
                case 1:
                    days = 1;
                    break;
                case 2:
                    days = 5;
                    break;
                case 3:
                    days = 7;
                    break;
                default:
                    days = 0;
            }

            const taskId = await db.query(`SELECT t.id
            FROM Task t
            JOIN Vacancy_candidate vc ON t.candidate_id = vc.candidate_id
            WHERE vc.vacancy_id = $1 AND vc.candidate_id = $2 AND t.done = false;`, [vacancy_id, id]);
            console.log(taskId);

            await client.query(`
                UPDATE Task 
                SET done = TRUE, finished_at = LOCALTIMESTAMP 
                WHERE id = $1;
            `, [taskId.rows[0].id]);


            await client.query(`
                INSERT INTO Candidate_status (candidate_id, status_id, vacancy_id) 
                VALUES ($1, $2, $3);
            `, [id, status_id, vacancy_id]);

            if (status_id === 1) {
                await client.query(`
                    INSERT INTO Task (candidate_id, title, deadline) 
                    VALUES ($1, 'Рассмотреть резюме', LOCALTIMESTAMP + ($2 * INTERVAL '1 day'));
                `, [id, days]);
            } else if (status_id === 2) {
                await client.query(`
                    INSERT INTO Task (candidate_id, title, deadline) 
                    VALUES ($1, 'Назначить собеседование', LOCALTIMESTAMP + ($2 * INTERVAL '1 day'));
                `, [id, days]);
            } else if (status_id === 3) {
                await client.query(`
                    INSERT INTO Interview (candidate_id, plan_date) 
                    VALUES ($1, $2);
                `, [id, plan_date]);

                await client.query(`
                    INSERT INTO Task (candidate_id, title, deadline) 
                    VALUES ($1,
                        CONCAT('Провести собеседование ', TO_CHAR($2::timestamp,'DD.MM.YYYY'), ' в ', TO_CHAR($2::timestamp,'HH24:MI')),
                        DATE($2));
                `, [id, plan_date]);
            } else if (status_id === 4) {
                await client.query(`INSERT INTO Vacancy_status (vacancy_id, status_id) VALUES($1, 2)`, [vacancy_id]);
            }

            await client.query('COMMIT');
            res.status(201).json({ message: 'Успешное обновление статуса' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Ошибка при обновлении статуса:', error);
            res.status(500).json({ error: 'Ошибка при обновлении статуса' });
        } finally {
            client.release();
        }
    }

    async getCandidate(req, res) {
        const id = req.params.id;

        try {
            const candidate = await db.query('SELECT * FROM Candidate WHERE id = $1', [id]);
            res.json(candidate.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
}

module.exports = new CandidateController();