const express = require('express');
const cors = require('cors');
const vacancyRouter = require('./routes/vacancy.routes');
const divisionRouter = require('./routes/division.routes');
const vacancyTypeRouter = require('./routes/vacancy_type.routes');
const priorityRouter = require('./routes/priority.routes');
const hrRouter = require('./routes/hr.routes');
const metricsRouter = require('./routes/metrics.routes');
const taskRouter = require('./routes/task.routes');
const candidatesRouter = require('./routes/candidate.routes');
const candidateDefaultStatusRouter = require('./routes/candidate_default_status.routes');
const vacancyDefaultStatusRouter = require('./routes/vacancy_default_status.routes');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', vacancyRouter);
app.use('/api', divisionRouter);
app.use('/api', vacancyTypeRouter);
app.use('/api', priorityRouter);
app.use('/api', hrRouter);
app.use('/api', metricsRouter);
app.use('/api', taskRouter);
app.use('/api', candidatesRouter);
app.use('/api', candidateDefaultStatusRouter);
app.use('/api', vacancyDefaultStatusRouter);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));