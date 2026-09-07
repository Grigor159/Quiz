"use client";

const isBrowser = typeof window !== "undefined";

export const storage = {
     set(key, data) {
        if (!isBrowser) return;
        window.localStorage.setItem(key, data);
    },

    get(key) {
        if (!isBrowser) return null;
        const value = window.localStorage.getItem(key);
        return value ?? null;
    },

    remove(key) {
        if (!isBrowser) return;
        window.localStorage.removeItem(key);
    },

    clear() {
        if (!isBrowser) return;
        window.localStorage.clear();
    },
};