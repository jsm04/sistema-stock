import { useState } from 'react';

type Props = {
	onSuccess?: (data: { id: number; username: string; role: string }) => void;
};

export default function Register({ onSuccess }: Props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'admin' | 'operador'>('operador');

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function validate() {
		if (username.length < 3) return 'Username must be at least 3 characters';
		if (!/^[a-zA-Z0-9_]+$/.test(username))
			return 'Username can only contain letters, numbers and _';
		if (password.length < 6) return 'Password must be at least 6 characters';
		return null;
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password, role }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Registration failed');
			}

			onSuccess?.(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 text-gray-900'>
			<div className='w-full max-w-sm bg-white p-8 rounded-2xl shadow-md border border-gray-200'>
				<h1 className='text-2xl font-semibold mb-6 text-center'>
					Create Account
				</h1>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm mb-1 text-gray-600'>Username</label>
						<input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={loading}
							className='w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
							required
						/>
					</div>

					<div>
						<label className='block text-sm mb-1 text-gray-600'>Password</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							className='w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
							required
						/>
					</div>

					<div>
						<label className='block text-sm mb-1 text-gray-600'>Role</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value as 'admin' | 'operador')}
							disabled={loading}
							className='w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
						>
							<option value='operador'>Operador</option>
							<option value='admin'>Admin</option>
						</select>
					</div>

					{error && <p className='text-sm text-red-600'>{error}</p>}

					<button
						type='submit'
						disabled={loading}
						className='w-full py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition disabled:opacity-50'
					>
						{loading ? 'Creating...' : 'Register'}
					</button>
				</form>
			</div>
		</div>
	);
}
