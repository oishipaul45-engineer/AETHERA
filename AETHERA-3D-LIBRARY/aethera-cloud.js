async function getCloudBooks() {
  const auth = window.AetheraAuth;

  if (!auth?.getClient || !auth?.getSession) {
    throw new Error("AETHERA authentication is not ready.");
  }

  const sessionResult = await auth.getSession();

  if (sessionResult?.error) {
    throw new Error(
      sessionResult.error.message || "Session check failed."
    );
  }

  const user = sessionResult?.data?.user;

  if (!user?.id) {
    throw new Error("Please sign in to AETHERA first.");
  }

  const neon = auth.getClient();

  if (!neon) {
    throw new Error("Neon is not configured.");
  }

  const { data, error } = await neon
    .from("aethera_books")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Cloud retrieval failed.");
  }

  return {
    count: data?.length || 0,
    books: data || []
  };
}

// Temporary read-only testing interface.
// Does not access or modify IndexedDB.
window.AetheraCloud = {
  getBooks: getCloudBooks
};
