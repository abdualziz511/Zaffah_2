'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ في تسجيل الدخول');
        return;
      }

      // نجح تسجيل الدخول، انتقل للأدمن
      router.push(from);
      router.refresh();

    } catch {
      setError('تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #0a0a0f;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-bg {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(204,164,59,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 50%, rgba(120,80,200,0.1) 0%, transparent 60%),
                      #0a0a0f;
          z-index: 0;
        }

        .login-particles {
          position: fixed;
          inset: 0;
          background-image: 
            radial-gradient(circle, rgba(204,164,59,0.3) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px, 30px 30px;
          background-position: 0 0, 15px 15px;
          animation: float 20s linear infinite;
          z-index: 0;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-60px); }
        }

        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          padding: 16px;
        }

        .login-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(204,164,59,0.2);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 64px rgba(0,0,0,0.5),
                      0 0 0 1px rgba(255,255,255,0.05) inset;
        }

        .login-logo {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo .icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
          filter: drop-shadow(0 0 20px rgba(204,164,59,0.5));
        }

        .login-logo h1 {
          color: #cca43b;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          direction: rtl;
        }

        .login-logo p {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          margin-top: 6px;
          direction: rtl;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(204,164,59,0.3), transparent);
          margin: 0 0 32px;
        }

        .form-group {
          margin-bottom: 20px;
          direction: rtl;
        }

        .form-label {
          display: block;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 0.95rem;
          font-family: inherit;
          direction: ltr;
          text-align: left;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .form-input:focus {
          border-color: rgba(204,164,59,0.6);
          box-shadow: 0 0 0 3px rgba(204,164,59,0.1);
          background: rgba(255,255,255,0.07);
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        .pass-toggle {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-size: 1rem;
          padding: 4px;
          transition: color 0.2s;
        }

        .pass-toggle:hover { color: #cca43b; }

        .error-box {
          background: rgba(220,38,38,0.15);
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fca5a5;
          font-size: 0.85rem;
          text-align: center;
          direction: rtl;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .btn-login {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #cca43b, #e8c55a, #cca43b);
          background-size: 200% auto;
          border: none;
          border-radius: 12px;
          color: #000;
          font-size: 1rem;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          direction: rtl;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(204,164,59,0.3);
          letter-spacing: 0.5px;
        }

        .btn-login:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(204,164,59,0.4);
        }

        .btn-login:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-left: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 24px;
          color: rgba(255,255,255,0.25);
          font-size: 0.75rem;
          direction: rtl;
        }

        .back-link {
          display: block;
          text-align: center;
          margin-top: 16px;
          color: rgba(204,164,59,0.6);
          font-size: 0.85rem;
          text-decoration: none;
          direction: rtl;
          transition: color 0.2s;
        }

        .back-link:hover { color: #cca43b; }
      `}</style>

      <div className="login-bg" />
      <div className="login-particles" />

      <div className="login-container">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <span className="icon">🎸</span>
            <h1>استوديو النبلاء</h1>
            <p>لوحة تحكم الإدارة</p>
          </div>

          <div className="divider" />

          {/* Error */}
          {error && (
            <div className="error-box">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="admin@studio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                dir="ltr"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">كلمة المرور</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  dir="ltr"
                  style={{ paddingLeft: '44px' }}
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="btn-login"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  جاري تسجيل الدخول
                  <span className="loading-spinner" />
                </>
              ) : (
                'تسجيل الدخول ←'
              )}
            </button>
          </form>

          {/* Back to site */}
          <a href="/" className="back-link">← العودة للموقع</a>

          <p className="login-footer">
            © {new Date().getFullYear()} استوديو النبلاء — لوحة الإدارة
          </p>
        </div>
      </div>
    </>
  );
}
