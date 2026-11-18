(() => {
  "use strict";

  const LEGACY_DB_NAME = "aethera_infinite_v1";

  function getPrivateDatabaseName(userId) {
    if (typeof userId !== "string" || !userId.trim()) {
      throw new Error("A signed-in account is required.");
    }

    return `aethera_infinite_user_${userId}`;
  }

  function getCurrentUserDatabaseName() {
    const user = window.AetheraAuth?.getUser();

    if (!user?.id) {
      throw new Error("Please sign in before opening Infinite Books.");
    }

    return getPrivateDatabaseName(user.id);
  }

  window.AetheraLibraryStorage = Object.freeze({
    legacyDatabaseName: LEGACY_DB_NAME,
    getPrivateDatabaseName,
    getCurrentUserDatabaseName
  });
})();
