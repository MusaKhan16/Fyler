import type React from 'react';
import Modal from 'react-modal';
import { IoClose } from 'react-icons/io5';
import { GenericComponentProps } from '../../utils/interfaces';
import { useReducer } from 'react';

interface ModalProps extends GenericComponentProps {
	isOpen: boolean;
	onRequestClose: () => void;
}

const customModalStyle = {
	overlay: {
		backgroundColor: 'rgba(0 0 0 / 0.1)',
		backdropFilter: 'blur(2px)',
	},
	content: {
		backgroundColor: '#27272a',
		border: 'solid 2px rgb(150 150 150)',
		borderRadius: '1rem',
		padding: '0.5rem',
		maxWidth: '400px',
		height: '400px',
		margin: 'auto',
		color: 'white',
	},
};

const useModal = () => {
	return useReducer(
		(previousState: boolean): boolean => !previousState,
		false
	);
};

const CustomModal: React.FC<ModalProps> = ({
	isOpen,
	children,
	onRequestClose,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			style={customModalStyle}
		>
			<IoClose
				onClick={onRequestClose}
				className="block cursor-pointer rounded-md hover:bg-zinc-900 bg-transparent text-zinc-600"
				size={28}
			/>
			<div className="mx-1 h-[90%]">{children}</div>
		</Modal>
	);
};

export default CustomModal;
export { useModal };
