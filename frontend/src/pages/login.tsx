import type React from 'react';
import { useUserContext } from '../components/context/AuthContext';
import { loginUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login: React.FC = () => {
	const navigate = useNavigate();

	const { name, id, signIn } = useUserContext();

	const formSubmissionHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		const form_object = Object.fromEntries(
			new FormData(event.currentTarget).entries()
		);

		const data = await loginUser(form_object);

		if (data.status_code === 200) {
			// Create a better interface to set User Session Details
			signIn(data.name, data.id);
			return;
		}

		alert('Login attempt fail!');
	};

	useEffect(() => {
		if (name && id) {
			navigate('/dashboard');
		}
	});

	return (
		<div>
			<div className="grid place-items-center h-full">
				<form
					onSubmit={formSubmissionHandler}
					className="space-y-6 bg-white rounded-lg shadow-lg p-8 max-w-[400px] w-full"
				>
					<h1 className="text-4xl font-bold text-center">Login</h1>
					<fieldset className="flex flex-col">
						<label htmlFor="Name">Name</label>
						<input
							type="text"
							name="name"
							id="Name"
							className="input-primary"
							required
							autoComplete="username"
							minLength={3}
							maxLength={40}
						/>
					</fieldset>

					<fieldset className="flex flex-col">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							className="input-primary"
							required
							autoComplete="current-password"
							minLength={5}
							maxLength={50}
						/>
					</fieldset>

					<button
						formAction="submit"
						className="py-4 w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white"
					>
						Log in
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
