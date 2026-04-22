import { describe, it, expect, beforeEach } from 'bun:test';
import { createTestDB } from './setup';
import { userService } from '../server/useCases/userService';

let db: any;
let service: ReturnType<typeof userService>;

beforeEach(() => {
	const testEnv = createTestDB();
	db = testEnv.db;
	service = userService(db);
});

describe('UC07 - Crear usuario', () => {
	it('debería crear un usuario correctamente', async () => {
		const user = await service.createUser({
			username: 'testuser',
			password: '123456',
			role: 'admin',
		});

		expect(user!.id).toBeDefined();
		expect(user!.username).toBe('testuser');
		expect(user!.role).toBe('admin');
	});

	it('debería fallar si el username está duplicado', async () => {
		await service.createUser({
			username: 'duplicate',
			password: '123456',
			role: 'operador',
		});

		await expect(
			service.createUser({
				username: 'duplicate',
				password: '123456',
				role: 'operador',
			}),
		).rejects.toThrow('Username already exists');
	});
});

describe('UC07 - Login', () => {
	it('debería loguear con credenciales correctas', async () => {
		await service.createUser({
			username: 'loginuser',
			password: '123456',
			role: 'operador',
		});

		const result = await service.login({
			username: 'loginuser',
			password: '123456',
		});

		expect(result.username).toBe('loginuser');
	});

	it('debería fallar con usuario inexistente', async () => {
		await expect(
			service.login({
				username: 'noexist',
				password: '123456',
			}),
		).rejects.toThrow('Invalid credentials');
	});

	it('debería fallar con password incorrecto', async () => {
		await service.createUser({
			username: 'wrongpass',
			password: '123456',
			role: 'operador',
		});

		await expect(
			service.login({
				username: 'wrongpass',
				password: 'wrong',
			}),
		).rejects.toThrow('Invalid credentials');
	});
});
