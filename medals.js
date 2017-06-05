export const MEDALS = {
  bronze: {
    secondsPerAnswer: 5,
    img: './medal_images/bronze_medal.png',
  },
  silver: {
    secondsPerAnswer: 3,
    img: './medal_images/silver_medal.png',
  },
  gold: {
    secondsPerAnswer: 1.5,
    img: './medal_images/gold_medal.png',
  },
  getNext: cur => {
    switch (cur) {
      case null:
        return 'bronze';
      case 'bronze':
        return 'silver';
      case 'silver':
        return 'gold';
      case 'gold':
        return null;
      default:
        throw 'Invalid current medal specified';
    }
  },
}
