// dbService.js
import { createClient } from '@supabase/supabase-js';

// 创建 Supabase 客户端
// 添加环境变量检查
console.log('检查环境变量:', {
    url: import.meta.env.VITE_SUPABASE_URL ? '已设置' : '未设置',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置'
});

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 检查并执行数据库操作的函数
async function performDbOperations(operationName, operationFn) {
    console.log(`开始执行 ${operationName} 操作...`);
    try {
        const { data, error } = await operationFn();
        if (error) throw error;
        console.log(`${operationName} 操作成功.`);
        return { success: true, data };
    } catch (err) {
        console.error(`${operationName} 操作失败:`, err.message);
        return { success: false, msg: err.message };
    }
}

// 具体的数据库操作函数
export async function insertData() {
    return performDbOperations('insert', async () => {
        let { data, error } = await supabase
            .from('test_table')
            .insert([{ name: 'Test Name' }])
            .select();
        return { data, error };
    });
}

export async function selectData() {
    return performDbOperations('select', async () => {
        let { data, error } = await supabase
            .from('test_table')
            .select('*');
        return { data, error };
    });
}

export async function updateData() {
    return performDbOperations('update', async () => {
        let { data: insertedData } = await supabase
            .from('test_table')
            .select('id')
            .limit(1)
            .single();

        let { data, error } = await supabase
            .from('test_table')
            .update({ name: 'Updated Test Name' })
            .eq('id', insertedData.id)
            .select();
        return { data, error };
    });
}

export async function deleteData() {
    return performDbOperations('delete', async () => {
        let { data: insertedData } = await supabase
            .from('test_table')
            .select('id')
            .limit(1)
            .single();

        let { data, error } = await supabase
            .from('test_table')
            .delete()
            .eq('id', insertedData.id)
            .select();
        return { data, error };
    });
}


// 分页获取 wechat_articles 表中的文章数据，支持根据标题搜索
export async function getWechatArticles(page = 1, limit = 10, searchQuery = '') {
    try {
        const offset = (page - 1) * limit;
        let query = supabase
            .from('wechat_articles')
            .select('*')
            .range(offset, offset + limit - 1);

        if (searchQuery) {
            query = query.ilike('title', `%${searchQuery}%`);
        }

        const { data, error } = await query;
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch wechat articles:', error);
        return [];
    }
}

// dbService.js

// 分页获取 mdfiles 表中的文章数据，支持根据标题、标签、分类、描述、内容搜索
export async function getMdFiles(page = 1, limit = 10, keyword = '') {
    try {
        const offset = (page - 1) * limit;

        // 构建基础查询
        let query = supabase
            .from('mdfiles')
            .select('*', { count: 'exact' }) // 获取总记录数以计算分页
            .range(offset, offset + limit - 1);

        // 如果有关键字，则进行多字段过滤
        if (keyword) {
            query = query.or(
                `title.ilike.%${keyword}%,category.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`
            );

            // 特殊处理 tags 数组字段
            query = query.contains('tags', [keyword]);
        }

        // 执行查询
        const { data, error, count } = await query.order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // 计算总页数
        const totalPages = Math.ceil(count / limit);

        return {
            articles: data,
            currentPage: page,
            totalPages,
            pageSize: limit
        };
    } catch (error) {
        console.error('Failed to fetch mdfiles:', error);
        return {
            articles: [],
            currentPage: page,
            totalPages: 1,
            pageSize: limit
        };
    }
}

export const getCategories = async () => {
    try {
        // 使用 Supabase 的查询构建器进行分组和计数
        let { data, error } = await supabase
            .from('mdfiles')
            .select('category', { count: 'exact', as: 'count' })
            .groupby('category')
            .order('count', { ascending: false });

        if (error) throw error;

        // 将结果转换为对象格式
        const categories = {};
        data.forEach(row => {
            categories[row.category] = row.count;
        });

        return { categories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategoryArticles = async (category) => {
    try {
        // 使用 Supabase 查询构建器筛选指定分类的文章
        let { data, error } = await supabase
            .from('mdfiles')
            .select('title, created_at')
            .eq('category', category) // 过滤出指定分类的文章
            .order('created_at', { ascending: false }); // 按创建时间降序排序

        if (error) throw error;

        return { articles: data };
    } catch (error) {
        console.error('Error fetching category articles:', error);
        throw error;
    }
};
/**
* 获取所有标签及其文章数量
* @returns {Promise<{ tags: Object }>} - 标签及其文章数量的对象
*/
export const getTags = async () => {
    try {
        // 使用 Supabase 查询构建器统计每个标签的文章数量
        let { data, error } = await supabase.rpc('get_tags_with_counts');

        if (error) throw error;

        // 将结果转换为对象格式
        const tags = {};
        data.forEach(row => {
            tags[row.tag] = row.count;
        });

        return { tags };
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};

/**
 * 获取指定标签的文章列表
 * @param {string} tag - 标签名称
 * @returns {Promise<{ articles: Array }>} - 文章列表
 */
export const getTagArticles = async (tag) => {
    try {
        // 使用 Supabase 查询构建器筛选指定标签的文章
        let { data, error } = await supabase
            .from('mdfiles')
            .select('title, category, tags, description, created_at')
            .contains('tags', [tag]) // 过滤出包含指定标签的文章
            .order('created_at', { ascending: false }); // 按创建时间降序排序

        if (error) throw error;

        return { articles: data };
    } catch (error) {
        console.error('Error fetching tag articles:', error);
        throw error;
    }
};