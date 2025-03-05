'use client'

import { GameBoard } from '../components/game-board';
import { JumpWellGame } from '../components/jump-game';
import { useGameLogic } from '../hooks/useGameLogic';

export default function Game() {
  const { gameState, selectPiece, makeMove, resetGame } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">跳井棋</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <GameBoard 
          board={gameState.board}
          currentPlayer={gameState.currentPlayer}
          selectedPiece={gameState.selectedPiece}
          onSelect={selectPiece}
          onMove={makeMove}
        />
        <div className="mt-4 text-center">
          {gameState.winner ? (
            <p className="text-xl font-semibold">
              {`${gameState.winner === 'GREEN' ? '绿色' : '橙色'}玩家获胜!`}
            </p>
          ) : (
            <p className="text-xl">
              当前玩家: {gameState.currentPlayer === 'GREEN' ? '绿色' : '橙色'}
            </p>
          )}
        </div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={resetGame}
        >
          重新开始
        </button>
      </div>
      <JumpWellGame/>
    </div>
  );
}

