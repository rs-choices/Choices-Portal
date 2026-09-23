import { redirect } from 'next/navigation';

// There is no auth yet, so the user is treated as signed in and lands on the
// dashboard. Point this at /sign-in once sessions exist.
export default function Home() {
  redirect('/dashboard');
}
