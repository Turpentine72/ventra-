import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tqivpbyhbneazovaynku.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LK-3Iweh2FcviTatGbxjfQ_z7mJJZdz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Waitlist operations
export const waitlistAPI = {
    async getAll({ search = '', category = 'All', page = 1, limit = 10 } = {}) {
        let query = supabase
            .from('waitlist_users')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.or(
                `business_name.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`
            );
        }

        if (category && category !== 'All') {
            query = query.eq('business_category', category);
        }

        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query
            .order('created_at', { ascending: false })
            .range(start, end);

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            users: data || [],
            total: count || 0,
            page,
            pages: Math.ceil((count || 0) / limit)
        };
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('waitlist_users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(userData) {
        console.log('Creating user with data:', userData);
        
        const { data, error } = await supabase
            .from('waitlist_users')
            .insert([userData])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            throw error;
        }
        
        console.log('User created successfully:', data);
        return data[0];
    },

    async delete(id) {
        const { error } = await supabase
            .from('waitlist_users')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true, message: 'User deleted successfully' };
    },

    async getStats() {
        const { count: totalUsers, error: totalError } = await supabase
            .from('waitlist_users')
            .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        const today = new Date().toISOString().split('T')[0];
        const { count: newToday, error: todayError } = await supabase
            .from('waitlist_users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today);

        if (todayError) throw todayError;

        const { data: featureData, error: featureError } = await supabase
            .from('waitlist_users')
            .select('feature_interest');

        if (featureError) throw featureError;

        const featureCounts = {};
        featureData?.forEach(item => {
            featureCounts[item.feature_interest] = (featureCounts[item.feature_interest] || 0) + 1;
        });

        let mostRequestedFeature = 'N/A';
        let maxCount = 0;
        for (const [feature, count] of Object.entries(featureCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostRequestedFeature = feature;
            }
        }

        const { data: categoryData, error: categoryError } = await supabase
            .from('waitlist_users')
            .select('business_category');

        if (categoryError) throw categoryError;

        const categoryCounts = {};
        categoryData?.forEach(item => {
            categoryCounts[item.business_category] = (categoryCounts[item.business_category] || 0) + 1;
        });

        let mostPopularCategory = 'N/A';
        let maxCategoryCount = 0;
        for (const [category, count] of Object.entries(categoryCounts)) {
            if (count > maxCategoryCount) {
                maxCategoryCount = count;
                mostPopularCategory = category;
            }
        }

        return {
            totalUsers: totalUsers || 0,
            newToday: newToday || 0,
            mostRequestedFeature,
            mostPopularCategory
        };
    }
};

// Admin operations
export const adminAPI = {
    async getProfile(id) {
        const { data, error } = await supabase
            .from('admins')
            .select('id, full_name, email, phone, role, profile_picture, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProfile(id, updateData) {
        const { data, error } = await supabase
            .from('admins')
            .update(updateData)
            .eq('id', id)
            .select('id, full_name, email, phone, role, profile_picture')
            .single();

        if (error) throw error;
        return data;
    },

    async findByEmail(email) {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
};

export default supabase;