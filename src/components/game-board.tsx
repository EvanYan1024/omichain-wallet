import { useState } from 'react';
import { BoardState, Player, VALID_MOVES, POINT_COORDINATES } from '../types/index';
import { StarPiece } from './star-piece';

interface GameBoardProps {
  board: BoardState;
  currentPlayer: Player;
  selectedPiece: number | null;
  onMove: (from: number, to: number) => void;
  onSelect: (position: number | null) => void;
}

export function GameBoard({ 
  board = [], // Provide a default empty array
  currentPlayer, 
  selectedPiece, 
  onMove, 
  onSelect 
}: GameBoardProps) {
  const handleClick = (position: number) => {
    if (selectedPiece === null) {
      // If no piece is selected and clicked position has current player's piece
      if (board[position] === currentPlayer) {
        onSelect(position);
      }
    } else {
      // If a piece is selected
      const validMoves = VALID_MOVES[selectedPiece] || [];
      if (validMoves.includes(position) && !board[position]) {
        onMove(selectedPiece, position);
      } else {
        onSelect(null);
      }
    }
  };

  return (
    <div className="relative w-[300px] h-[300px] bg-sky-100 rounded-lg">
      {/* Draw connection lines */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 200 200"
      >
        {/* Draw lines connecting points */}
        <line x1="50" y1="50" x2="150" y2="50" stroke="white" strokeWidth="2" />
        <line x1="50" y1="50" x2="50" y2="150" stroke="white" strokeWidth="2" />
        <line x1="50" y1="50" x2="100" y2="100" stroke="white" strokeWidth="2" />
        <line x1="150" y1="50" x2="100" y2="100" stroke="white" strokeWidth="2" />
        <line x1="50" y1="150" x2="100" y2="100" stroke="white" strokeWidth="2" />
      </svg>

      {/* Place pieces */}
      {Array.isArray(POINT_COORDINATES) && POINT_COORDINATES.map((point, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${point.x}%`, 
            top: `${point.y}%` 
          }}
        >
          <StarPiece
            player={board[index]}
            selected={selectedPiece === index}
            onClick={() => handleClick(index)}
          />
        </div>
      ))}
    </div>
  );
}

