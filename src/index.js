import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'regenerator-runtime/runtime';

function Square(props){
	return(
		<button className='square' onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true,
			xIsSelected: [],
			oIsSelect: []
		};
	}

	renderSquare(i){
		return (
			<Square 
				value={this.state.squares[i]}
				onClick={() => this.handleClick(i)}
			/>
		)
	}

	handleClick(i) {
		let squares = this.state.squares.slice();
		let xIsSelected = this.state.xIsSelected.slice();

		if(calculateWinner(squares) || squares[i]){
			return;
		}
		xIsSelected.push(i);
		const adversary = new Adversary(squares, i, xIsSelected);
		squares = adversary.opponent();
		this.setState({
			squares: squares,
			xIsSelected: xIsSelected,
		});
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner) {
			status = 'Vencedor: ' + winner;
		} else {
			status = 'Proximo jogador: ' + (this.state.xIsNext ? 'X' : 'O');
		}


		return(
			<div>
				<div className='status'>{status}</div>	
				<div className='board-row'>
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className='board-row'>
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className='board-row'>
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component{
	render(){
		return(
			<div className='game'>
				<Board />
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	];

	for(let i = 0; i < lines.length; i++) {
		const [a,b,c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

class Adversary extends React.Component {
	constructor(squares, playedX, xIsSelected) {
		super(squares, playedX);
		this.squares = squares;
		this.playedX = playedX;
		this.oIsSelect = [];
		this.playedO = null;
		this.lines = [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[1,4,7],
			[2,5,8],
			[0,4,8],
			[2,4,6]
		];
		this.xIsSelected = xIsSelected;
	}

	opponent() {
		const squares = this.squares.slice();
		squares[this.playedX] = 'X'
		this.squares = squares;
		if (this.xIsSelected.length === 1) {
			this.firstMove();
		} else {
			this.movementO();
		}
		squares[this.playedO] = 'O';
		this.oIsSelect.push(this.playedO)
		this.squres = squares;
		
		return this.squares
	}

	firstMove(){
		if (this.playedX === 4) {
			this.playedO = 0;
		} else {
			this.playedO = 4;
		}
	}

	movementO(){
		let winIsPossible = this.winIsPossible();
		if (winIsPossible) {
			return true;
		}
		this.doNotLose();
	}

	winIsPossible(){
		for(let j = 0; j < this.lines.length; j++){
			let cont = 0;
			let isA = true, isB = true, isC = true;
			const [a,b,c] = this.lines[j];
			if (this.oIsSelect.indexOf(a) !== -1) {
				cont++;
				isA = false;
			}
			if (this.oIsSelect.indexOf(b) !== -1) {
				cont++;
				isB = false;
			}
			if (this.oIsSelect.indexOf(c) !== -1) {
				cont++;
				isC = false;
			}
			if(cont === 2 && (this.squares[a] === null || this.squares[b] === null || this.squares[c] === null)){
				if (isA) {
					this.playedO = a;
				}
				if (isB) {
					this.playedO = b;
				}
				if (isC) {
					this.playedO = c;
				}
				return true;
			} 
		}
		return false;
	}

	doNotLose() {
		for(let i = 0; i < this.lines.length; i++){
			let cont = 0;
			let isA = true, isB = true, isC = true;
			const [a,b,c] = this.lines[i];
			if (this.xIsSelected.indexOf(a) !== -1) {
				cont++;
				isA = false;
			}
			if (this.xIsSelected.indexOf(b) !== -1) {
				cont++;
				isB = false;
			}
			if (this.xIsSelected.indexOf(c) !== -1) {
				cont++;
				isC = false;
			}
			if(cont === 2 && (this.squares[a] === null || this.squares[b] === null || this.squares[c] === null)){
				if (isA) {
					this.playedO = a;
				}
				if (isB) {
					this.playedO = b;
				}
				if (isC) {
					this.playedO = c;
				}
				return;
			}
			this.notBeClosed()
		}
	}

	notBeClosed(){
		if (
			(this.xIsSelected.indexOf(0) !== -1 && this.xIsSelected.indexOf(8) !== -1)
			|| (this.xIsSelected.indexOf(2) !== -1 && this.xIsSelected.indexOf(6) !== -1)
			) 
		{
			this.playedO = 1;
		} else if(this.xIsSelected.indexOf(4) !== -1 && this.squares[2] === null){
			this.playedO = 2;
		} else if (
			this.xIsSelected.indexOf(1) !== -1 && 
			this.xIsSelected.indexOf(3) !== -1 && 
			this.squares[0] === null
		) {
			this.playedO = 0;
		} else if (
			this.xIsSelected.indexOf(1) !== -1 && 
			this.xIsSelected.indexOf(5) !== -1 && 
			this.squares[2] === null
		) {
			this.playedO = 2;
		} else if (
			this.xIsSelected.indexOf(3) !== -1 && 
			this.xIsSelected.indexOf(7) !== -1 && 
			this.squares[6] === null
		) {
			this.playedO = 6;
		} else if (
			this.xIsSelected.indexOf(5) !== -1 && 
			this.xIsSelected.indexOf(7) !== -1 && 
			this.squares[8] === null
		) {
			this.playedO = 8;
		} else {
			for(let i = 0; i < this.squares.length; i++) {
				if (this.squares[i] === null) {
					this.playedO = i;
				}
			}
		}
	}
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
)