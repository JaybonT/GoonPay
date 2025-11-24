import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Send, History, User, LogOut, UserPlus, LogIn, DollarSign, ArrowUpRight, ArrowDownLeft, Home } from 'lucide-react';

const GoonPay = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [sendForm, setSendForm] = useState({ recipient: '', amount: '', note: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize with demo data
  useEffect(() => {
    const demoUsers = [
      {
        id: '1',
        username: 'demo',
        email: 'demo@goonpay.com',
        password: 'demo123',
        balance: 1500.00,
        createdAt: new Date().toISOString()
      }
    ];
    setUsers(demoUsers);
  }, []);

  // Function to play sound effect
  const playSound = () => {
    try {
      const audio = new Audio('/goon-sound.mp3');
      audio.volume = 0.7;
      audio.play().catch(err => {
        console.error('Audio play failed:', err);
      });
    } catch (err) {
      console.error('Audio creation failed:', err);
    }
  };

  const handleSignup = () => {
    setError('');
    setSuccess('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (users.find(u => u.username === signupForm.username)) {
      setError('Username already exists');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username: signupForm.username,
      email: signupForm.email,
      password: signupForm.password,
      balance: 1000.00,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    setSuccess('Account created successfully! Please login.');
    setSignupForm({ username: '', email: '', password: '', confirmPassword: '' });
    setTimeout(() => setView('login'), 2000);
  };

  const handleLogin = () => {
    setError('');

    const user = users.find(
      u => u.username === loginForm.username && u.password === loginForm.password
    );

    if (!user) {
      setError('Invalid username or password');
      return;
    }

    setCurrentUser(user);
    setView('dashboard');
    setLoginForm({ username: '', password: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setError('');
    setSuccess('');
  };

  const handleSendMoney = () => {
    setError('');
    setSuccess('');

    const amount = parseFloat(sendForm.amount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > currentUser.balance) {
      setError('Insufficient balance');
      return;
    }

    const recipient = users.find(u => u.username === sendForm.recipient);
    
    if (!recipient) {
      setError('Recipient not found');
      return;
    }

    if (recipient.id === currentUser.id) {
      setError('Cannot send money to yourself');
      return;
    }

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      from: currentUser.id,
      to: recipient.id,
      amount: amount,
      note: sendForm.note,
      timestamp: new Date().toISOString(),
      fromUsername: currentUser.username,
      toUsername: recipient.username
    };

    // Update balances
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, balance: u.balance - amount };
      }
      if (u.id === recipient.id) {
        return { ...u, balance: u.balance + amount };
      }
      return u;
    });

    setUsers(updatedUsers);
    setTransactions([transaction, ...transactions]);
    setCurrentUser({ ...currentUser, balance: currentUser.balance - amount });
    setSuccess(`Successfully sent $${amount.toFixed(2)} to ${recipient.username}`);
    setSendForm({ recipient: '', amount: '', note: '' });
    
    // Play sound effect
    playSound();
  };

  const getUserTransactions = () => {
    return transactions.filter(
      t => t.from === currentUser.id || t.to === currentUser.id
    );
  };

  const renderLogin = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/goonpay-logo.png" alt="GoonPay Logo" className="w-48 h-48" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">GoonPay</h1>
          <p className="text-gray-600 mt-2">Virtual Payment Simulator</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={() => setView('signup')}
            className="text-indigo-600 font-semibold hover:text-indigo-700 mt-2"
          >
            Create Account
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Account:</p>
          <p className="text-sm text-blue-700">Username: demo</p>
          <p className="text-sm text-blue-700">Password: demo123</p>
        </div>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/goonpay-logo.png" alt="GoonPay Logo" className="w-48 h-48" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join GoonPay today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={signupForm.username}
              onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={() => setView('login')}
            className="text-indigo-600 font-semibold hover:text-indigo-700 mt-2"
          >
            Login
          </button>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-800">
            <strong>Note:</strong> New accounts start with $1,000.00 virtual balance
          </p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/goonpay-logo.png" alt="GoonPay Logo" className="w-16 h-16" />
            <h1 className="text-2xl font-bold text-gray-800">GoonPay</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setView('send')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'send' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Send className="w-5 h-5" />
              Send
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'history' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="w-5 h-5" />
              History
            </button>
            <button
              onClick={() => setView('profile')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-indigo-200 mb-2">Available Balance</p>
                  <h2 className="text-5xl font-bold">${currentUser.balance.toFixed(2)}</h2>
                  <p className="text-indigo-200 mt-4">Welcome back, {currentUser.username}!</p>
                </div>
                <img src="/goonpay-logo.png" alt="GoonPay Logo" className="w-32 h-32 opacity-80" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Send</h3>
                <button
                  onClick={() => setView('send')}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Money
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <button
                  onClick={() => setView('history')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <History className="w-5 h-5" />
                  View History
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
              {getUserTransactions().slice(0, 5).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {getUserTransactions().slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {t.from === currentUser.id ? (
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t.from === currentUser.id ? `To ${t.toUsername}` : `From ${t.fromUsername}`}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(t.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${t.from === currentUser.id ? 'text-red-600' : 'text-green-600'}`}>
                        {t.from === currentUser.id ? '-' : '+'}${t.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'send' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Money</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Username
                  </label>
                  <input
                    type="text"
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Available balance: ${currentUser.balance.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={sendForm.note}
                    onChange={(e) => setSendForm({ ...sendForm, note: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                    placeholder="Add a note..."
                  />
                </div>

                <button
                  onClick={handleSendMoney}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-lg"
                >
                  <Send className="w-6 h-6" />
                  Send Money
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
            
            {getUserTransactions().length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No transactions yet</p>
                <p className="text-gray-400 mt-2">Start sending money to see your transaction history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getUserTransactions().map(t => (
                  <div key={t.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        {t.from === currentUser.id ? (
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ArrowUpRight className="w-6 h-6 text-red-600" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ArrowDownLeft className="w-6 h-6 text-green-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">
                            {t.from === currentUser.id ? `Sent to ${t.toUsername}` : `Received from ${t.fromUsername}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(t.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold text-2xl ${t.from === currentUser.id ? 'text-red-600' : 'text-green-600'}`}>
                        {t.from === currentUser.id ? '-' : '+'}${t.amount.toFixed(2)}
                      </p>
                    </div>
                    {t.note && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Note:</span> {t.note}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-4">
                  <User className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">{currentUser.username}</h2>
                <p className="text-gray-600 mt-2">{currentUser.email}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Account Balance</p>
                  <p className="text-3xl font-bold text-indigo-600">${currentUser.balance.toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p className="text-lg font-mono text-gray-800">{currentUser.id}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="text-lg text-gray-800">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                  <p className="text-lg text-gray-800">{getUserTransactions().length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!currentUser) {
    return view === 'signup' ? renderSignup() : renderLogin();
  }

  return renderDashboard();
};

export default GoonPay;