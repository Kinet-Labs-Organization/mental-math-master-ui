import { create } from "zustand";
import ApiURL from "../utils/apiurl";
import api from "../utils/api";

export const useBlogsStore = create<any>((set, get) => ({
    blogs: [],
    blogsLoading: false,
    blogsError: null,
    fetchBlogs: async () => {
        set({ blogsLoading: true, blogsError: null });
        try {
            const result = await api.get(`${ApiURL.game.fetchBlogs}`);
            return set({ blogs: result.data, blogsLoading: false });
        } catch (error) {
            return set({ blogsLoading: false, blogsError: "failed to fetch blogs" });
        }
    },
}));
