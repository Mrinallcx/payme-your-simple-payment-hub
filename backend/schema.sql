-- Supabase Schema for PayMe Payment Hub
-- Run this in Supabase SQL Editor

-- Create payment_requests table
CREATE TABLE IF NOT EXISTS payment_requests (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  amount TEXT NOT NULL,
  receiver TEXT NOT NULL,
  payer TEXT,
  description TEXT,
  network TEXT NOT NULL DEFAULT 'sepolia',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  tx_hash TEXT,
  paid_at TIMESTAMPTZ,
  creator_wallet TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_receiver ON payment_requests(receiver);
CREATE INDEX IF NOT EXISTS idx_payment_requests_created_at ON payment_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_requests_creator_wallet ON payment_requests(creator_wallet);

-- Enable Row Level Security (optional, for production)
-- ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_requests_updated_at
  BEFORE UPDATE ON payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

