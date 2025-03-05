import React, { useState } from 'react';
import { Piece } from './piece';
import { BoardState, Player, Move } from '../types';

interface BoardProps {
  board: BoardState;
  currentPlayer: Player;
  onMove: (move: Move) => void;
}

export function Board({ board, currentPlayer, onMove }: BoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (selectedPiece === null) {
      if (board[index] === currentPlayer) {
        setSelectedPiece(index);
      }
    } else {
      onMove({ from: selectedPiece, to: index });
      setSelectedPiece(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((player, index) => (
        <Piece 
          key={index} 
          player={player} 
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}

