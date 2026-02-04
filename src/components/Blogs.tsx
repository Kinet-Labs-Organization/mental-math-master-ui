import { useEffect, useState } from 'react';
import { useBlogsStore } from '../store/useBlogsStore';
import { ListView } from './ListView';

export function Blogs() {
    const { blogs, blogsLoading, blogsError, fetchBlogs } = useBlogsStore();

    const [blogList, setBlogList] = useState<any[]>([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        setBlogList(blogs);
    }, [blogs]);

    return (
        <ListView title="Blogs" data={blogList} loading={blogsLoading} error={blogsError} />
    );
}