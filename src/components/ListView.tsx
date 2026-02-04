import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import SkeletonLoader from './shared/skeleton-loader';

export function ListView({ title, data, loading, error }: { title: string; data: any[]; loading: boolean; error: string | null }) {
    const navigate = useNavigate();

    const [dataList, setDataList] = useState<any[]>([]);

    useEffect(() => {
        setDataList(data || []);
    }, [data]);

    return (
        <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl text-white mb-8">{title}</h1>
                {!loading && <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {dataList.map((data: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(data.link)}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all group"
                        >
                            <img
                                src={data.image}
                                alt={data.title}
                                className="w-24 h-24 object-cover rounded-xl flex-shrink-0 bg-white/10"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                                    {data.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2">
                                    {data.brief}
                                </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </motion.div>
                    ))}
                </div>}
                {loading && <ListSkeleton />}
            </div>
        </div>
    );
}

const ListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((data: any) => (
                <div key={data}>
                    <SkeletonLoader height={140} width={'100%'} radius={20} />
                </div>
            ))}
        </div>
    );
}