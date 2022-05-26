import type React from 'react';
import type { GenericComponentProps } from '../utils/interfaces';

const Footer: React.FC<GenericComponentProps> = ({ className }) => {
	return (
		<footer className={className}>
			<span>All Rights Reserved®</span>
		</footer>
	);
};

export default Footer;
