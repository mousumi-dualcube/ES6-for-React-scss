import axios from 'axios'

const id = "8b0a4e48d2f16ae44da5";
const sec = "32a5a240e161f5df27a46fc68444db1a29605ff9";
const param = "?client_id=" + id + "&client_secret=" + sec;

function getUserInfo (username) {
  return axios.get('https://api.github.com/users/' + username + param);
}

function getRepos (username) {
  return axios.get('https://api.github.com/users/' + username + '/repos' + param + '&per_page=100');
}

function getTotalStars (repos) {
  return repos.data.reduce(function (prev, current) {
    return prev + current.stargazers_count
  }, 0)
}

function getPlayersData (player) {
  return getRepos(player.login)
    .then(getTotalStars)
    .then(function (totalStars) {
      return {
        followers: player.followers,
        totalStars: totalStars
      }
    })
}

function calculateScores (players) {
  return [
    players[0].followers * 3 + players[0].totalStars,
    players[1].followers * 3 + players[1].totalStars
  ]
}

export function getPlayersInfo (players) {
  return axios.all(players.map(function (username) {
    return getUserInfo(username)
  }))
  .then(function (info) {
    return info.map(function (user) {
      return user.data
    })
  })
  .catch(function (err) {console.warn('Error in getPlayersInfo: ', err)})
}

export function battle (players) {
  const playerOneData = getPlayersData(players[0]);
  const playerTwoData = getPlayersData(players[1]);
  return axios.all([playerOneData, playerTwoData])
    .then(calculateScores)
    .catch(function (err) {console.warn('Error in getPlayersInfo: ', err)})
}