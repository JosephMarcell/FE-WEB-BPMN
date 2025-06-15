// Ini ada karena di backend dan frontend nya beda page passingnya
// Backend mengirimkan link dengan format: /reset-password?token=xyz tetapi frontend mengharapkan format: /auth/new_password?token=xyz.
// Jadi di page ini nanti dipassing ke page new_password

import { redirect } from 'next/navigation';

export default function ResetPasswordRedirect({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    redirect('/auth/forgot_password');
  }

  redirect(`/auth/new_password?token=${token}`);
}
