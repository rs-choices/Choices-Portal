import { redirect } from 'next/navigation';

// "Business profile" became Branches: each branch (and each outlet of a big
// branch) has its own place details there. Old links land on Branches.
export default function Page() {
  redirect('/branches');
}
