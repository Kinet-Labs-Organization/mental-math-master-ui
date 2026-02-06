import { useEffect, useState } from 'react';
import { ListView } from './ListView';
import { useGenericStore } from '../store/useGenericStore';

export function Blogs() {
    const { blogs, blogsLoading, blogsError, fetchBlogs } = useGenericStore();

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