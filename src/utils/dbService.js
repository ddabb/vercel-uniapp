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