import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tprwbgfhtqbyqmyfrfpi.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcndiZ2ZodHFieXFteWZyZnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDA0MzEsImV4cCI6MjA3OTQxNjQzMX0.BAlYIgAuN6VKct3gINa39DYhV3cCRITKyN8L4cYzolg"

export const supabase = createClient(supabaseUrl, supabaseKey)

