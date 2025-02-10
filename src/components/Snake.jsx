import React, { useState, useEffect } from "react";

const Snake = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  const checkCollision = (head) => {
    // Wall collision
    if (head.x < 0 || head.x > 19 || head.y < 0 || head.y > 19) {
      return true;
    }
    // Self collision
    return snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    const moveInterval = setInterval(() => {
      if (gameOver) return;

      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
          default:
            break;
        }

        if (checkCollision(head)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          generateFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => {
      clearInterval(moveInterval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction, food, gameOver, snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setGameOver(false);
    generateFood();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "400px",
          height: "400px",
          position: "relative",
          margin: "20px auto",
          border: "2px solid black",
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              backgroundColor: "green",
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              border: "1px solid darkgreen",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            backgroundColor: "red",
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
            border: "1px solid darkred",
          }}
        />
      </div>
      {gameOver && (
        <div>
          <div style={{ color: "red", marginBottom: "10px" }}>Game Over!</div>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Snake;
