import skribbleWords from "./words";

const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * skribbleWords.length);
  return skribbleWords[randomIndex];
};
export default getRandomWord;
