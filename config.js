// Deine persönlichen Einstellungen.
// Die Client-ID ist öffentlich und kein Passwort. Sie darf ins GitHub-Repo.
// Geschützt wird sie dadurch, dass du in der Google Cloud nur deine eigene Website-Adresse erlaubst.
window.TERMIN_CONFIG = {
  // Aus der Google Cloud Console (Schritt 3 in der README). Endet auf .apps.googleusercontent.com
  CLIENT_ID: "253354060649-4r15ibnomn25mgepc4ii93pu7hcn61c1.apps.googleusercontent.com",

  // Für diese Termine zeigt „Jetzt dran" keinen Countdown (Stichwörter im Titel, Groß/klein egal).
  // Termine der Kategorie Persönlich bekommen nie einen Countdown.
  NO_COUNTDOWN: ["mitarbeitergespräch", "gym", "fitness"],

  // Wer sieht was: SHA-256 der Google-Adresse (klein geschrieben) -> Name und Reiter.
  // Die Adressen selbst stehen bewusst nicht hier, weil das Repo öffentlich ist. Mama kommt in Phase 5 dazu.
  USERS: {
    "ac7fa6913bcc10f5f9a45b19b2f119c7cbf66cd5387aa1b222c4735b1ec00287": { name: "Alicia", tabs: ["ich", "familie", "fabi", "todo"] }
  }
};
