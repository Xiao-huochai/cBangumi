import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUser } from "@/api";
import { useAuthStore } from "@/store";

export function useRegisterForm() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nameValue = name.trim();
    const phoneValue = phone.trim();
    const emailValue = email.trim();
    const passwordValue = password.trim();
    const confirmPasswordValue = confirmPassword.trim();

    if (!nameValue) {
      setError("请填写昵称");
      return;
    }

    if (!phoneValue && !emailValue) {
      setError("请至少填写手机号或邮箱");
      return;
    }

    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("请输入有效的邮箱地址");
      return;
    }

    if (phoneValue && !/^1\d{10}$/.test(phoneValue)) {
      setError("请输入 11 位手机号");
      return;
    }

    if (passwordValue.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      setError("两次输入的密码不一致");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createUser({
        name: nameValue,
        phone: phoneValue || undefined,
        email: emailValue || undefined,
        password: passwordValue,
      });
      await signIn(emailValue || phoneValue, passwordValue);
      navigate("/profile", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "注册失败",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    confirmPassword,
    email,
    error,
    handleSubmit,
    name,
    password,
    phone,
    setConfirmPassword,
    setEmail,
    setName,
    setPassword,
    setPhone,
    submitting,
  };
}
