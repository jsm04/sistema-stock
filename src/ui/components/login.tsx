import { useState } from 'react';

type Props = {
	onSuccess?: (data: { id: number; username: string; role: string }) => void;
};

export default function Login({ onSuccess }: Props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		setLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Login failed');
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
					Stock Manager
				</h1>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm mb-1 text-gray-600'>Username</label>
						<input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={loading}
							className='w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
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
							className='w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
							required
						/>
					</div>

					{error && <p className='text-sm text-red-600'>{error}</p>}

					<button
						type='submit'
						disabled={loading}
						className='w-full py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	);
}
