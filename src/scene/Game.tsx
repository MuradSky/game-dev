import { memo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import bg from '@/assets/images/background-scene.png';
import Person from '@/assets/svg/person-1.svg?react';
import styles from './Game.module.css';

const Game = () => {
	const container = useRef<HTMLDivElement | null>(null);

	useGSAP(() => {
		let timeOut: NodeJS.Timeout | null = null;
		if (timeOut) clearTimeout(timeOut);

		timeOut = setTimeout(() => {
			if (timeOut) clearTimeout(timeOut);
			const rect = container.current?.querySelector('[data-selector="game.bg"]')?.getBoundingClientRect();
			if (container.current && rect) {
				gsap.to('[data-selector="game.bg"]', {
					x: -rect.width, 
					duration: 10,
					ease: "linear",
					repeat: -1,
				});
			}
		}, 100);

		const person = container.current?.querySelector('[data-selector="game.person"]');
		const tl = gsap.timeline();
		let isJumbEnd = true;
		let isJump = false;
		const onJumping = (e: KeyboardEvent) => {
			console.log(e);
			if (!isJumbEnd && isJump) return;
			if (e.keyCode === 32 || e.keyCode === 38) {
				isJump = true;
				isJumbEnd = false;
				e.preventDefault();
				if (person) {					
					gsap.to(person, {
						y: -300,
						x: 150,
						duration: .8,
						ease: "back.out(1.4)",
						onComplete() {
							tl.to(person, {
								x: 0,
								y: 0,
								ease: "power1.out",
								duration: 1.5,
								onComplete() {
									isJump = false;
									isJumbEnd = true;
									  
									// if (!isJump) {
									// 	tl.to(person, {
									// 		x: 0,
									// 		duration: 1,
									// 		onComplete() {
									// 			isJumbEnd = true;
									// 		}
									// 	})
									// }
								}
							});
						}
					})
				}
			}
		}

		window.addEventListener('keydown', onJumping);

		return () => {
			clearTimeout(timeOut);
			window.removeEventListener('keydown', onJumping);
		}
	}, {
		scope: container
	});

	return (
		<div ref={container} className={styles.container}>
			<div className={styles.bg}>
				<picture>
					<img src={bg} alt="" data-selector="game.bg" />
					<img src={bg} alt="" data-selector="game.bg" />
				</picture>
			</div>
			<div className={styles.person} data-selector="game.person">
				<Person />
			</div>
		</div>
	);
};

export default memo(Game);