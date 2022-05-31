import {
	AiFillFileExcel,
	AiFillFileText,
	AiFillFileImage,
	AiFillFilePdf,
	AiFillFileWord,
	AiFillFilePpt,
	AiFillFileUnknown,
	AiFillVideoCamera,
} from 'react-icons/ai';

import type { IconType } from 'react-icons/lib';

export const fileIcons: Record<string, IconType> = {
	xlsx: AiFillFileExcel,
	docx: AiFillFileWord,
	image: AiFillFileImage,
	pptx: AiFillFilePpt,
	pdf: AiFillFilePdf,
	txt: AiFillFileText,
	video: AiFillVideoCamera,
	unkown: AiFillFileUnknown,
};

export function generalizeExtension(file_extension: string): string {
	switch (file_extension) {
		case 'jpg':
		case 'png':
		case 'tiff':
		case 'jpeg':
			return 'image';

		case 'mov':
		case 'mp4':
		case 'vid':
		case 'gif':
		case 'webm':
			return 'video';

		default:
			return 'unkown';
	}
}

/** Returns an IconType component based off of a file extension */
export function getIcon(fileExtension: string): IconType {
	if (!(fileExtension in fileIcons)) {
		fileExtension = generalizeExtension(fileExtension);
	}
	return fileIcons[fileExtension];
}

export type { IconType };
