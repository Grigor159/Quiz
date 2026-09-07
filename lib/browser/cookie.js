"use client";

import cookies from "js-cookie";

export const cookie = {
    set(key, data) {
        cookies.set(key, data);
    },

    get(key) {
        return cookies.get(key);
    },

    remove(key) {
        return cookies.remove(key);
    },
}