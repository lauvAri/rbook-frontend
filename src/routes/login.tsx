/**
 * 登录页面
 */

import { useState, useCallback, useEffect } from 'react';
import Wavify from 'react-wavify';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from '@tanstack/react-router';
import { Button, Input } from '@/components';
import { useUserStore, getCaptcha } from '@/features/user';
import type { CaptchaResponse } from '@/features/user';
import styles from './login.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useUserStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captchaCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaResponse | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/', search: { page: 1, chapter: undefined } });
    }
  }, [isAuthenticated, navigate]);

  // 获取验证码
  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const data = await getCaptcha();
      setCaptcha(data);
      setFormData((prev) => ({ ...prev, captchaCode: '' }));
    } catch {
      setError('获取验证码失败，请刷新重试');
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // 初始化获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captcha) {
      setError('请先获取验证码');
      return;
    }

    if (!formData.username.trim()) {
      setError('请输入用户名');
      return;
    }

    if (!formData.password) {
      setError('请输入密码');
      return;
    }

    if (!formData.captchaCode.trim()) {
      setError('请输入验证码');
      return;
    }

    try {
      await login(
        formData.username.trim(),
        formData.password,
        captcha.captchaKey,
        formData.captchaCode.trim()
      );
      navigate({ to: '/', search: { page: 1, chapter: undefined } });
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '登录失败，请重试';
      setError(errorMessage);
      // 刷新验证码
      fetchCaptcha();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* 左侧背景图区域 */}
        <div className={styles.bgSection}>
          <div className={styles.bgOverlay} />
          <div className={styles.bgContent}>
            <h2 className={styles.bgTitle}>R 代码执行器</h2>
            <p className={styles.bgSubtitle}>统计分析与数据可视化平台</p>
          </div>
        </div>

        {/* 右侧登录表单 */}
        <div className={styles.formSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>欢迎登录</h1>
            <p className={styles.subtitle}>请输入您的账号信息</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>用户名</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="请输入用户名"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup} style={{ position: 'relative' }}>
              <label className={styles.label}>密码</label>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                style={{ position: 'absolute', right: 10, top: 36, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>验证码</label>
              <div className={styles.captchaRow}>
                <Input
                  name="captchaCode"
                  value={formData.captchaCode}
                  onChange={handleInputChange}
                  placeholder="请输入验证码"
                  disabled={isLoading}
                  className={styles.captchaInput}
                />
                <div
                  className={styles.captchaImage}
                  onClick={fetchCaptcha}
                  title="点击刷新验证码"
                >
                  {captchaLoading ? (
                    <span className={styles.captchaLoading}>加载中...</span>
                  ) : captcha ? (
                    <img src={captcha.captchaImage} alt="验证码" />
                  ) : (
                    <span className={styles.captchaError}>加载失败</span>
                  )}
                </div>
              </div>
              <p className={styles.captchaHint}>点击图片可刷新验证码</p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!captcha}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>
        </div>
      </div>
      {/* 波浪动画 */}
      <div className={styles.waveWrapper}>
        <Wavify
          fill="var(--primary)"
          paused={false}
          options={{
            height: 30,
            amplitude: 30,
            speed: 0.18,
            points: 4,
          }}
          style={{ minWidth: '100vw', minHeight: 60 }}
        />
      </div>
    </div>
  );
}
