import { Player } from '../types';

interface StarPieceProps {
  player: Player | null;
  selected?: boolean;
  onClick: () => void;
}

export function StarPiece({ player, selected = false, onClick }: StarPieceProps) {
  if (!player) {
    return (
      <div 
        className="w-8 h-8 rounded-full bg-white/20 cursor-pointer"
        onClick={onClick}
      />
    );
  }

  return (
    <div
      className={`
        w-8 h-8 
        cursor-pointer 
        transition-all
        ${selected ? 'scale-110 ring-2 ring-white' : ''}
        ${player === 'GREEN' ? 'text-green-500' : 'text-orange-500'}
      `}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        <circle cx="8" cy="10" r="1" fill="white" />
        <circle cx="16" cy="10" r="1" fill="white" />
        <path d="M12 14.5C10.5 14.5 9.5 13.5 9.5 13.5C9.5 13.5 10.5 14.5 12 14.5C13.5 14.5 14.5 13.5 14.5 13.5C14.5 13.5 13.5 14.5 12 14.5Z" fill="white" />
      </svg>
    </div>
  );
}

