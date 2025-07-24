import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const navigation = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
];

export default function LegalLandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLoginClick = () => {
        navigate("/login", { state: { from: "/" } }); // For redirecting back
    };

    return (
        <div className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav
                    className="flex items-center justify-between p-6 lg:px-8"
                    aria-label="Global"
                >
                    <div className="flex lg:flex-1">
                        <a
                            href="/"
                            className="-m-1.5 p-1.5 flex items-center gap-2"
                        >
                            <img
                                alt="Logo"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                            <span className="font-bold text-lg">Law Mate</span>
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open menu</span>
                            <Bars3Icon className="size-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-sm font-semibold text-gray-900 hover:text-indigo-600 px-2"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-gray-900">
                                    Hey, {user.name}
                                </span>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("user");
                                        setUser(null);
                                    }}
                                    className="text-sm font-semibold text-red-600 px-3 py-2 rounded-md transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLoginClick}
                                className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 px-2"
                            >
                                Log in
                            </button>
                        )}
                    </div>
                </nav>
                <Dialog
                    as="div"
                    className="lg:hidden"
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                >
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white p-6 sm:max-w-sm">
                        <div className="flex items-center justify-between">
                            <a
                                href="/"
                                className="-m-1.5 p-1.5 flex items-center gap-2"
                            >
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                    className="h-8 w-auto"
                                />
                                <span className="font-bold">LegalEase</span>
                            </a>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <XMarkIcon
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6">
                                    {user ? (
                                        <span className="block px-3 text-base font-semibold text-gray-900">
                                            Hey, {user.name}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={handleLoginClick}
                                            className="block w-full text-left px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            Log in
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>

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
