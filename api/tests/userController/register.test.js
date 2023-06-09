import { getMockReq, getMockRes } from '@jest-mock/express';
import { registerUser } from '../../controllers/userController.js';
import User from '../../models/userModel.js';
import bcrypt from 'bcryptjs';

jest.mock('../../models/userModel.js');

describe('registerUser', () => {
    it('creates a new user if the email does not exist', async () => {
        const req = getMockReq({
            body: {
                email: 'test@example.com',
                password: 'test1234',
                firstName: 'John',
                lastName: 'Doe'
            }
        });
        
        const { res, clearMockRes } = getMockRes({
            cookie: jest.fn()
        });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: hashedPassword,
            isAdmin: false,
            isSubtribe: false,
            clicks: {
                date: expect.any(Date),
                numOfClicks: 0
            },
            subscriptions: [],
            products: []
        });

        await registerUser(req, res);

        expect(res.json).toHaveBeenCalledWith({
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            isAdmin: false,
            isSubtribe: false
        });
        expect(res.cookie).toBeCalled();

        clearMockRes();  // Clear the mock response after each test
    });

    it('throws an error if the email already exists', async () => {
        const req = getMockReq({
            body: {
                email: 'test@example.com',
                password: 'test1234',
                firstName: 'John',
                lastName: 'Doe'
            }
        });
    
        const { res, clearMockRes } = getMockRes();
    
        User.findOne.mockResolvedValue(true);
    
        await expect(registerUser(req, res)).rejects.toThrow('Email already exists');
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    
        clearMockRes();  // Clear the mock response after each test
    });
    
});
