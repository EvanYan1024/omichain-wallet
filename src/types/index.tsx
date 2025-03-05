export type Player = 'GREEN' | 'ORANGE';
export type BoardState = (Player | null)[];

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | null;
  selectedPiece: number | null;
}

export interface Point {
  x: number;
  y: number;
}

// Define valid connections between points (0-4 for the five positions)
export const VALID_MOVES: { [key: number]: number[] } = {
  0: [1, 3],     // Top-left to top and left
  1: [0, 2, 4],  // Top to top-left, top-right, and center
  2: [1, 4],     // Top-right to top and center
  3: [0, 4],     // Left to top-left and center
  4: [1, 2, 3]   // Center to top, top-right, and left
};

// Define the coordinates for each position
export const POINT_COORDINATES: Point[] = [
  { x: 50, y: 50 },    // Top-left (0)
  { x: 100, y: 50 },   // Top (1)
  { x: 150, y: 50 },   // Top-right (2)
  { x: 50, y: 150 },   // Left (3)
  { x: 100, y: 100 },  // Center (4)
];

