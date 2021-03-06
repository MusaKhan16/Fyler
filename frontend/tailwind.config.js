module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			gridTemplateRows: {
				'burger-layout': 'auto 1fr auto',
			},
			gridTemplateColumns: {
				responsive: 'repeat(auto-fill, minmax(300px, 1fr))',
				input: '1fr 55px',
			},
			colors: {
				theme: 'hsl(229, 57%, 11%)',
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'translateX(1px)' },
					'50%': { transform: 'translateX(-1px)' },
				},
			},
			animation: {
				wiggle: 'wiggle 0.2s ease-in-out',
			},
			transitionTimingFunction: {
				bubble: 'cubic-bezier(.68,-1.2,.27,1.55)',
			},
		},
	},
	plugins: [],
};
