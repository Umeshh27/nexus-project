export default function VoiceAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Voice Assistant</h1>
        <p className="text-gray-400 mt-1">Use your microphone to talk with Nexus and get answers from your documents.</p>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <span className="text-3xl">🎙️</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">Voice assistant is ready for you.</p>
        <p className="mt-3 text-sm text-gray-500">Click the button below to start speaking with Nexus. Your voice input will be processed in real time.</p>
        <button className="mt-6 inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition">
          Start Voice Session
        </button>
      </div>
    </div>
  );
}
