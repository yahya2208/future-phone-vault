-- Drop activation-related functions
DROP FUNCTION IF EXISTS validate_activation_code;
DROP FUNCTION IF EXISTS generate_activation_codes;
DROP FUNCTION IF EXISTS activate_by_nickname;

-- Drop activation-related tables
DROP TABLE IF EXISTS user_activations;
DROP TABLE IF EXISTS activation_codes;
