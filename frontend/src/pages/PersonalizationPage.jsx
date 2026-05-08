export default function PersonalizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Personalization</h1>
        <p className="text-gray-400 mt-1">Adjust your Nexus experience, preferences, and assistant behavior.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
          <p className="mt-2 text-sm text-gray-500">Choose your theme, layout, and how Nexus presents results.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Assistant Behavior</h2>
          <p className="mt-2 text-sm text-gray-500">Control voice interaction settings and response style for your assistant.</p>
        </div>
      </div>
    </div>
  );
}
