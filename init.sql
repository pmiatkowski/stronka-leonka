-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agent_reports table
CREATE TABLE IF NOT EXISTS agent_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identyfikator_agenta TEXT NOT NULL,
    raport TEXT,
    poziom_satysfakcji INTEGER CHECK (poziom_satysfakcji BETWEEN 1 AND 5),
    access_code TEXT
);