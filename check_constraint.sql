SELECT conname, consrc FROM pg_constraint WHERE conrelid = 'notes'::regclass AND conname = 'notes_type_check';
