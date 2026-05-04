import Login from './components/login';

//@ts-ignore
import './global.css';

export function App() {
	return (
		<div className='min-h-screen'>
			<Login
				onSuccess={(user) => {
					console.log('logged in:', user);
					// siguiente paso: guardar sesión / redirigir
				}}
			/>
		</div>
	);
}
export default App;
