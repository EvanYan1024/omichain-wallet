import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useDominantColor } from "../hooks/useDominantColor";

interface CardData {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  dominantColor?: string;
}

const DraggableCards: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // 初始化卡片数据
  useEffect(() => {
    const fetchInitialCards = async () => {
      setLoading(true);
      try {
        const initialCards = await Promise.all(
          Array.from({ length: 5 }, (_, i) => generateCard(i.toString()))
        );
        setCards(initialCards);
      } catch (error) {
        console.error("Error fetching initial cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCards();
  }, []);

  // 生成新卡片
  const generateCard = async (id: string): Promise<CardData> => {
    const topics = [
      "architecture",
      "nature",
      "travel",
      "technology",
      "minimal",
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const width = 600;
    const height = 400;
    const imageUrl = `https://source.unsplash.com/random/${width}x${height}?${randomTopic}`;

    return {
      id,
      imageUrl,
      title: `MAGNA ${randomTopic.toUpperCase()}`,
      description: "一个未被发现的宝藏，将成为地球上独一无二的地方。",
    };
  };

  // 当卡片被拖走时添加新卡片
  const handleCardRemove = async () => {
    const newCard = await generateCard(Date.now().toString());
    setCards((prevCards) => [...prevCards.slice(1), newCard]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden flex justify-center items-center bg-gray-100">
      <div ref={cardsContainerRef} className="relative w-80 h-[500px]">
        <AnimatePresence>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={index}
              onRemove={handleCardRemove}
              totalCards={cards.length}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface CardProps {
  card: CardData;
  index: number;
  onRemove: () => void;
  totalCards: number;
}

const Card: React.FC<CardProps> = ({ card, index, onRemove, totalCards }) => {
  const { dominantColor, imageRef } = useDominantColor();
  const [cardColor, setCardColor] = useState<string>("#000000");
  const isFirstCard = index === 0;

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0]);
  const scale = useTransform(y, [0, 100], [1, 0.9]);

  const zIndex = totalCards - index;
  const cardOffset = index * 15; // 卡片堆叠偏移量

  useEffect(() => {
    if (dominantColor) {
      setCardColor(dominantColor);
    }
  }, [dominantColor]);

  const handleDragEnd = () => {
    if (y.get() > 150 && isFirstCard) {
      onRemove();
    }
  };

  return (
    <motion.div
      className="absolute top-0 left-0 w-full rounded-3xl overflow-hidden"
      style={{
        y: isFirstCard ? y : cardOffset,
        zIndex,
        opacity: isFirstCard ? opacity : 1 - index * 0.15,
        scale: isFirstCard ? scale : 1 - index * 0.05,
        boxShadow: cardColor ? `0 20px 60px -10px ${cardColor}80` : "none",
        background: "#1a1a1a",
      }}
      drag={isFirstCard ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: isFirstCard ? 0 : cardOffset, opacity: 1 }}
      exit={{ y: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full aspect-[3/4] bg-black text-white">
        <img
          ref={imageRef}
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-3/4 object-cover"
        />
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-gray-700 bg-opacity-50 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
        <div className="p-4 h-1/4 flex flex-col justify-between">
          <h2 className="text-xl font-bold">{card.title}</h2>
          <p className="text-sm text-gray-300">{card.description}</p>
          <button
            className="mt-2 px-4 py-2 bg-gray-800 rounded-full text-sm flex items-center space-x-1 w-fit"
            style={{ backgroundColor: cardColor ? `${cardColor}40` : "#333" }}
          >
            <span className="text-white">$ 投资未来</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DraggableCards;
