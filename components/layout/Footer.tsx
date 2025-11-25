export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#002020] py-4 border-t border-[#2a2f3e]">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
                <p>
                    © {currentYear} Idle Clans Hub. Not an official Idle Clans
                    website.
                </p>
                <p>
                    Made with 💚 by{' '}
                    <a
                        href="https://github.com/karolhas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        HSK
                    </a>
                </p>
            </div>
        </footer>
    );
}
