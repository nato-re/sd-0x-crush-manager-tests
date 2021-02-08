const frisby = require('frisby');
const fs = require('fs');
const path = require('path');
const crushsSeed = require('./seed.json');

const url = 'http://localhost:3000';

describe('1 - Crie o endpoint GET /crush', () => {
  beforeEach(() => {
    const crushSeed = fs.readFileSync(
      path.join(__dirname, 'seed.json'),
      'utf8'
    );

    fs.writeFileSync(
      path.join(__dirname, '..', 'crush.json'),
      crushSeed,
      'utf8'
    );
  });

  it('Será validado que o endpoint deve retornar um array com todos os crushs cadastrados', async () => {
    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                'Content-Type': 'application/json',
              },
            },
          })
          .get(`${url}/crush`)
          .expect('status', 200)
          .then((response) => {
            const { json } = response;
            expect(json).toEqual(crushsSeed);
          });
      });
  });

  it('Será validado que o endpoint deve retornar um array vazio caso não haja crushs', async () => {
    fs.writeFileSync(path.join(__dirname, '..', 'crush.json'), '[]', 'utf8');

    await frisby
      .post(`${url}/login`, {
        body: {
          email: 'deferiascomigo@gmail.com',
          password: '12345678',
        },
      })
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                'Content-Type': 'application/json',
              },
            },
          })
          .get(`${url}/crush`)
          .expect('status', 200)
          .then((responseGet) => {
            const { json } = responseGet;
            expect(json).toEqual([]);
          });
      });
  });
});
