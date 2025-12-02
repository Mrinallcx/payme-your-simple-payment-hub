const fs = require('fs');
const path = require('path');
const { supabase } = require('./supabase');

const DATA_FILE = path.join(process.cwd(), 'data.json');

// Initialize file if it doesn't exist (fallback)
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ requests: {} }));
}

// ============ File-based storage (fallback) ============
function readStore() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function writeStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

// ============ Supabase storage ============
async function createRequestSupabase({ token, amount, receiver, payer, description, network, expiresInDays, creatorWallet }) {
  const id = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  const expiresAt = expiresInDays 
    ? new Date(Date.now() + (parseInt(expiresInDays) * 24 * 60 * 60 * 1000)).toISOString()
    : null;

  const request = {
    id,
    token,
    amount,
    receiver,
    payer: payer || null,
    description: description || '',
    network: network || 'sepolia',
    status: 'PENDING',
    expires_at: expiresAt,
    tx_hash: null,
    paid_at: null,
    creator_wallet: creatorWallet || null
  };

  const { data, error } = await supabase
    .from('payment_requests')
    .insert(request)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }

  // Convert to camelCase for API response
  return toCamelCase(data);
}

async function getRequestSupabase(id) {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Supabase select error:', error);
    throw error;
  }

  return toCamelCase(data);
}

async function markPaidSupabase(id, txHash) {
  const { data, error } = await supabase
    .from('payment_requests')
    .update({
      status: 'PAID',
      tx_hash: txHash,
      paid_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }

  return toCamelCase(data);
}

async function getAllRequestsSupabase(creatorWallet = null) {
  let query = supabase
    .from('payment_requests')
    .select('*')
    .order('created_at', { ascending: false });

  // Filter by creator wallet if provided
  if (creatorWallet) {
    query = query.eq('creator_wallet', creatorWallet);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase select all error:', error);
    throw error;
  }

  return data.map(toCamelCase);
}

async function deleteRequestSupabase(id) {
  const { error } = await supabase
    .from('payment_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }

  return true;
}

async function updateRequestStatusSupabase(id, status) {
  const { data, error } = await supabase
    .from('payment_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase update status error:', error);
    throw error;
  }

  return toCamelCase(data);
}

// ============ File-based fallback functions ============
function createRequestFile({ token, amount, receiver, payer, description, network, expiresInDays, creatorWallet }) {
  const id = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const expiresAt = expiresInDays ? Date.now() + (parseInt(expiresInDays) * 24 * 60 * 60 * 1000) : null;

  const request = {
    id,
    token,
    amount,
    receiver,
    payer: payer || null,
    description: description || '',
    network: network || 'sepolia',
    status: 'PENDING',
    createdAt: Date.now(),
    expiresAt,
    txHash: null,
    paidAt: null,
    creatorWallet: creatorWallet || null
  };

  const store = readStore();
  store.requests[id] = request;
  writeStore(store);

  return request;
}

function getRequestFile(id) {
  const store = readStore();
  return store.requests[id] || null;
}

function markPaidFile(id, txHash) {
  const store = readStore();
  const request = store.requests[id];

  if (!request) return null;

  request.status = 'PAID';
  request.txHash = txHash;
  request.paidAt = Date.now();

  writeStore(store);
  return request;
}

function getAllRequestsFile(creatorWallet = null) {
  const store = readStore();
  let requests = Object.values(store.requests);
  
  if (creatorWallet) {
    requests = requests.filter(r => r.creatorWallet === creatorWallet);
  }
  
  // Sort by createdAt descending
  return requests.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

function deleteRequestFile(id) {
  const store = readStore();
  if (store.requests[id]) {
    delete store.requests[id];
    writeStore(store);
    return true;
  }
  return false;
}

// ============ Helper functions ============
function toCamelCase(obj) {
  if (!obj) return obj;
  
  return {
    id: obj.id,
    token: obj.token,
    amount: obj.amount,
    receiver: obj.receiver,
    payer: obj.payer,
    description: obj.description,
    network: obj.network,
    status: obj.status,
    createdAt: obj.created_at ? new Date(obj.created_at).getTime() : null,
    expiresAt: obj.expires_at ? new Date(obj.expires_at).getTime() : null,
    txHash: obj.tx_hash,
    paidAt: obj.paid_at ? new Date(obj.paid_at).getTime() : null,
    creatorWallet: obj.creator_wallet
  };
}

// ============ Unified API (auto-selects storage) ============
const useSupabase = !!supabase;

async function createRequest(params) {
  if (useSupabase) {
    return createRequestSupabase(params);
  }
  return createRequestFile(params);
}

async function getRequest(id) {
  if (useSupabase) {
    return getRequestSupabase(id);
  }
  return getRequestFile(id);
}

async function markPaid(id, txHash) {
  if (useSupabase) {
    return markPaidSupabase(id, txHash);
  }
  return markPaidFile(id, txHash);
}

async function getAllRequests(creatorWallet = null) {
  if (useSupabase) {
    return getAllRequestsSupabase(creatorWallet);
  }
  return getAllRequestsFile(creatorWallet);
}

async function deleteRequest(id) {
  if (useSupabase) {
    return deleteRequestSupabase(id);
  }
  return deleteRequestFile(id);
}

console.log(`📦 Storage: ${useSupabase ? 'Supabase' : 'File-based (data.json)'}`);

module.exports = {
  createRequest,
  getRequest,
  markPaid,
  getAllRequests,
  deleteRequest,
  useSupabase
};
