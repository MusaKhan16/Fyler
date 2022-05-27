import { ReactComponent as RocketIcon } from '../assets/icons/rocket.svg';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
	return (
		<div>
			<section className="view-height bg-gray-800 flex flex-col justify-between ">
				<div className="flex flex-col lg:flex-row justify-around items-center text-white p-4 h-full">
					<div className="h-full w-full lg:w-1/2">
						<div className="space-y-2">
							<h1 className="text-6xl font-black">
								Welcome to Fyler
							</h1>
							<h2 className="text-2xl font-bold">
								A Secure File Storage Web App
							</h2>
							<p className="text-lg text-zinc-400">
								Fyler is a simple and useful file storage
								application on the cloud. Able to store files up
								to 4gb per request with 10 gb total storage.{' '}
								<u>Save once, and access anywhere.</u>
							</p>
						</div>
						<Link to="/login">
							<button className="cursor py-2 px-4 mt-6 bg-slate-900 border-2 border-solid border-gray-600 rounded-md font-bold transition transform hover:scale-105">
								Get Started
							</button>
						</Link>
					</div>

					<RocketIcon className="w-1/2 md:w-1/4 " />
				</div>
				<img
					src="http://eose.org/wp-content/plugins/jetpack/_inc/images/module-clouds-2x.png"
					alt="clouds"
				/>
			</section>
		</div>
	);
};

export default Home;
