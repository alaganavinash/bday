// ---------------------------------------------------------------
// EDIT THIS FILE to personalize the site. Nothing else needs to change.
// ---------------------------------------------------------------
const SITE = {
  // Your friend's name
  name: "Someone Wonderful",

  // Short line under the name on the first screen
  tagline: "A small corner of the internet, made just for you.",

  // The birthday, in YYYY-MM-DDTHH:mm:ss format (local time).
  // The countdown on the page will tick down to this moment.
  birthdayDate: "2026-10-14T00:00:00",

  // The personal note in the "letter" section. Write from the heart.
  letter: {
    body: "Some friendships feel like family you found on your own. You've been there through the ordinary days and the hard ones, never once needing a reason. I don't say this enough, so I built you a whole page to say it properly: I'm endlessly grateful you're in my life. Thank you for every memory, every laugh, every time you showed up. Here's to many more years of this.",
    sign: "— Your Dood"
  },

  // Photos for the gallery. Put image files in the /images folder and
  // reference them here, e.g. "images/trip.jpg". Until you add real
  // photos, placeholder frames are shown automatically.
  photos: [
    { src: "", caption: "That one summer we never stopped talking about" },
    { src: "", caption: "The trip that almost didn't happen" },
    { src: "", caption: "Your laugh, mid-joke, as always" },
    { src: "", caption: "A perfectly ordinary, perfectly good day" },
    { src: "", caption: "Proof we used to dress like that" },
    { src: "", caption: "The one no one was supposed to see" }
  ],

  // Messages from friends & family. Add as many as you like.
  messages: [
    { from: "Mom", text: "Every year I get to watch you become more fully yourself. Happy birthday, my dear." },
    { from: "Your best friend", text: "You've seen me at my worst and stayed anyway. That's the whole friendship, really. Love you." },
    { from: "A coworker who adores you", text: "The office is simply less fun on days you're not in it. Happy birthday!" },
    { from: "Someone who's known you forever", text: "Remember when we thought we had it all figured out? We were wrong, and it was better this way." },
    { from: "Your sibling", text: "Still the most annoying person I love most. Happy birthday, brat." },
    { from: "A friend from far away", text: "Different time zone, same love. Wishing I could be there to celebrate in person." }
  ],

  // The puzzle on puzzle.html. "answer" is the correct number, shown big
  // on the success screen above "successLabel".
  puzzle: {
    question: "Double me, then take away 2, and you're left with 6. What number am I?",
    hint: "Work backwards: add 2 to 6, then undo the doubling.",
    answer: 4,
    successEyebrow: "You are correct",
    successLabel: "Days to Go",
    wrongMessage: "Not quite — give it another go."
  }
};
