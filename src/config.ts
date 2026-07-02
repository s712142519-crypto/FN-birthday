/**
 * Romantic Birthday Surprise - Configuration File
 * Easily customize your companion's name, birthday, password, letter content,
 * songs, photos, and video links here.
 */

export const BIRTHDAY_CONFIG = {
  // Recipient's Name
  recipientName: "My Love",

  // Sender's Name
  senderName: "Yours Forever",

  /**
   * Birthday Date and Time (Format: YYYY-MM-DDTHH:mm:ss)
   * The countdown timer counts down to this target.
   * If the current local time passes this date, the site unlocks automatically!
   */
  birthdayDate: "2026-06-25T00:00:00",

  /**
   * Password
   * Enter this password on the lock screen to unlock the site ahead of time.
   */
  password: "love",

  /**
   * Passcode Hint
   * Displayed on the lock screen below the inputs.
   */
  passwordHint: 'Hint: Tap passcode "love"',

  /**
   * Passcode Screen Photo
   * Custom photo shown on the polaroid frame on the password screen.
   * Can be a local path like "/src/photos/lockscreen.jpg" or an Unsplash URL.
   */
  lockScreenPhoto: "/photos/lockscreen.jpg",
  /**
   * Floating Elements Styling
   */
  aesthetic: {
    snowColor: "rgba(255, 255, 255, 0.85)",
    heartColor: "#df2a5f",
    backgroundColorClass: "bg-neutral-950 text-purple-100",
    themeColor: {
      primary: "purple",
      accent: "rose",
    }
  },

  /**
   * Personal Love Letter
   * Revealed after completing the balloon pop mini-game.
   */
  loveLetter: {
    title: "To My Most Precious One,",
    paragraphs: [
      "Happy Birthday to the one who makes my heart skip a beat, the keeper of my sweetest smiles, and the laughter in my everyday life. From the moment you walked into my world, you've painted it with colors I never knew existed.",
      "Every single day is a gift because you're in it, but today is the most special of all because it's the day you were born. I wish I could gather all the stars in the evening sky and lay them at your feet, just to see the sparkle in your eyes.",
      "You inspire me to be a better person, you support me when I stumble, and your embrace is my safest place in this chaotic universe. Thank you for being your perfectly beautiful self, for sharing your warmth with me, and for loving me just as I am.",
      "I hope this little digital corner brings a smile to your beautiful face and reminds you of how deeply and unconditionally you are loved. Not just today, but every single tick of the clock, every heartbeat, forever and always.",
    ],
    signature: "Happy Birthday, My Angel! ❤️"
  },

  /**
   * Songs Playlist
   * Local paths: /songs/...
   * We list the exact requested filenames in the local folders so they are auto-detected.
   * We also provide high-quality fallback streaming links so the application works seamlessly
   * even before the actual MP3 files are added!
   */
  songs: [
    {
      id: "Aaruyire",
      title: "Aaruyire",
      artist: "A. R. Rahman",
      filePath: "/songs/Aaruyire.mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: "Kesariya Tera ",
      title: "Kesariya Tera ",
      artist: "A. R. Rahman",
      filePath: "/songs/Kesariya Tera .mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: "Rathinamey",
      title: "Rathinamey",
      artist: "A. R. Rahman",
      filePath: "/songs/Rathinamey.mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
      id: "Senorita ",
      title: "Senorita ",
      artist: "Shawn Mendes & Camila Cabello",
      filePath: "/songs/Senorita .mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
      id: "Shaky",
      title: "Shaky",
      artist: "Lofi Dreamer",
      filePath: "/songs/Shaky.mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
      id: "Thangamey",
      title: "Thangamey",
      artist: "Murugavel",
      filePath: "/songs/Thangamey.mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    {
      id: "Thimiru-Kaattaadha-Di",
      title: "Thimiru Kaattaadha Di",
      artist: "A. R. Rahman",
      filePath: "/songs/Thimiru-Kaattaadha-Di.mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
    },
    {
      id: "Vidhi Nadhiyae ",
      title: "Vidhi Nadhiyae ",
      artist: "Revanth",
      filePath: "/songs/Vidhi Nadhiyae .mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    },
    {
      id: "Theethiriyaai ",
      title: "Theethiriyaai ",
      artist: "A. R. Rahman",
      filePath: "/songs/Theethiriyaai.mp3",
      fallbackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
  ],

  /**
   * Photo Memories
   * Add image files to src/photos/...
   * We also provide high-resolution Unsplash romantic photography links as beautiful defaults!
   */
  photos: [
    {
      id: "carousel",
      title: "",
      filePath: "/photos/carousel.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "Remember this night? The air was freezing, but holding your hand felt like wrapping myself in sunshine. I realized right then that I never wanted to let go."
    },
    {
      id: "carousel 2",
      title: "",
      filePath: "/photos/carousel 2.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "You give the absolute best hugs in the universe. It's like all the noise in my head stops completely and starts singing a sweet, happy lullaby."
    },
    {
      id: "carousel 3",
      title: "",
      filePath: "/photos/carousel 3.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "Standing next to you under those fairy lights made me believe in magic. The real kind of magic that exists in quiet, comforting whispers."
    },
    {
      id: "carousel 4",
      title: "",
      filePath: "/photos/carousel 4.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "No matter how beautiful the sky glows, it pales in comparison to the warm sparkle in your eyes. I'd chase a thousand sunrises and sunsets just with you."
    },
    {
      id: "carousel 5",
      title: "",
      filePath: "/photos/carousel 5.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "Sharing random jokes, being absolutely ridiculous, and laughing until our stomachs hurt. That is my true happy place, because you are there breathing life into it."
    },
    {
      id: "carousel 6",
      title: "",
      filePath: "/photos/carousel 6.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "My heart raced so fast that day! I couldn't find the right words to say, but I knew you were the one I had been looking for all my life."
    },
    {
      id: "carousel 7",
      title: "",
      filePath: "/photos/carousel 7.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "We only had one tiny umbrella, but squeezing close felt like our own secret cozy shelter. Rain has never felt so warm and happy since."
    },
    {
      id: "carousel 8",
      title: "",
      filePath: "/photos/carousel 8.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "Your voice at 3:00 AM is my favorite acoustic song. Thank you for listening to my chaotic thoughts and keeping my heart perfectly safe."
    },
    {
      id: "carousel 9",
      title: "",
      filePath: "/photos/carousel 9.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1501901614258-9079a7027d3c?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "Starting the day with you makes even the most boring Monday feel like a magical holiday. You are my favorite cup of warm sunshine."
    },
    {
      id: "carousel 10",
      title: "",
      filePath: "/photos/carousel 10.jpg",
      fallbackUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      hiddenMessage: "When you laugh, the entire world gets instantly brighter. I promise to spend my life finding reasons to make you smile just like this."
    }
  ],
     /**
   * 25 Gallery Posts
   * Customize each of the 25 beautiful gallery posts here!
   * Upload your custom image files to "/public/photos/" and then change the filePath to reference it.
   * Format example for local photos:
   *   filePath: "/photos/photo1.jpg"
   *   fallbackUrl: "/photos/photo1.jpg"
   */
  galleryPosts:[
    {
      id: "post",
      title: "",
      caption: "",
      filePath: "/photos/post.jpg",
      fallbackUrl: "/photos/post.jpg",
      message: "Remember this night? The air was freezing, but holding your hand felt like wrapping myself in sunshine. I realized right then that I never wanted to let go."
    },
    {
      id: "post 2",
      title: "",
      caption: "",
      filePath: "/photos/post 2.jpg",
      fallbackUrl: "/photos/post 2.jpg",
      message: "You give the absolute best hugs in the universe. It's like all the noise in my head stops completely and starts singing a sweet, happy lullaby."
    },
    {
      id: "post 3",
      title: "",
      caption: ".",
      filePath: "/photos/post 3.jpg",
      fallbackUrl: "/photos/post 3.jpg",
      message: "Standing next to you under those fairy lights made me believe in magic. The real kind of magic that exists in quiet, comforting whispers."
    },
    {
      id: "post 4",
      title: "",
      caption: "",
      filePath: "/photos/post 4.jpg",
      fallbackUrl: "/photos/post 4.jpg",
      message: "No matter how beautiful the sky glows, it pales in comparison to the warm sparkle in your eyes. I'd chase a thousand sunrises and sunsets just with you."
    },
    {
      id: "post 5",
      title: "",
      caption: "",
      filePath: "/photos/post 5.jpg",
      fallbackUrl: "/photos/post 5.jpg", 
      message: "Sharing random jokes, being absolutely ridiculous, and laughing until our stomachs hurt. That is my true happy place, because you are there breathing life into it."
    },
    {
      id: "post 6",
      title: "",
      caption: "",
      filePath: "/photos/post 6.jpg",
      fallbackUrl: "/photos/post 6.jpg",
      message: "My heart raced so fast that day! I couldn't find the right words to say, but I knew you were the one I had been looking for all my life."
    },
    {
      id: "post 7",
      title: "",
      caption: "",
      filePath: "/photos/post 7.jpg",
      fallbackUrl: "/photos/post 7.jpg",
      message: "We only had one tiny umbrella, but squeezing close felt like our own secret cozy shelter. Rain has never felt so warm and happy since."
    },
    {
      id: "post 8",
      title: "",
      caption: "",
      filePath: "/photos/post 8.jpg",
      fallbackUrl: "/photos/post 8.jpg",
      message: "Your voice at 3:00 AM is my favorite acoustic song. Thank you for listening to my chaotic thoughts and keeping my heart perfectly safe."
    },
    {
      id: "post 9",
      title: "",
      caption: "",
      filePath: "/photos/post 9.jpg",
      fallbackUrl: "/photos/post 9.jpg",
      message: "Starting the day with you makes even the most boring Monday feel like a magical holiday. You are my favorite cup of warm sunshine."
    },
    {
      id: "post 10",
      title: "",
      caption: "",
      filePath: "/photos/post 10.jpg",
      fallbackUrl: "/photos/post 10.jpg",
      message: "When you laugh, the entire world gets instantly brighter. I promise to spend my life finding reasons to make you smile just like this."
    },
    {
      id: "post 11",
      title: "",
      caption: "",
      filePath: "/photos/post 11.jpg",
      fallbackUrl: "/photos/post 11.jpg",
      message: "No amount of wool or fire can match the radiant warmth of your embrace. It's the ultimate home I always want to return to."
    },
    {
      id: "post 12",
      title: "",
      caption: "",
      filePath: "/photos/post 12.jpg",
      fallbackUrl: "/photos/post 12.jpg",
      message: "The destination didn't even matter - just seeing your profile illuminated by the passing highway lamps was the most beautiful view."
    },
    {
      id: "post 13",
      title: "",
      caption: "",
      filePath: "/photos/post 13.jpg",
      fallbackUrl: "/photos/post 13.jpg",
      message: "That day felt like a scene out of a beautiful classic movie. I wish I could press pause on time whenever we are lying on the clover grass together."
    },
    {
      id: "post 14",
      title: "",
      caption: "",
      filePath: "/photos/post 14.jpg",
      fallbackUrl: "/photos/post 14.jpg",
      message: "Your hug is like a magical shield against everything. Thank you for always being my soft place to land when things get overwhelming."
    },
    {
      id: "post 15",
      title: "",
      caption: "",
      filePath: "/photos/post 15.jpg",
      fallbackUrl: "/photos/post 15.jpg",
      message: "We don't need fancy dance halls or golden spotlights. Holding you close in our quiet room is the grandest ballroom I will ever need."
    },
    {
      id: "post 16",
      title: "",
      caption: "",
      filePath: "/photos/post 16.jpg",
      fallbackUrl: "/photos/post 16.jpg",
      message: "I felt my whole soul light up like a thousand candles. That single smile became the anchor for my happier days and sweetest dreams."
    },
    {
      id: "post 17",
      title: "",
      caption: "",
      filePath: "/photos/post 17.jpg",
      fallbackUrl: "/photos/post 17.jpg",
      message: "Even the moon looks a little envious of how brilliantly you shine. Sharing these quiet hours with you is my ultimate comfort."
    },
    {
      id: "post 18",
      title: "",
      caption: "",
      filePath: "/photos/post 18.jpg",
      fallbackUrl: "/photos/post 18.jpg",
      message: "Reading your tiny handwriting makes my heart soar instantly. Every letter and heart you draw is a literal treasure I keep locked in my mind."
    },
    {
      id: "post 19",
      title: "",
      caption: "",
      filePath: "/photos/post 19.jpg",
      fallbackUrl: "/photos/post 19.jpg",
      message: "You had a little smear of ice cream on your nose, and it was the cutest thing I've ever seen. Every silly moment is a gold medal memory."
    },
    {
      id: "post 20",
      title: "",
      caption: "",
      filePath: "/photos/post 20.jpg",
      fallbackUrl: "/photos/post 20.jpg",
      message: "My home isn't an address on a map. My home is the gentle space right beside you. Thank you for always keeping your golden doors open."
    },
    {
      id: "post 21",
      title: "",
      caption: "",
      filePath: "/photos/post 21.jpg",
      fallbackUrl: "/photos/post 21.jpg",
      message: "Every tiny spark from the fire was like a little star celebrating us. Cozy, warm, and incredibly lucky to have you next to me."
    },
    {
      id: "post 22",
      title: "",
      caption: "",
      filePath: "/photos/post 22.jpg",
      fallbackUrl: "/photos/post 22.jpg",
      message: "Your nose got covered in chocolate cream and you didn't even notice. I love how completely comfortable we are in our silly world."
    },
    {
      id: "post 23",
      title: "",
      caption: "",
      filePath: "/photos/post 23.jpg",
      fallbackUrl: "/photos/post 23.jpg",
      message: "The ocean is vast, but my love for you runs even deeper. Every footprint in the sand was a tiny promise to walk with you forever."
    },
  ],

  /**
   * Special Edited Birthday Video
   * Upload your custom MP4 video files directly inside the "/public/videos/" folder in your workspace.
   * Then, change the "filePath" below to match your filename (for example: "/videos/your_uploaded_video.mp4").
   * High-quality romantic sample/placeholder MP4 is used as default.
   */
  video: {
    title: "A Little Ribbon of Love",
    filePath: "/videos/birthday_video.mp4",
    // Highly reliable fallback url used in case of load error
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },


/**
   * Second Video (Last Cinema / Grand Finale)
   * Plays in the full-screen theater section at the end of the memory gallery!
   * Upload your custom MP4 video files inside the "/public/videos/" folder in your workspace,
   * then change the "filePath" below (for example: "/videos/your_cinema_video.mp4").
   */
  cinemaVideo: {
    title: "FOR YOU, MY LOVE",
    filePath: "/videos/Final Video.mp4",
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  }
};
