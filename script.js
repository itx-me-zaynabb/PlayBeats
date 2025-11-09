console.log("Welcome to PlayBeats");

// ELEMENTS
let songIndex = 0;
let audioElement = new Audio("Audios/1.mp3"); // default
const masterPlay = document.getElementById("masterPlay");
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const myProgressBar = document.getElementById("myProgressBar");
const gif = document.getElementById("gif");
const masterSongName = document.getElementById("masterSongName");

let songItems = Array.from(document.getElementsByClassName("songItem"));

// SONG DATA (ensure these file paths match your Audios/ folder)
let songs = [
  {
    songName: "Let me Love You",
    filePath: "Audios/1.mp3",
    coverPath: "photos/10.jpg",
  },
  {
    songName: "Salam e ishq",
    filePath: "Audios/2.mp3",
    coverPath: "photos/2.jpg",
  },
  { songName: "No Love", filePath: "Audios/3.mp3", coverPath: "photos/3.jpg" },
  {
    songName: "Old Money",
    filePath: "Audios/4.mp3",
    coverPath: "photos/4.jpg",
  },
  { songName: "STFU", filePath: "Audios/1.mp3", coverPath: "photos/5.jpg" },
  { songName: "IDK How", filePath: "Audios/2.mp3", coverPath: "photos/6.jpg" },
  { songName: "Cheques", filePath: "Audios/3.mp3", coverPath: "photos/7.jpg" },
  { songName: "Dil Nu", filePath: "Audios/4.mp3", coverPath: "photos/8.jpg" },
  { songName: "Khayal", filePath: "Audios/1.mp3", coverPath: "photos/9.jpg" },
  { songName: "Afsos", filePath: "Audios/2.mp3", coverPath: "photos/1.jpg" },
];

// populate song items (covers and names)
songItems.forEach((element, i) => {
  if (songs[i]) {
    const img = element.getElementsByTagName("img")[0];
    const nameEl = element.getElementsByClassName("songName")[0];
    if (img) img.src = songs[i].coverPath;
    if (nameEl) nameEl.innerText = songs[i].songName;
  }
});

// helper: reset all small play icons to play
const makeAllPlays = () => {
  Array.from(document.getElementsByClassName("songItemPlay")).forEach((el) => {
    el.classList.remove("fa-pause");
    el.classList.add("fa-play");
  });
};

// helper: play a specific song by index
function playSongAtIndex(index) {
  if (index < 0) index = songs.length - 1;
  if (index >= songs.length) index = 0;
  songIndex = index;

  // update audio source
  audioElement.src = songs[songIndex].filePath;
  audioElement.currentTime = 0;
  audioElement.play().catch((err) => {
    console.warn("Playback failed:", err);
  });

  // update UI
  masterPlay.classList.remove("fa-play");
  masterPlay.classList.add("fa-pause");
  gif.style.opacity = 1;
  masterSongName.innerText = songs[songIndex].songName;

  // update small icons: set clicked item to pause icon
  makeAllPlays();
  const smallIcon = document.getElementById(String(songIndex));
  if (smallIcon) {
    smallIcon.classList.remove("fa-play");
    smallIcon.classList.add("fa-pause");
  }
}

// master play/pause toggle
masterPlay.addEventListener("click", () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    masterPlay.classList.remove("fa-play");
    masterPlay.classList.add("fa-pause");
    gif.style.opacity = 1;
    // set small icon for current playing song
    makeAllPlays();
    const smallIcon = document.getElementById(String(songIndex));
    if (smallIcon) {
      smallIcon.classList.remove("fa-play");
      smallIcon.classList.add("fa-pause");
    }
  } else {
    audioElement.pause();
    masterPlay.classList.remove("fa-pause");
    masterPlay.classList.add("fa-play");
    gif.style.opacity = 0;
    makeAllPlays();
  }
});

// progress update
audioElement.addEventListener("timeupdate", () => {
  if (!isNaN(audioElement.duration) && audioElement.duration > 0) {
    const progress = parseInt(
      (audioElement.currentTime / audioElement.duration) * 100
    );
    myProgressBar.value = progress;
  }
});

myProgressBar.addEventListener("change", () => {
  if (!isNaN(audioElement.duration) && audioElement.duration > 0) {
    audioElement.currentTime =
      (myProgressBar.value * audioElement.duration) / 100;
  }
});

// clicking item play buttons
Array.from(document.getElementsByClassName("songItemPlay")).forEach(
  (element, index) => {
    element.addEventListener("click", (e) => {
      // if clicking the currently playing item -> toggle pause/play
      const clickedIndex = parseInt(e.target.id);

      if (clickedIndex === songIndex && !audioElement.paused) {
        // currently playing -> pause
        audioElement.pause();
        e.target.classList.remove("fa-pause");
        e.target.classList.add("fa-play");
        masterPlay.classList.remove("fa-pause");
        masterPlay.classList.add("fa-play");
        gif.style.opacity = 0;
        return;
      }

      // start new song
      playSongAtIndex(clickedIndex);
    });
  }
);

// next / previous buttons
nextBtn.addEventListener("click", () => {
  playSongAtIndex(songIndex + 1);
});

previousBtn.addEventListener("click", () => {
  playSongAtIndex(songIndex - 1);
});

// when a song ends, auto-play next
audioElement.addEventListener("ended", () => {
  playSongAtIndex(songIndex + 1);
});
