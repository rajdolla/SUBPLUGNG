import re

D = chr(36) + chr(36)

with open('supabase/migrations/20261009_harden_security_and_rbac.sql') as f:
    text = f.read()

text = re.sub(r'do \d+', 'do ' + D, text)
text = re.sub(r'as \d+', 'as ' + D, text)
text = re.sub(r'end;\s*\d+;', 'end;\n' + D + ';', text)
text = re.sub(r'end;\s*\d+\s*\n', 'end;\n' + D + ';\n', text)

with open('supabase/migrations/20261009_harden_security_and_rbac.sql', 'w') as f:
    f.write(text)

with open('supabase/schema.sql') as f:
    schema_text = f.read()

schema_text = re.sub(r'do \d+', 'do ' + D, schema_text)
schema_text = re.sub(r'as \d+', 'as ' + D, schema_text)
schema_text = re.sub(r'end;\s*\d+;', 'end;\n' + D + ';', schema_text)
schema_text = re.sub(r'end;\s*\d+\s*\n', 'end;\n' + D + ';\n', schema_text)

with open('supabase/schema.sql', 'w') as f:
    f.write(schema_text)

print('fix_sql.py completed successfully.')
