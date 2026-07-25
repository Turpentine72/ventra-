const supabase = require('../config/supabase');

class WaitlistUser {
    static async findAll(query = {}) {
        let supabaseQuery = supabase
            .from('waitlist_users')
            .select('*', { count: 'exact' });

        if (query.search) {
            supabaseQuery = supabaseQuery.or(
                `business_name.ilike.%${query.search}%,full_name.ilike.%${query.search}%,email.ilike.%${query.search}%`
            );
        }

        if (query.category && query.category !== 'All') {
            supabaseQuery = supabaseQuery.eq('business_category', query.category);
        }

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        supabaseQuery = supabaseQuery
            .order('created_at', { ascending: false })
            .range(start, end);

        const { data, error, count } = await supabaseQuery;

        if (error) throw error;

        const formattedUsers = data.map(user => ({
            id: user.id,
            business_name: user.business_name,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            business_category: user.business_category,
            feature_interest: user.feature_interest,
            instagram: user.instagram,
            created_at: user.created_at,
            businessName: user.business_name,
            fullName: user.full_name,
            businessCategory: user.business_category,
            featureInterest: user.feature_interest,
            createdAt: user.created_at
        }));

        return {
            users: formattedUsers,
            total: count,
            page: page,
            pages: Math.ceil(count / limit)
        };
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('waitlist_users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            business_name: data.business_name,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            business_category: data.business_category,
            feature_interest: data.feature_interest,
            instagram: data.instagram,
            created_at: data.created_at,
            businessName: data.business_name,
            fullName: data.full_name,
            businessCategory: data.business_category,
            featureInterest: data.feature_interest,
            createdAt: data.created_at
        };
    }

    static async create(userData) {
        const { data, error } = await supabase
            .from('waitlist_users')
            .insert([userData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async delete(id) {
        console.log('Deleting user with ID:', id);
        
        // Check if user exists first
        const { data: existingUser, error: findError } = await supabase
            .from('waitlist_users')
            .select('id')
            .eq('id', id)
            .single();

        if (findError) {
            console.error('Error finding user:', findError);
            throw new Error('User not found');
        }

        if (!existingUser) {
            throw new Error('User not found');
        }

        // Delete the user
        const { error: deleteError } = await supabase
            .from('waitlist_users')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting user:', deleteError);
            throw new Error(deleteError.message);
        }

        console.log('User deleted successfully:', id);
        return { message: 'User deleted successfully' };
    }

    static async getStats() {
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
            .select('feature_interest')
            .not('feature_interest', 'is', null);

        if (featureError) throw featureError;

        const featureCounts = {};
        featureData.forEach(item => {
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
            .select('business_category')
            .not('business_category', 'is', null);

        if (categoryError) throw categoryError;

        const categoryCounts = {};
        categoryData.forEach(item => {
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
            totalUsers,
            newToday,
            mostRequestedFeature,
            mostPopularCategory
        };
    }
}

module.exports = WaitlistUser;