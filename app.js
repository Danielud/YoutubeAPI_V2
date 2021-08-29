// Options

const CLIENT_ID =
  "746185015909-apth1g437is92qm6kq25867blpusp1pi.apps.googleusercontent.com";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/youtube";

const authorizeButton = document.getElementById("authorize-button");
const signoutButton = document.getElementById("signout-button");
// const content = document.getElementById("content");
// const channelForm = document.getElementById("channel-form");
// const channelInput = document.getElementById("channel-input");
// const videoContainer = document.getElementById("video-container");

// Load auth2 library
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

// Init API client library and set up sign in listeners
function initClient() {
  gapi.client
    .init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES,
    })
    .then(() => {
      // Listen for sign in state changes
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // Handle initial sign in state
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    // content.style.display = "block";
    // videoContainer.style.display = "block";
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
    // content.style.display = "none";
    // videoContainer.style.display = "none";
  }
}

// Handle login
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

// // Display channel data
// function showChannelData(data) {
//   const channelData = document.getElementById("channel-data");
//   channelData.innerHTML = data;
// }

// // Get Playlist Title
// function getChannel(channel) {
//   gapi.client.youtube.playlists
//     .list({
//       part: "snippet",
//       channelId: "UCTS9LuJANzU3dj8BoYw1XEA",
//     })
//     .then((Aresponse) => {
//       console.log(Aresponse);
//     })
//     .catch((err) => alert("No Channel By That Name"));
// }

// Get Playlist Items
// TODO:
//  Module: song name, artist name, length of the song, album cover
//   show me the first one :
//   if this is your song?
// if not give him the second one:
//  if yes add to "list of add to playlist"
// example: [{"50cent"},{"jayz"},{"nigga"},]
// add to playlist handler : -- this nigga job is only get the list and add to the playlist

function searchSong(name) {
  //form event
  inputForm = document.querySelector(".searchForm");
  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  //input
  let inputString = document.querySelector(".searchInput").value;
  fetchSongFromYoutube(inputString)
    .then((song) => {
      // videoId,title,photoURL
      console.log(song);
      addSongToPlaylist(song.videoId);
    })
    .catch((err) => alert("Youtube catch err"));
}

function addSongToPlaylist(video_id) {
  return new Promise((resolve, reject) => {
    // youtube
    gapi.client.youtube.playlistItems
      .insert({
        part: ["snippet"],
        resource: {
          snippet: {
            playlistId: "PLdJ2QAUvpImrF82tYtP6CJiEsT8K5YpRz",
            resourceId: {
              kind: "youtube#video",
              videoId: video_id,
            },
          },
        },
      })
      .then((res) => {
        alert(`added! ${res.result.snippet.title}`);
        a = document
          .querySelector(".history")
          .appendChild(res.result.snippet.title);
        resolve();
      })
      .catch((err) => alert("Youtube catch err"));
  }).catch((err) => alert("promise err"));
}

// promise
// videoId,title,photoURL
function fetchSongFromYoutube(userInput) {
  return new Promise((resolve, reject) => {
    gapi.client.youtube.search
      .list({
        part: "snippet",
        q: userInput,
      })
      .then((res) => {
        if (res.result.items.length) {
          let songMod = {
            videoId: res.result.items[0].id.videoId,
            title: res.result.items[0].snippet.title,
            photoURL: res.result.items[0].snippet.thumbnails.default.url,
          };
          resolve(songMod);
        }
      })
      .catch((err) => alert("youtube error"));
  }).catch((err) => alert("our promis catch err"));
}
