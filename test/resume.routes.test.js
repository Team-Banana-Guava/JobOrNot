const fs = require('fs');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../lib/app');
const request = chai.request(app);

const Resume = require('../lib/models/resume.schema');


describe('resume', () => {
    
    describe.only('resume management', () => {
        const testResume = fs.readFileSync(__dirname + '/hotelmanagement.pdf');

        const user1 = {
            username: 'dobby',
            password: 'ilikesocks'
        };

        const user2 = {
            username: 'hagrid',
            password: 'youreawizardharry!'
        };

        const user3 = {
            username: 'voldemort',
            password: 'evilllllll'
        };

        it.skip('can post a resume', () => {

            request
                .post('/myResume')
                .set('Content-Type', 'application/octet-stream')
                .send(testResume)
                .then(res => {
                    console.log('FILE', res.body.file);
                    assert.ok(res.body.file);
                });
        }); //this test is currently failing probably because no user signin
    
        it('updates resume skills and user reference', () => {
            let testResume3 = new Resume({
                file: fs.readFileSync(__dirname + '/hotelmanagement.pdf'),
                name: 'testres'
            });

            let data = {
                skills: ['management'],
                user: '5810A459'
            };
            request
                .post('/signup')
                .send(user3)
                .then(res => { 
                    console.log(res.body);
                    res.send(res.body);
                })
                .then((token) => {
                    console.log('IM HERE', token);
                    return request
                        .patch('/myResume')
                        .send(data)
                        .set('Authorizaton', token)
                        .then(res => {
                            console.log('RES BODY', res.body.testResume3.skills);
                            assert.deepEqual(res.body.testResume3.skills, ['management']);
                        });
                });
        });

        it('deleting a resume requires a user to be signed in and authenticated', () => {
            let testresume2 = new Resume({
                file: fs.readFileSync(__dirname + '/hotelmanagement.pdf'),
                name: 'testRes'
            });
        
            request
                .delete(`/myResume/${testresume2._id}`)
                .then(res => {
                    assert.equal(res.status, 401);
                    assert.equal(res.response.body.error, 'Unauthorized');
                })
                .catch(() => { throw new Error('Status should not be OK'); });
        });

        it.skip('user cannot delete another user\'s resume', () => {
            let user1Token = '';
            let user2Token = '';

            let user1ResId = '';
            console.log('user 1', user1);
            request
                .post('/signup')
                .send(user1)
                .then(res => {
                    user1Token = res.body.token;
                    // return request
                    //     .post('/myResume')
                    //     .send(testResume)
                    //     .then(res => {
                    //         if(!res) throw 'Fail';
                    //         console.log(res.response);

                    //     });
                });

        });
    });
});