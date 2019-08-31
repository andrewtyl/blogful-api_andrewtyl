function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Youtube',
      description: 'a website for watching videos',
      url: 'http://www.youtube.com',
      rating: 4
    },
    {
      id: 2,
      title: 'Google',
      description: 'the best search engine around',
      url: 'http://www.google.com',
      rating: 5
    },
    {
      id: 3,
      title: 'Reddit',
      description: 'the front page of the internet',
      url: 'http://www.reddit.com',
      rating: 1
    }
  ];
}

module.exports = {
  makeBookmarksArray
}