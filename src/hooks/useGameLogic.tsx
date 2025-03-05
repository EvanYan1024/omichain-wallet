import { useState, useCallback } from 'react';
import { GameState, Player, VALID_MOVES } from '../types';

const initialState: GameState = {
  board: [
    'GREEN', 'GREEN', 'ORANGE',
    'ORANGE', null
  ],
  currentPlayer: 'GREEN',
  winner: null,
  selectedPiece: null,
};

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const checkWinner = useCallback((board: (Player | null)[], currentPlayer: Player): Player | null => {
    const opponent = currentPlayer === 'GREEN' ? 'ORANGE' : 'GREEN';
    const opponentPieces = board
      .map((piece, index) => piece === opponent ? index : -1)
      .filter(index => index !== -1);

    // Check if any opponent piece can move
    const canMove = opponentPieces.some(piecePos => {
      const validMoves = VALID_MOVES[piecePos] || [];
      return validMoves.some(movePos => !board[movePos]);
    });

    return canMove ? null : currentPlayer;
  }, []);

  const selectPiece = useCallback((position: number | null) => {
    setGameState(prev => ({
      ...prev,
      selectedPiece: position,
    }));
  }, []);

  const makeMove = useCallback((from: number, to: number) => {
    setGameState(prev => {
      const newBoard = [...prev.board];
      newBoard[to] = newBoard[from];
      newBoard[from] = null;

      const nextPlayer = prev.currentPlayer === 'GREEN' ? 'ORANGE' : 'GREEN';
      const winner = checkWinner(newBoard, prev.currentPlayer);

      return {
        board: newBoard,
        currentPlayer: nextPlayer,
        winner,
        selectedPiece: null,
      };
    });
  }, [checkWinner]);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  return {
    gameState,
    selectPiece,
    makeMove,
    resetGame,
  };
}

