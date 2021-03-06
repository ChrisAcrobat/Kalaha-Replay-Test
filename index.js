'use strict'
function a(){
	let data = JSON.parse(decodeURI(location.hash.substring(1)));
	let firstMover = data.log[0].mover;
	let baseDown = data.settings.gameboard.boardLength;
	let baseUp = baseDown*2 + 1;
	let slider = document.getElementById('slider');
	{
		let first = data.log[0].mover;
		document.getElementById('first-player').innerHTML = first;
		let secund = document.getElementById('secund-player')
		for(let index = 0; index < data.log.length; index++) {
			const log = data.log[index];
			if(log.mover !== first){
				secund.innerHTML = log.mover;
			}
		}
		if(secund.innerHTML === ''){
			secund.innerHTML = first;
		}
	}
	let buttonBack = document.getElementById('step-back');
	let buttonNext = document.getElementById('step-next');
	buttonBack.addEventListener('click', step);
	buttonNext.addEventListener('click', step);
	slider.max = data.log.length;
	slider.addEventListener('input', event=>{
		setBoard(slider.valueAsNumber - 1);
	});
	window.onresize = resizeGameboard;
	setBoard();
	function step(mouseEvent){
		slider.valueAsNumber += mouseEvent.target === buttonNext ? 1 : -1;
		setBoard(slider.valueAsNumber - 1);
	}
	function setBoard(logIndex=-1){
		buttonBack.disabled = slider.valueAsNumber === 0;
		buttonNext.disabled = slider.valueAsNumber === data.log.length;
		let log = -1 < logIndex ? data.log[logIndex] : null;
		let state = log !== null ? log.gameboard.slice() : null;
		if(log !== null && log.mover !== firstMover){
			for(let i = 0; i < state.length/2; i++) {
				state.push(state.shift())
			}
		}
		// Rezero base columns.
		document.getElementById('column-up').innerHTML = '<div id="square_' + baseUp + '" class="square square-up">' + (state === null ? 0 : state[baseUp]) + '</div>';
		document.getElementById('column-down').innerHTML = '<div id="square_' + baseDown + '" class="square">' + (state === null ? 0 : state[baseDown]) + '</div>';

		// Recreate up and down rows.
		let rowUp = document.getElementById('rowUp');
		let rowDown = document.getElementById('rowDown');
		rowUp.innerHTML = '';
		rowDown.innerHTML = '';
		let boardSize = data.settings.gameboard.boardLength;
		let startValue = data.settings.gameboard.startValue;
		for(let index = 0; index < boardSize; index++){
			let indexUp = (boardSize*2 - index);
			let indexDown = index;
			rowUp.innerHTML += '<div id="square_' + indexUp + '" class="square square-up">' + (state === null ? startValue : state[indexUp]) + '</div>';
			rowDown.innerHTML += '<div id="square_' + indexDown + '" class="square">' + (state === null ? startValue : state[indexDown]) + '</div>';
		}

		// Customize squares
		//let baseUpSquare = document.getElementById('square_' + baseUp);
		//let baseDownSquare = document.getElementById('square_' + baseDown);
		//baseUpSquare.style.backgroundColor = colorBaseUp; // TODO: Set team color.
		//baseDownSquare.style.backgroundColor = colorBaseDown; // TODO: Set team color.

		resizeGameboard();
	}
	function resizeGameboard(){
		let gameboard = document.getElementById('gamebord');
		let allSquares = [...document.getElementsByClassName('square')];
		gameboard.style.zoom = 1;
		let maxWidth = allSquares[0].clientHeight;
		// Get max
		for(let square of allSquares){
			square.style.width = '';
			maxWidth = Math.max(maxWidth, square.clientWidth);
		}
		// Set max
		for(let square of allSquares){
			square.style.width = maxWidth + 'px';
		}
		let zoom = gameboard.parentElement.offsetWidth / gameboard.offsetWidth;
		gameboard.style.zoom = zoom;
	}
}
