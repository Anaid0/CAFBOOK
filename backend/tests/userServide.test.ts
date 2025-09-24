import { UsersApplication } from '../src/application/UsersApplication';
import { UserPort } from '../src/domain/port/UsersPort';
import { Users } from '../src/domain/entities/Users';
import { describe, test, expect, beforeAll } from '@jest/globals';

const mockPort = {
  getUserById: async (id: number) => ({
    user_id: id,
    email: 'diana@gmail.com',
    password: 'Diana123',
    status: 1,
    role_id: 1,
    role_description: 'USER',
    first_name: 'Diana',
    last_name: 'Vargas',
    doc_type_id: 1,
    document_number: '12345656',
    photo_url: null,
    created_at: new Date(),
    doc_type_description: 'Cédula',
  }),
  getUserByEmail: async (email: string) => ({
    user_id: 1,
    email,
    password: 'Diana123',
    status: 1,
    role_id: 1,
    role_description: 'USER',
    first_name: 'Diana',
    last_name: 'Vargas',
    doc_type_id: 1,
    document_number: '12345656',
    photo_url: null,
    created_at: new Date(),
    doc_type_description: 'Cédula',
  }),
  createUser: async () => 1,
  updateUser: async () => true,
  deleteUser: async () => true,
  restoreUser: async () => true,
  getAllUsers: async () => [],
} as unknown as UserPort;

describe('UsersApplication', () => {
  let app: UsersApplication;

  beforeAll(() => {
    app = new UsersApplication(mockPort);
  });

  test('should return user by id', async () => {
    const user = await app.getUserById(1);
    expect(user).not.toBeNull();
    expect(user?.user_id).toBe(1);
  });

  test('should return user by email', async () => {
    const user = await app.getUserByEmail('diana@gmail.com');
    expect(user).not.toBeNull();
    expect(user?.email).toBe('diana@gmail.com');
  });

  test('should create user', async () => {
    const userId = await app.createUser({
    email: "diana@gmail.com",
    password: 'Diana123',
    status: 1,
    role_id: 1,
    first_name: 'Diana',
    last_name: 'Vargas',
    doc_type_id: 1,
    document_number: '12345656',
    photo_url: null,
    created_at: new Date(),
    });
    expect(userId).toBe(1);
  });

  test('should update user', async () => {
    const result = await app.updateUser(1, { first_name: 'Actualizado' });
    expect(result).toBe(true);
  });

  test('should delete user', async () => {
    const result = await app.deleteUser(1);
    expect(result).toBe(true);
  });

  test('should restore user', async () => {
    const result = await app.restoreUser(1);
    expect(result).toBe(true);
  });

  test('should get all users', async () => {
    const users = await app.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
  });
});
