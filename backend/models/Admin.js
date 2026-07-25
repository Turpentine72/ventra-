const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

class Admin {
    static async findById(id) {
        console.log('Finding admin by ID:', id);
        
        const { data, error } = await supabase
            .from('admins')
            .select('id, full_name, email, phone, role, profile_picture, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Admin data found:', data);
        return data;
    }

    static async findByEmail(email) {
        console.log('Finding admin by email:', email);
        
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Admin found:', data ? 'Yes' : 'No');
        return data;
    }

    static async create(adminData) {
        console.log('Creating admin:', adminData.email);
        
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        
        const { data, error } = await supabase
            .from('admins')
            .insert([{
                full_name: adminData.full_name,
                email: adminData.email,
                phone: adminData.phone,
                password: hashedPassword,
                role: adminData.role || 'Founder',
                profile_picture: adminData.profile_picture || ''
            }])
            .select('id, full_name, email, phone, role, profile_picture')
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Admin created:', data);
        return data;
    }

    static async update(id, updateData) {
        console.log('Updating admin:', id, updateData);
        
        const { data, error } = await supabase
            .from('admins')
            .update(updateData)
            .eq('id', id)
            .select('id, full_name, email, phone, role, profile_picture')
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Admin updated:', data);
        return data;
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async seedAdmin() {
        console.log('Seeding admin...');
        
        try {
            // Check if admin already exists
            const existingAdmin = await this.findByEmail('admin@ventra.com');
            if (existingAdmin) {
                console.log('Admin already exists');
                return { message: 'Admin already exists' };
            }

            // Create new admin
            const admin = await this.create({
                full_name: 'John Doe',
                email: 'admin@ventra.com',
                phone: '+1234567890',
                password: 'admin123456',
                role: 'Founder'
            });

            console.log('Admin seeded successfully');
            return {
                message: 'Admin created successfully',
                admin
            };
        } catch (error) {
            console.error('Seed error:', error);
            throw error;
        }
    }
}

module.exports = Admin;