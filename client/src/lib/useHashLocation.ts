import { useState, useEffect } from "react";

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
export const useHashLocation = () => {
    const [loc, setLoc] = useState(window.location.hash.replace(/^#/, "") || "/");

    useEffect(() => {
        const handler = () => setLoc(window.location.hash.replace(/^#/, "") || "/");

        // subscribe on hash changes
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
    }, []);

    const navigate = (to: string) => (window.location.hash = to);
    return [loc, navigate] as [string, (to: string) => void];
};
