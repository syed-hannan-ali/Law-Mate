import { useNavigate } from "react-router-dom";

const navigation = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
];

export default function Header({ user, setUser }) {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate("/login", { state: { from: "/" } }); // For redirecting back
    };

    return (
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

                <div className="flex gap-x-12">
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

                <div className="flex flex-1 justify-end">
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
        </header>
    );
}
