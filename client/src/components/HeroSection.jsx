import { useState, useEffect } from "react";
import Header from "@components/Header";

export default function LegalLandingPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="bg-white">
            <Header user={user} setUser={setUser} />

            <main className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Legal Case & Document Management Simplified
                    </h1>
                    <p className="mt-8 text-lg text-gray-600 sm:text-xl">
                        Streamline your legal workflows with secure document
                        storage, automated case tracking, and team collaboration
                        — all in one place.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/signup"
                            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-indigo-600"
                        >
                            Get Started
                        </a>
                        <a
                            href="#features"
                            className="text-sm font-semibold text-gray-900 hover:text-indigo-600"
                        >
                            Explore Features <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>

                {/* background gradient blur shapes */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
                >
                    <div
                        className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] opacity-30 sm:w-[72rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
            </main>
        </div>
    );
}
