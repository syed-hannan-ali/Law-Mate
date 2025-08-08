import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Shield, User, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@components/ui/sheet";
import { useAuth } from "@hooks/useAuth";

const navigation = [
    { name: "Pricing", href: "#pricing" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Chat", href: "/chat" },
];

export default function Header() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, handleLogout } = useAuth();

    const handleLoginClick = () => {
        navigate("/login", { state: { from: "/" } });
    };

    const handleLogoutClick = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            handleLogout();
        }
    };

    return (
        <header className="absolute inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20">
            <nav
                className="flex items-center justify-between p-6 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <a
                        href="/"
                        className="-m-1.5 p-1.5 flex items-center gap-2"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Shield className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">
                            LawMate
                        </span>
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                {/* Desktop User Menu */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src="/placeholder.svg?height=40&width=40"
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Hey, {user.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/chat')}>
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    <span>Chat with AI</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogoutClick}
                                    className="text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            onClick={handleLoginClick}
                            variant="ghost"
                            className="text-sm font-semibold"
                        >
                            Log in
                        </Button>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <Sheet
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    >
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="-m-2.5 p-2.5"
                            >
                                <span className="sr-only">Open main menu</span>
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:max-w-sm"
                        >
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    LawMate
                                </SheetTitle>
                                <SheetDescription>
                                    Navigate through our platform
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="py-6">
                                        {user ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 px-3 py-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src="/placeholder.svg?height=32&width=32"
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback>
                                                            {user.name
                                                                ?.split(" ")
                                                                .map(
                                                                    (n) => n[0],
                                                                )
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        navigate('/chat');
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    variant="ghost"
                                                    className="w-full justify-start"
                                                >
                                                    <MessageCircle className="mr-2 h-4 w-4" />
                                                    Chat with AI
                                                </Button>
                                                <Button
                                                    onClick={handleLogoutClick}
                                                    variant="ghost"
                                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Log out
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={handleLoginClick}
                                                className="w-full"
                                            >
                                                Log in
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
