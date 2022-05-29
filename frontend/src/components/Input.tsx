import type React from 'react';

type InputProps = {
	icon: string;
} & React.HTMLProps<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ icon, className, ...props }) => (
	<div
		className={`grid grid-cols-input border-2 border-solid border-zinc-600 w-fit rounded-md ${className}`}
	>
		<input
			type="text"
			{...props}
			className="bg-transparent p-4 w-full outline-none text-white"
		/>
		<div className="border-l-2 border-solid border-zinc-600 p-4 inline">
			{icon}
		</div>
	</div>
);

export default Input;
