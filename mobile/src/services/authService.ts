import { supabase } from "../config/supabase";

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({
  fullName,
  email,
  password,
}: SignUpData) {
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signIn({
  email,
  password,
}: SignInData) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function verifyEmailOtp(
  email: string,
  token: string
) {
  const { data, error } =
    await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: "email",
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function resendSignupOtp(
  email: string
) {
  const { data, error } =
    await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentSession() {
  const { data, error } =
    await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export async function getCurrentUser() {
  const { data, error } =
    await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function sendPasswordResetEmail(
  email: string
) {
  const { data, error } =
    await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase()
    );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}