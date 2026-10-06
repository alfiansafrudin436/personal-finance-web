import { redirect } from 'next/navigation';

/**
 * The entry point only forwards: the login page sends an already-signed-in
 * visitor on to the dashboard, which is a decision that needs the token and
 * therefore has to happen on the client.
 */
export default function Home() {
  redirect('/login');
}
