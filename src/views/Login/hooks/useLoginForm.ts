import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSignInMutation } from "@/hooks";

export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const signInMutation = useSignInMutation();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const redirectTo =
    typeof location.state === "object" &&
    location.state &&
    "from" in location.state &&
    location.state.from &&
    typeof location.state.from === "object" &&
    "pathname" in location.state.from &&
    typeof location.state.from.pathname === "string"
      ? location.state.from.pathname
      : "/profile";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const accountValue = account.trim();
    const passwordValue = password.trim();

    if (!accountValue) {
      setError("请填写手机号或邮箱");
      return;
    }

    if (!passwordValue) {
      setError("请输入密码");
      return;
    }

    setError("");

    try {
      await signInMutation.mutateAsync({
        account: accountValue,
        password: passwordValue,
      });
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "登录失败",
      );
    }
  }

  return {
    account,
    error,
    handleSubmit,
    password,
    setAccount,
    setPassword,
    submitting: signInMutation.isPending,
  };
}
