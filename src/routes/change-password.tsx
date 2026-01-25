import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Card, CardContent, Button, Input } from '@/components';
import { useUser } from '@/features/user';
import { changePassword } from '@/features/user/api';

export default function ChangePasswordPage() {
  const user = useUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) return <div>请先登录</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }
    setLoading(true);
    try {
      await changePassword(user.id, oldPassword, newPassword);
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || '修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <Card>
        <CardContent>
          <h2>修改密码</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16, position: 'relative' }}>
              <Input
                type={showOld ? 'text' : 'password'}
                placeholder="原密码"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                tabIndex={-1}
                onClick={() => setShowOld(v => !v)}
                aria-label={showOld ? '隐藏密码' : '显示密码'}
              >
                {showOld ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>
            <div style={{ marginBottom: 16, position: 'relative' }}>
              <Input
                type={showNew ? 'text' : 'password'}
                placeholder="新密码"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                tabIndex={-1}
                onClick={() => setShowNew(v => !v)}
                aria-label={showNew ? '隐藏密码' : '显示密码'}
              >
                {showNew ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>
            <div style={{ marginBottom: 16, position: 'relative' }}>
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="确认新密码"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? '隐藏密码' : '显示密码'}
              >
                {showConfirm ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>
            {error && <div style={{ color: 'red', margin: '8px 0' }}>{error}</div>}
            {success && <div style={{ color: 'green', margin: '8px 0' }}>密码修改成功</div>}
            <Button type="submit" variant="primary" loading={loading} fullWidth>
              修改密码
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
