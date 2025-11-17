import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to coming-soon page during development
  redirect('/coming-soon');
}

