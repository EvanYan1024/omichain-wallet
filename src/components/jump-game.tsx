import React, { useState } from "react";

export const JumpWellGame = () => {
  // 初始棋子位置
  const initialPositions = {
    green: [0, 3], // 绿色棋子位置
    orange: [2, 5], // 橙色棋子位置
  };

  const [positions, setPositions] = useState(initialPositions);
  const [turn, setTurn] = useState("green"); // 当前轮到谁

  // 棋盘上的点
  const points = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const isValidMove = (current, target) => {
    // 仅允许一步的移动
    const diff = Math.abs(current - target);
    return diff === 1 || diff === 3;
  };

  const handleMove = (index) => {
    const currentPlayer = turn;
    const currentPositions = positions[currentPlayer];

    if (!currentPositions.includes(index)) {
      const emptyCell = currentPositions.find((pos) =>
        isValidMove(pos, index)
      );

      if (emptyCell !== undefined) {
        const updatedPositions = {
          ...positions,
          [currentPlayer]: currentPositions.map((pos) =>
            pos === emptyCell ? index : pos
          ),
        };

        setPositions(updatedPositions);
        setTurn(turn === "green" ? "orange" : "green");
      }
    }
  };

  const renderCell = (index) => {
    let color = "";
    if (positions.green.includes(index)) color = "bg-green-400";
    if (positions.orange.includes(index)) color = "bg-orange-400";

    return (
      <div
        key={index}
        className={`w-16 h-16 border flex items-center justify-center ${color}`}
        onClick={() => handleMove(index)}
      >
        {color && <span className="w-12 h-12 rounded-full"></span>}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-2xl font-bold mb-6">跳井棋</h1>
      <div className="grid grid-cols-3 gap-1">
        {points.flat().map((index) => renderCell(index))}
      </div>
      <p className="mt-4">
        当前回合: <span className="font-bold">{turn === "green" ? "绿色" : "橙色"}</span>
      </p>
    </div>
  );
};

