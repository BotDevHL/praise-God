const CACHE_NAME = "scripture-sanctuary-v1";

/* CORE OFFLINE FILES */
const OFFLINE_URLS = [
  "./",
  "index.html",
  "manifest.json",
  "service-worker.js",

  /* MUSIC FILES */
  "https://files.catbox.moe/frtvpr.mp3",
  "https://files.catbox.moe/q0n9yh.mp3"
];

/* ADD ALL 66 BIBLE BOOK JSON FILES */
const bibleBooks = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges",
  "Ruth","1Samuel","2Samuel","1Kings","2Kings","1Chronicles","2Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes",
  "SongofSolomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
  "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John",
  "Acts","Romans","1Corinthians","2Corinthians","Galatians","Ephesians",
  "Philippians","Colossians","1Thessalonians","2Thessalonians","1Timothy",
  "2Timothy","Titus","Philemon","Hebrews","James","1Peter","2Peter",
  "1John","2John","3John","Jude","Revelation"
];

bibleBooks.forEach(book => {
  OFFLINE_URLS.push("bible/" + book + ".json");
});

/* INSTALL SW */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

/* ACTIVATE SW */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* FETCH HANDLER (OFFLINE FIRST) */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        if (event.request.destination === "document") {
          return caches.match("index.html");
        }
      });
    })
  );
});
