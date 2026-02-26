import DownloadButtons from "./components/DownloadButtons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-20 text-center">
      {/* App icon placeholder */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 shadow-xl">
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="h-12 w-12"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        Your App, Everywhere
      </h1>

      {/* Sub-heading */}
      <p className="mb-10 max-w-lg text-lg leading-relaxed text-gray-500">
        Experience the best of our app on your device. Available now on iOS and
        Android — free to download.
      </p>

      {/* Store buttons powered by AppsFlyer Smart Script */}
      <DownloadButtons />

      {/* Small trust note */}
      <p className="mt-10 text-sm text-gray-400">
        Rated 4.8 ★ · 100k+ downloads · Free
      </p>
    </main>
  );
}
