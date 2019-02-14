import * as express from 'express';
import * as path from 'path';

const server = express();
server.use(express.json());
server.use(express.static(path.join(__dirname, 'game')));

const port = 8081;
server.listen(port, () => console.log(`Server is listening on port ${port}...`));