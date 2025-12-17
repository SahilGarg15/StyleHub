import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/contexts/AppContext';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthContext();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(loginData.email, loginData.password)) {
      navigate('/');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }
    if (register(registerData.email, registerData.password, registerData.name)) {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div><Label htmlFor="login-email">Email</Label><Input id="login-email" type="email" required value={loginData.email} onChange={(e) => setLoginData(d => ({ ...d, email: e.target.value }))} /></div>
              <div><Label htmlFor="login-password">Password</Label><Input id="login-password" type="password" required value={loginData.password} onChange={(e) => setLoginData(d => ({ ...d, password: e.target.value }))} /></div>
              <Button type="submit" className="w-full gradient-primary text-white">Login</Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div><Label htmlFor="reg-name">Name</Label><Input id="reg-name" required value={registerData.name} onChange={(e) => setRegisterData(d => ({ ...d, name: e.target.value }))} /></div>
              <div><Label htmlFor="reg-email">Email</Label><Input id="reg-email" type="email" required value={registerData.email} onChange={(e) => setRegisterData(d => ({ ...d, email: e.target.value }))} /></div>
              <div><Label htmlFor="reg-password">Password</Label><Input id="reg-password" type="password" required value={registerData.password} onChange={(e) => setRegisterData(d => ({ ...d, password: e.target.value }))} /></div>
              <div><Label htmlFor="reg-confirm">Confirm Password</Label><Input id="reg-confirm" type="password" required value={registerData.confirmPassword} onChange={(e) => setRegisterData(d => ({ ...d, confirmPassword: e.target.value }))} /></div>
              <Button type="submit" className="w-full gradient-primary text-white">Create Account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Auth;
