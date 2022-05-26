import type React from 'react';
import PageLayout from '../components/Layouts/PageLayout';
import { createUserAccount, createUserRoot } from '../utils/api';
import { useUserContext } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
	const { setName, setUserId, setRootPath } = useUserContext();
	const navigate = useNavigate();

	const formSubmissionHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		const form_object = Object.fromEntries(
			new FormData(event.currentTarget).entries()
		);

		// Check creation status code before creating the root
		const data = await createUserAccount(form_object);
		const userRootPath = await createUserRoot(data.id);

		if (!(data.status_code === 200)) {
			alert('Sign up failed!');
			return;
		}

		// Create a better interface to set User Session Details

		setName(data.name);
		setUserId(data.id);
		setRootPath(userRootPath.root_path);
		navigate('/dashboard');
	};

	return (
		<PageLayout className="bg-gray-800">
			<div className="grid place-items-center h-full">
				<form
					onSubmit={formSubmissionHandler}
					className="space-y-6 bg-white rounded-lg shadow-lg p-8 max-w-[400px] w-full"
				>
					<h1 className="text-4xl font-bold text-center">Sign Up</h1>
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
							maxLength={10}
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
							maxLength={10}
						/>
					</fieldset>

					<fieldset className="flex items-center flex-row-reverse justify-end">
						<label htmlFor="terms" className="ml-2">
							You agree to the{' '}
							<a
								href="https://therickroll.com"
								className="underline text-sky-800"
							>
								Terms and Conditions
							</a>
						</label>
						<input type="checkbox" id="terms" required />
					</fieldset>

					<button
						formAction="submit"
						className="py-4 w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white"
					>
						Log in
					</button>
				</form>
			</div>
		</PageLayout>
	);
};

export default SignUp;
