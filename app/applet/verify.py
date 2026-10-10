import re

with open('supabase/migrations/20261009_harden_security_and_rbac.sql') as f:
    text = f.read()

D = chr(36) + chr(36)

print("Count of 'do $$' in migration:", text.count("do " + D))
print("Count of 'as $$' in migration:", text.count("as " + D))
print("Count of '$$;' in migration:", text.count(D + ";"))

# Check if any digits follow 'do '
m = re.findall(r'do \d+', text)
print("Digits after 'do':", m)

with open('supabase/schema.sql') as f:
    schema_text = f.read()

print("Count of 'as $$' in schema:", schema_text.count("as " + D))
print("Count of '$$;' in schema:", schema_text.count(D + ";"))
m_schema = re.findall(r'do \d+', schema_text)
print("Digits after 'do' in schema:", m_schema)
