"use client";

const isBrowser = typeof window !== "undefined";

export const storage = {
     set(key, data) {
        if (!isBrowser) return;
        window.sessionStorage.setItem(key, data);
    },

    get(key) {
        if (!isBrowser) return null;
        const value = window.sessionStorage.getItem(key);
        return value ?? null;
    },

    remove(key) {
        if (!isBrowser) return;
        window.sessionStorage.removeItem(key);
    },

    clear() {
        if (!isBrowser) return;
        window.sessionStorage.clear();
    },
};