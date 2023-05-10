import React, { useState } from "react"
import Universe from '@/components/Universe'
import { Inter } from 'next/font/google'
import Body from "@/components/Body"
import Vector2 from "@/components/Vector2"

const inter = Inter({ subsets: ['latin'] })

type Resolution = {
	width: number 
	height: number
}

const random = (max?: number) => {
	if (max) {
		return Math.floor(Math.random() * max);
	}
	else {
		return Math.random();
	}
}

const clear = (canvas: CanvasRenderingContext2D, canvasSize: Resolution) => {
	canvas.clearRect(0, 0, canvasSize.width, canvasSize.height);
	canvas.fillStyle = "transparent";
	canvas.fillRect(0, 0, canvasSize.width, canvasSize.height);
}

export default function Home() {
	const [canvasSize, setCanvasSize] = useState<Resolution>({ width: 2560, height: 1300 })
	
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	
	const universe = new Universe()

	React.useEffect(() => {
		const canvas = canvasRef.current?.getContext("2d");
		if (canvas) {
			for (let i = 0; i < 2; i++) {
				// universe.addBody(new Body(3, "white"), random(canvasSize.width), random(canvasSize.height))
			}

			universe.addBody(new Body(3000, "yellow"), 1240, 650)
			
			const planet = new Body(3, "white")
			planet.velocity = new Vector2(0.0, -10.0);
			universe.addBody(planet, 300, 650)
			
			simulation(canvas)
		}
	}, [canvasSize])

	React.useEffect(() => {
		function handleResize() {
			if (canvasRef.current) {
				canvasRef.current.width = window.innerWidth;
				canvasRef.current.height = window.innerHeight;

				setCanvasSize({ width: window.innerWidth, height: window.innerHeight })
			}
		}
		
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	function simulation(context: CanvasRenderingContext2D) {
		clear(context, canvasSize)
	
		universe.update(0.5);		
		universe.draw(context, true);

		requestAnimationFrame(() => { simulation(context) });
	}

	return (
		<main className={`flex flex-col min-w-screen min-h-screen ${inter.className}`}>
			<div className="relative flex-1 bg-gradient-to-br from-slate-900/[0.25] via-purple-900/[0.2] to-slate-900/[0.3] w-full h-full">
				<div className="absolute flex items-center justify-center w-full h-full">
					<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:blur-2xl before:from-transparent before:to-blue-700 before:opacity-10 after:from-sky-900 after:via-[#0141cc] after:opacity-10 before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:blur-3xl after:content-[''] before:lg:h-[360px] opacity-60"></div>
				</div>

				<canvas ref={canvasRef} className="block"></canvas>
			</div>
		</main>
	)
}
