// ---------------------------------------------------------------
// EDIT THIS FILE to personalize the site. Nothing else needs to change.
// ---------------------------------------------------------------
const SITE = {
  // Your friend's name
  name: "Inthuja",

  // Short line under the name on the first screen
  tagline: "A small corner of the internet, made just for you.",

  // The birthday, in YYYY-MM-DDTHH:mm:ss format (local time).
  // The countdown on the page will tick down to this moment.
  birthdayDate: "2026-10-14T00:00:00",

  // The personal note in the "letter" section. Write from the heart.
  letter: {
    title: "Happy Birthday Dood ❣️🎂",
    // Leave a blank line between paragraphs. Wrap text in **double stars** to make it bold.
    body: `Indha year unakku pudichadhu ellam kondu varum.
Indha year nee wish panradhu ellam kondu varum.
Indha year nee dream panradhu ellam kondu varum.

Vera enna?

Indha year unakku deserve aanadhu ellam kondu varum!
Nee en best friend ah irukradhu dhan en life ah complete aakudhu. Adhu podhum, adhu mattum dhan ennaku venum. 🥺❣️

Quality la unakku equal ah yaarumae nikka mudiyadhu, Dood. ❣️💯

Indha world kudukura ella happiness um unakku deserve dhan. Nee en light 🕯️, en comfort, en pet, ellamae onna irundhuruka. Adha edhukkaagavum naan trade panna maaten.

Naan already sonna Madhri real friendship epdi irukkum nu enakku kaatunadhu nee dhan, pure and honest ah.

So inniki, simple ah oru thanks solla nenaikiren. Nee nee ah irukradhukku, and unnoda dominance character ku. 😌❣️😒

**"Next year un b'day ku nee inga irukkanum! Naan indha year-ae prebook panniten, so nee inga irukkanum. Avlo dhan. 😒"** Itha naan last year sonnen. Ippo nee inga irruka

Nee India vandhadhu yaaruku epdiyo therila but ennaku edho ennoda innoru kai kedacha madhri irruku.

And naan kandippa thanks solliyae aaganum. Unnaku epdi theridhu therila. Unnoda friend aana andha moment la irrundhu ipo varikum ennaku onnu na thairiyama solla ennaku oruthar irrukanga na adhu nee mattum dhan. Nijamavae romba romba thanks dood.

Nee just en best friend illa. Nee en favourite person, en story la best part. ✨

Ennoda story la biggest part dood nee.!

Nee illana indha dood anathaya dhan irrundhrupen.

I wish you all the good dood. I wish you to succeed more than me! Enna vida nee nalla varanum. Ennaku adhan aasai. I mean it!

Ennoda happiness, sadness, ennoda edhu naalum naan solra ore aal nee dhan.

Not exaggregating but you are 1000/10

Anything for my dood <3
Once again, Happy Birthday my Dood! 🎂❣️`,
    sign: "— Your Dood"
  },

  // Photos for the gallery. Put image files in the /images folder and
  // reference them here, e.g. "images/trip.jpg". Until you add real
  // photos, placeholder frames are shown automatically. Optional `focus`
  // picks which part of a tall photo the card shows ("50% 12%" = near the top).
  photos: [
    { src: "images/photo1.jpg", caption: "Tiny, all dressed up, and already the main character" },
    { src: "images/photo2.jpg", caption: "Sea breeze, wild hair, and that laugh" },
    { src: "images/photo3.jpg", caption: "A heart-shaped cake for the person with the biggest heart" },
    { src: "images/photo4.jpg", caption: "AHBD Inthu, written in sauce, because the plate deserved it too" },
    { src: "images/photo5.jpg", caption: "Two candles, one wish, all for you" },
    { src: "images/photo6.jpg", caption: "Cake in one hand, sunshine in the other" },
    { src: "images/photo7.jpg", caption: "A whole birthday party, packed into a car boot" },
    { src: "images/photo8.jpg", caption: "Crowned queen of the office, cake and all", focus: "50% 12%" }
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

  // ---------- The secret hunt ----------
  // Every secret below is hidden somewhere on the site. Finding all of them
  // breaks the seal on the letter. Titles appear once found; hints are
  // tucked away in the basket (top-right) while a secret is still hidden.
  // Tip: add ?reset to the URL to hide everything again after testing.
  eggs: [
    { id: "name",    title: "Say my name",    hint: "Some names like being poked. Five times, quickly." },
    { id: "wish",    title: "Make a wish",    hint: "Every flame on the cake has to go out." },
    { id: "hidden",  title: "Sharp eyes",     hint: "A tiny egg is hiding in plain sight. Look around the cake." },
    { id: "sealed",  title: "Curiosity wins", hint: "One memory says do not open. Since when do you listen?" },
    { id: "scratch", title: "Lucky scratch",  hint: "Something golden is covering a message. Use your finger." },
    { id: "vault",   title: "Safe cracker",   hint: "Four digits. A day and a month you should know by heart." },
    { id: "petals",  title: "Petal catcher",  hint: "Things keep falling all around you. Catch ten of them." },
    { id: "match",   title: "Perfect match",  hint: "Just before the letter, flip the cards and pair up every photo." }
  ],

  // The cake: how many candles, and what shows once they're all out.
  cake: {
    candles: 5,
    wishMessage: "Wish made. I won't ask what it was."
  },

  // The gold scratch card.
  scratch: {
    label: "scratch me",
    kicker: "a coupon, valid forever",
    message: "Good for one whole day of doing whatever you want. No complaints from me."
  },

  // The "do not open" card in the gallery (takes three taps to open).
  sealedPhoto: {
    message: "Okay, you opened it. This one's just for you: you make every ordinary day better. Don't let it go to your head."
  },

  // The vault: a keypad that opens with this code.
  vault: {
    code: "1410",
    hint: "Psst: a day and a month. Yours.",
    message: "Inside the vault: the fact that you're the first person I'd call about anything. That's the treasure. Sorry, no gold."
  },

  // The memory game before the letter: each photo appears twice.
  // `focus` keeps her face inside the small square cards.
  match: {
    photos: [
      { src: "images/match/match1.jpg", focus: "50% 0%" },
      { src: "images/match/match2.jpg", focus: "50% 10%" },
      { src: "images/match/match3.jpg", focus: "50% 31%" },
      { src: "images/match/match4.jpg", focus: "50% 27%" },
      { src: "images/match/match5.jpg", focus: "50% 5%" },
      { src: "images/match/match6.jpg", focus: "50% 38%" }
    ],
    winMessage: "Every pair found. Just like us."
  }
};
