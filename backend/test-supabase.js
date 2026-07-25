const supabase = require('./config/supabase');

async function testConnection() {
    console.log('Testing Supabase connection...');
    
    // Test query to check connection
    const { data, error } = await supabase
        .from('waitlist_users')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Supabase connection error:', error.message);
        console.error('Full error:', error);
    } else {
        console.log('✅ Supabase connection successful!');
        console.log('Data:', data);
    }
}

testConnection();