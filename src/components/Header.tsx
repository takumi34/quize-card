export const Header: React.FC = () => {
  return (
    <div className="w-full mb-4">
      <p className="text-xs sm:text-sm text-gray-600 text-center">
        Made by{" "}
        <a
          href="https://github.com/takumi34"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800 underline decoration-purple-400 hover:decoration-purple-600 transition-colors duration-200 font-semibold"
        >
          takumi34
        </a>
      </p>
    </div>
  );
};
