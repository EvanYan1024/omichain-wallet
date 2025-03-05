import { Player } from '../types';

interface PieceProps {
  player: Player | null;
  onClick: () => void;
}

export function Piece({ player, onClick }: PieceProps) {
  return (
    <div 
      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
        ${player === 'X' ? 'bg-blue-500 text-white' : 
          player === 'O' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
      onClick={onClick}
    >
      {player}
    </div>
  );
}

